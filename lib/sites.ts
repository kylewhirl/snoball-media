import "server-only";

import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { SiteContent } from "@/lib/site-types";

const defaultContent: SiteContent = {
  eyebrow: "Neighborhood bakery · Est. 2019",
  headline: "Sundays taste",
  emphasis: "better",
  body: "Laminated by hand, baked at sunrise, and best enjoyed with someone you like.",
  cta: "Preorder for Sunday",
  hours: "Open 7am—2pm",
};

export type SiteRecord = {
  id: "marigold";
  name: string;
  workspace: string;
};

export function getSite(siteId: string): SiteRecord | null {
  if (siteId !== "marigold") return null;

  const configuredWorkspace = process.env.SNOBALL_MARIGOLD_WORKSPACE;
  const workspace = configuredWorkspace
    ? path.resolve(configuredWorkspace)
    : path.join(process.cwd(), "demo-sites", "marigold");

  return {
    id: "marigold",
    name: "Marigold Bakery",
    workspace,
  };
}

export async function requireSite(siteId: string) {
  const site = getSite(siteId);
  if (!site) throw new Response("Site not found", { status: 404 });

  const info = await stat(site.workspace).catch(() => null);
  if (!info?.isDirectory()) {
    throw new Response("Site workspace is not configured", { status: 503 });
  }

  return site;
}

export async function loadSiteContent(
  site: SiteRecord | null
): Promise<SiteContent> {
  if (!site) return defaultContent;

  try {
    const raw = await readFile(path.join(site.workspace, "content.json"), "utf8");
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return { ...defaultContent, ...parsed };
  } catch {
    return defaultContent;
  }
}
