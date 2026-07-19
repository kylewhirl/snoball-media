import "server-only";

import { stat } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { clerkClient } from "@clerk/nextjs/server";
import type { Viewer } from "@/lib/auth-context";

export type SiteRecord = {
  id: string;
  name: string;
  url: string;
  organizationId: string;
  organizationName: string;
  repository: string | null;
  defaultBranch: string;
  localWorkspace: string | null;
};

type OrganizationSiteMetadata = {
  siteId?: unknown;
  siteName?: unknown;
  siteUrl?: unknown;
  repository?: unknown;
  defaultBranch?: unknown;
  workspaceKey?: unknown;
};

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

async function localWorkspaceFor(workspaceKey: string | null) {
  if (!workspaceKey || process.env.NODE_ENV === "production") return null;

  const configured =
    workspaceKey === "kokos-bowls"
      ? process.env.SNOBALL_KOKOS_WORKSPACE
      : undefined;
  const candidate = configured
    ? path.resolve(configured)
    : path.join(homedir(), workspaceKey);
  const info = await stat(candidate).catch(() => null);
  return info?.isDirectory() ? candidate : null;
}

async function siteFromOrganization(
  organization: {
    id: string;
    name: string;
    publicMetadata: unknown;
    privateMetadata: unknown;
  }
): Promise<SiteRecord | null> {
  const publicMetadata = (organization.publicMetadata ?? {}) as OrganizationSiteMetadata;
  const privateMetadata = (organization.privateMetadata ?? {}) as OrganizationSiteMetadata;
  const siteId = stringValue(privateMetadata.siteId) ?? stringValue(publicMetadata.siteId);
  if (!siteId) return null;

  const workspaceKey = stringValue(privateMetadata.workspaceKey);
  return {
    id: siteId,
    name:
      stringValue(publicMetadata.siteName) ?? organization.name,
    url: stringValue(publicMetadata.siteUrl) ?? "",
    organizationId: organization.id,
    organizationName: organization.name,
    repository: stringValue(privateMetadata.repository),
    defaultBranch: stringValue(privateMetadata.defaultBranch) ?? "main",
    localWorkspace: await localWorkspaceFor(workspaceKey),
  };
}

function demoKokosSite(): SiteRecord {
  return {
    id: "kokos-bowls",
    name: "Kokos Bowls",
    url: "https://kokos-korean-kitchen.kylewhirl.chatgpt.site",
    organizationId: "org_local_kokos",
    organizationName: "Kokos Bowls",
    repository: "kylewhirl/kokos-bowls",
    defaultBranch: "main",
    localWorkspace: path.join(homedir(), "kokos-bowls"),
  };
}

export async function getSitesForViewer(viewer: Viewer): Promise<SiteRecord[]> {
  if (viewer.isDemo) return [demoKokosSite()];

  const client = await clerkClient();
  const memberships = await client.users.getOrganizationMembershipList({
    userId: viewer.userId,
    limit: 100,
  });
  const organizations = await Promise.all(
    memberships.data.map((membership) =>
      client.organizations.getOrganization({
        organizationId: membership.organization.id,
      })
    )
  );
  const sites = await Promise.all(organizations.map(siteFromOrganization));
  return sites.filter((site): site is SiteRecord => Boolean(site));
}

export async function requireSiteForViewer(
  viewer: Viewer,
  organizationId: string
) {
  const sites = await getSitesForViewer(viewer);
  const site = sites.find((candidate) => candidate.organizationId === organizationId);
  if (!site) throw new Response("Website not found", { status: 404 });
  return site;
}
