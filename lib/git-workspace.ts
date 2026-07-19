import "server-only";

import { randomUUID } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import type { SiteRecord } from "@/lib/sites";

const execFile = promisify(execFileCallback);
const repositoryPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

export type PreparedWorkspace = {
  directory: string;
  repository: string;
  defaultBranch: string;
  token: string | null;
  cleanup: () => Promise<void>;
};

export type ReviewDraft = {
  url: string;
  number: number | null;
  title: string;
};

async function localGitHubToken() {
  if (process.env.NODE_ENV === "production") return null;
  try {
    const result = await execFile("gh", ["auth", "token"], {
      timeout: 5_000,
      encoding: "utf8",
    });
    return result.stdout.trim() || null;
  } catch {
    return null;
  }
}

async function githubToken() {
  return process.env.SNOBALL_GITHUB_TOKEN?.trim() || (await localGitHubToken());
}

function gitEnvironment(token: string | null) {
  const environment: NodeJS.ProcessEnv = {
    ...process.env,
    GIT_TERMINAL_PROMPT: "0",
  };
  if (token) {
    environment.GIT_CONFIG_COUNT = "1";
    environment.GIT_CONFIG_KEY_0 = "http.https://github.com/.extraheader";
    environment.GIT_CONFIG_VALUE_0 = `AUTHORIZATION: basic ${Buffer.from(
      `x-access-token:${token}`
    ).toString("base64")}`;
  }
  return environment;
}

async function git(
  args: string[],
  options: { cwd?: string; token?: string | null } = {}
) {
  return execFile("git", args, {
    cwd: options.cwd,
    env: gitEnvironment(options.token ?? null),
    timeout: 120_000,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
}

export async function prepareSiteWorkspace(
  site: SiteRecord
): Promise<PreparedWorkspace> {
  if (!site.repository || !repositoryPattern.test(site.repository)) {
    throw new Error("This website is not connected to its private workspace yet.");
  }

  const token = await githubToken();
  const parent = await mkdtemp(path.join(tmpdir(), "snoball-site-"));
  const directory = path.join(parent, "workspace");

  try {
    if (site.localWorkspace) {
      await git(["clone", "--no-hardlinks", site.localWorkspace, directory]);
      await git(
        [
          "remote",
          "set-url",
          "origin",
          `https://github.com/${site.repository}.git`,
        ],
        { cwd: directory }
      );
    } else {
      if (!token) {
        throw new Error("The private website connection needs to be authorized.");
      }
      await git(
        [
          "clone",
          "--depth",
          "1",
          "--branch",
          site.defaultBranch,
          `https://github.com/${site.repository}.git`,
          directory,
        ],
        { token }
      );
    }

    return {
      directory,
      repository: site.repository,
      defaultBranch: site.defaultBranch,
      token,
      cleanup: () => rm(parent, { recursive: true, force: true }),
    };
  } catch (error) {
    await rm(parent, { recursive: true, force: true }).catch(() => null);
    throw error;
  }
}

function draftTitle(request: string) {
  const clean = request.replace(/\s+/g, " ").trim();
  const short = clean.length > 64 ? `${clean.slice(0, 61)}…` : clean;
  return short || "Website update";
}

export async function createReviewDraft(
  workspace: PreparedWorkspace,
  request: string
): Promise<ReviewDraft | null> {
  const status = await git(["status", "--porcelain"], { cwd: workspace.directory });
  if (!status.stdout.trim()) return null;

  const branch = `snoball/draft-${Date.now()}-${randomUUID().slice(0, 6)}`;
  const title = draftTitle(request);
  await git(["switch", "-c", branch], { cwd: workspace.directory });
  await git(["config", "user.name", "Snoball Site Assistant"], {
    cwd: workspace.directory,
  });
  await git(["config", "user.email", "hello@snoball.media"], {
    cwd: workspace.directory,
  });
  await git(["add", "-A"], { cwd: workspace.directory });
  await git(["commit", "-m", title], { cwd: workspace.directory });
  await git(["push", "origin", `HEAD:refs/heads/${branch}`], {
    cwd: workspace.directory,
    token: workspace.token,
  });

  const [owner, repository] = workspace.repository.split("/");
  if (!workspace.token) {
    return {
      url: `https://github.com/${workspace.repository}/compare/${workspace.defaultBranch}...${branch}?expand=1`,
      number: null,
      title,
    };
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repository}/pulls`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${workspace.token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        title,
        head: branch,
        base: workspace.defaultBranch,
        body: "Private website draft prepared through the Snoball client dashboard.",
      }),
    }
  );
  if (!response.ok) {
    return {
      url: `https://github.com/${workspace.repository}/compare/${workspace.defaultBranch}...${branch}?expand=1`,
      number: null,
      title,
    };
  }

  const pullRequest = (await response.json()) as {
    html_url: string;
    number: number;
  };
  return {
    url: pullRequest.html_url,
    number: pullRequest.number,
    title,
  };
}
