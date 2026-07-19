import "server-only";

import { auth, clerkClient } from "@clerk/nextjs/server";

export type Viewer = {
  userId: string;
  organizationId: string | null;
  displayName: string;
  initials: string;
  isDemo: boolean;
};

export function isClerkConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.CLERK_SECRET_KEY
  );
}

function initialsFor(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SM";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export async function getViewer(): Promise<Viewer | null> {
  if (!isClerkConfigured()) {
    if (process.env.NODE_ENV === "production") return null;

    return {
      userId: "user_local_demo",
      organizationId: "org_snoball_demo",
      displayName: "Kyle",
      initials: "KB",
      isDemo: true,
    };
  }

  const session = await auth();
  if (!session.userId) return null;

  const client = await clerkClient();
  const user = await client.users.getUser(session.userId);
  const email = user.primaryEmailAddress?.emailAddress ?? "Snoball user";
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || email;

  return {
    userId: session.userId,
    organizationId: session.orgId ?? null,
    displayName,
    initials: initialsFor(displayName),
    isDemo: false,
  };
}
