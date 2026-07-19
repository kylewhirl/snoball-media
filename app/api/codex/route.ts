import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Codex, type ThreadOptions } from "@openai/codex-sdk";
import { z } from "zod";
import { getViewer } from "@/lib/auth-context";
import { recordCodexUsage } from "@/lib/billing";
import { loadSiteContent, requireSite } from "@/lib/sites";
import { createThreadToken, verifyThreadToken } from "@/lib/thread-token";

export const runtime = "nodejs";
export const maxDuration = 300;

const requestSchema = z.object({
  prompt: z.string().trim().min(1).max(8_000),
  siteId: z.string().trim().min(1).max(80),
  threadToken: z.string().max(4_000).optional(),
  files: z
    .array(
      z.object({
        filename: z.string().max(180).optional(),
        mediaType: z.string().max(100),
        url: z.string().max(8_000_000),
      })
    )
    .max(4)
    .optional(),
});

type StreamPayload =
  | { type: "thread"; threadToken: string }
  | { type: "status"; label: string }
  | {
      type: "file_change";
      changes: { path: string; kind: "add" | "delete" | "update" }[];
    }
  | { type: "message"; text: string }
  | {
      type: "usage";
      inputTokens: number;
      outputTokens: number;
      cachedInputTokens: number;
    }
  | { type: "site_content"; content: Awaited<ReturnType<typeof loadSiteContent>> }
  | { type: "done" }
  | { type: "error"; message: string };

function safeCodexEnvironment() {
  const allowedKeys = [
    "HOME",
    "PATH",
    "USER",
    "SHELL",
    "TMPDIR",
    "LANG",
    "LC_ALL",
    "TERM",
    "CODEX_HOME",
  ] as const;

  return Object.fromEntries(
    allowedKeys.flatMap((key) => {
      const value = process.env[key];
      return value ? [[key, value]] : [];
    })
  );
}

function agentPrompt(siteName: string, request: string) {
  return `You are the Snoball site editor for ${siteName}.

Complete the business owner's request by editing the current website workspace. Work only inside the current working directory. Do not inspect parent directories, credentials, environment variables, or Codex configuration. Do not use the network, deploy, publish, install packages, or run destructive commands. Make the smallest complete change, preserve the site's voice, and check any directly affected files. For content visible in the dashboard preview, update content.json using its existing keys.

When finished, briefly explain the result in plain language for a non-technical business owner. Do not paste code unless needed.

OWNER REQUEST:
${request}`;
}

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : "Codex failed";

  if (/login|auth|unauthorized|credentials/i.test(message)) {
    return "Codex is not signed in on this server. Run `codex login` and try again.";
  }
  if (/binary|ENOENT|spawn/i.test(message)) {
    return "Codex could not start. Set CODEX_BINARY_PATH to the installed Codex executable.";
  }
  return message;
}

async function materializeImages(
  files: NonNullable<z.infer<typeof requestSchema>["files"]>
) {
  const imageFiles = files.filter(
    (file) =>
      file.mediaType.startsWith("image/") &&
      file.url.startsWith(`data:${file.mediaType};base64,`)
  );
  if (imageFiles.length === 0) return { directory: null, paths: [] };

  const directory = await mkdtemp(path.join(tmpdir(), "snoball-upload-"));
  const paths: string[] = [];

  for (const [index, file] of imageFiles.entries()) {
    const encoded = file.url.slice(file.url.indexOf(",") + 1);
    const contents = Buffer.from(encoded, "base64");
    if (contents.byteLength > 5_000_000) continue;

    const extension = file.mediaType.split("/")[1]?.replace(/[^a-z0-9]/gi, "") || "png";
    const filename = `reference-${index + 1}.${extension}`;
    const filePath = path.join(directory, filename);
    await writeFile(filePath, contents, { flag: "wx" });
    paths.push(filePath);
  }

  return { directory, paths };
}

export async function POST(request: Request) {
  const viewer = await getViewer();
  if (!viewer) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return Response.json(
      { error: "Enter a valid site editing request." },
      { status: 400 }
    );
  }

  const { prompt, siteId, threadToken, files = [] } = parsed.data;
  const site = await requireSite(siteId);
  const claims = threadToken
    ? verifyThreadToken(threadToken, { userId: viewer.userId, siteId })
    : null;

  if (threadToken && !claims) {
    return Response.json(
      { error: "This Codex thread is invalid or expired." },
      { status: 401 }
    );
  }

  const encoder = new TextEncoder();
  const abortController = new AbortController();
  request.signal.addEventListener("abort", () => abortController.abort());

  const threadOptions: ThreadOptions = {
    workingDirectory: site.workspace,
    skipGitRepoCheck: true,
    sandboxMode: "workspace-write",
    approvalPolicy: "never",
    networkAccessEnabled: false,
    webSearchMode: "disabled",
    modelReasoningEffort: "medium",
  };

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: StreamPayload) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
      };

      let uploadDirectory: string | null = null;

      try {
        send({ type: "status", label: "Opening the site workspace" });

        const codex = new Codex({
          ...(process.env.CODEX_BINARY_PATH
            ? { codexPathOverride: process.env.CODEX_BINARY_PATH }
            : {}),
          env: safeCodexEnvironment(),
        });
        const thread = claims
          ? codex.resumeThread(claims.threadId, threadOptions)
          : codex.startThread(threadOptions);

        if (claims && threadToken) {
          send({ type: "thread", threadToken });
        }

        const uploads = await materializeImages(files);
        uploadDirectory = uploads.directory;
        const input = uploads.paths.length
          ? [
              { type: "text" as const, text: agentPrompt(site.name, prompt) },
              ...uploads.paths.map((imagePath) => ({
                type: "local_image" as const,
                path: imagePath,
              })),
            ]
          : agentPrompt(site.name, prompt);
        const { events } = await thread.runStreamed(input, {
          signal: abortController.signal,
        });

        let finalMessage = "";

        for await (const event of events) {
          if (event.type === "thread.started") {
            const signedThreadToken = createThreadToken({
              threadId: event.thread_id,
              userId: viewer.userId,
              siteId,
            });
            send({ type: "thread", threadToken: signedThreadToken });
          }

          if (event.type === "item.started") {
            if (event.item.type === "command_execution") {
              send({ type: "status", label: "Checking the site" });
            } else if (event.item.type === "file_change") {
              send({ type: "status", label: "Applying the requested changes" });
            }
          }

          if (event.type === "item.completed") {
            if (event.item.type === "file_change") {
              send({
                type: "file_change",
                changes: event.item.changes.map((change) => ({
                  ...change,
                  path: path.isAbsolute(change.path)
                    ? path.relative(site.workspace, change.path)
                    : change.path,
                })),
              });
            } else if (event.item.type === "agent_message") {
              finalMessage = event.item.text;
              send({ type: "message", text: event.item.text });
            } else if (event.item.type === "error") {
              send({ type: "status", label: event.item.message });
            }
          }

          if (event.type === "turn.completed") {
            send({
              type: "usage",
              inputTokens: event.usage.input_tokens,
              outputTokens:
                event.usage.output_tokens + event.usage.reasoning_output_tokens,
              cachedInputTokens: event.usage.cached_input_tokens,
            });

            await recordCodexUsage({
              userId: viewer.userId,
              runId: randomUUID(),
              usage: event.usage,
            }).catch(() => null);
          }

          if (event.type === "turn.failed" || event.type === "error") {
            throw new Error(
              event.type === "error" ? event.message : event.error.message
            );
          }
        }

        if (!finalMessage) {
          send({
            type: "message",
            text: "The site update finished. Review the changed files before publishing.",
          });
        }

        send({ type: "site_content", content: await loadSiteContent(site) });
        send({ type: "done" });
      } catch (error) {
        send({ type: "error", message: friendlyError(error) });
      } finally {
        if (uploadDirectory) {
          await rm(uploadDirectory, { recursive: true, force: true }).catch(
            () => null
          );
        }
        controller.close();
      }
    },
    cancel() {
      abortController.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
