import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Codex, type ThreadOptions } from "@openai/codex-sdk";
import { z } from "zod";
import { getViewer } from "@/lib/auth-context";
import { recordCodexUsage } from "@/lib/billing";
import {
  createReviewDraft,
  prepareSiteWorkspace,
  type PreparedWorkspace,
} from "@/lib/git-workspace";
import { requireSiteForViewer } from "@/lib/sites";

export const runtime = "nodejs";
export const maxDuration = 300;

const requestSchema = z.object({
  prompt: z.string().trim().min(1).max(8_000),
  organizationId: z.string().trim().min(1).max(100),
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
  | { type: "status"; label: string }
  | { type: "progress"; changes: number }
  | { type: "message"; text: string }
  | { type: "draft"; title: string; url: string; number: number | null }
  | {
      type: "usage";
      inputTokens: number;
      outputTokens: number;
      cachedInputTokens: number;
    }
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
    "CODEX_ACCESS_TOKEN",
  ] as const;

  return Object.fromEntries(
    allowedKeys.flatMap((key) => {
      const value = process.env[key];
      return value ? [[key, value]] : [];
    })
  );
}

function agentPrompt(siteName: string, request: string) {
  return `You are the private Snoball website assistant for ${siteName}.

Complete the business owner's request in this website repository. Work only inside the current directory. Do not inspect credentials, environment variables, parent directories, or Codex configuration. Do not use the network, deploy, publish, install packages, or run destructive commands. Make the smallest complete change, preserve the existing brand and behavior, and run the most relevant existing validation when practical.

Your final response is shown directly to a non-technical business owner. Explain what changed in two or three plain-language sentences. Do not mention source code, filenames, commands, branches, commits, repositories, pull requests, or implementation details. Do not paste code.

OWNER REQUEST:
${request}`;
}

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : "The update failed.";

  if (/login|auth|unauthorized|credentials|access token/i.test(message)) {
    return "The private assistant connection needs to be authorized before it can make changes.";
  }
  if (/binary|ENOENT|spawn/i.test(message)) {
    return "The website assistant is temporarily unavailable.";
  }
  if (/repository|workspace|github|private website connection/i.test(message)) {
    return message;
  }
  return "I couldn’t prepare this update. Please try again, or contact Snoball if it continues.";
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

    const extension =
      file.mediaType.split("/")[1]?.replace(/[^a-z0-9]/gi, "") || "png";
    const filename = `reference-${index + 1}.${extension}`;
    const filePath = path.join(directory, filename);
    await writeFile(filePath, contents, { flag: "wx" });
    paths.push(filePath);
  }

  return { directory, paths };
}

export async function POST(request: Request) {
  const viewer = await getViewer();
  if (!viewer) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "Tell the assistant what you would like to change." },
      { status: 400 }
    );
  }

  const { prompt, organizationId, files = [] } = parsed.data;
  const site = await requireSiteForViewer(viewer, organizationId);
  const encoder = new TextEncoder();
  const abortController = new AbortController();
  request.signal.addEventListener("abort", () => abortController.abort());

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: StreamPayload) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
      };

      let uploadDirectory: string | null = null;
      let workspace: PreparedWorkspace | null = null;

      try {
        send({ type: "status", label: `Opening ${site.name}` });
        workspace = await prepareSiteWorkspace(site);
        const threadOptions: ThreadOptions = {
          workingDirectory: workspace.directory,
          skipGitRepoCheck: false,
          sandboxMode: "workspace-write",
          approvalPolicy: "never",
          networkAccessEnabled: false,
          webSearchMode: "disabled",
          modelReasoningEffort: "medium",
        };
        const codex = new Codex({
          ...(process.env.CODEX_BINARY_PATH
            ? { codexPathOverride: process.env.CODEX_BINARY_PATH }
            : {}),
          env: safeCodexEnvironment(),
        });
        const thread = codex.startThread(threadOptions);
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
        let changeCount = 0;

        for await (const event of events) {
          if (event.type === "item.started") {
            if (event.item.type === "command_execution") {
              send({ type: "status", label: "Checking the current website" });
            } else if (event.item.type === "file_change") {
              send({ type: "status", label: "Preparing your requested update" });
            }
          }

          if (event.type === "item.completed") {
            if (event.item.type === "file_change") {
              changeCount += event.item.changes.length;
              send({ type: "progress", changes: changeCount });
            } else if (event.item.type === "agent_message") {
              finalMessage = event.item.text;
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

        send({ type: "status", label: "Saving a private draft for review" });
        const draft = await createReviewDraft(workspace, prompt);
        send({
          type: "message",
          text:
            finalMessage ||
            (draft
              ? "Your requested update is ready to review. Nothing has been published."
              : "I checked the website and no update was needed."),
        });
        if (draft) {
          send({
            type: "draft",
            title: draft.title,
            url: draft.url,
            number: draft.number,
          });
        }
        send({ type: "done" });
      } catch (error) {
        send({ type: "error", message: friendlyError(error) });
      } finally {
        if (uploadDirectory) {
          await rm(uploadDirectory, { recursive: true, force: true }).catch(
            () => null
          );
        }
        if (workspace) await workspace.cleanup().catch(() => null);
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
