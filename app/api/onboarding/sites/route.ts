import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { getViewer } from "@/lib/auth-context";

export const runtime = "nodejs";

const requestSchema = z.object({
  businessName: z.string().trim().min(2).max(80),
  siteId: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  siteUrl: z.string().trim().url().max(300),
  repository: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/),
  memberEmail: z.string().trim().email().max(254),
});

export async function POST(request: Request) {
  const viewer = await getViewer();
  if (!viewer?.isAdmin || viewer.isDemo) {
    return Response.json({ error: "You do not have access to onboarding." }, { status: 403 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Check the website and member details." }, { status: 400 });
  }

  const { businessName, memberEmail, repository, siteId, siteUrl } = parsed.data;
  const client = await clerkClient();
  const existingOrganizations = await client.organizations.getOrganizationList({ limit: 100 });
  let organization = existingOrganizations.data.find(
    (candidate) =>
      candidate.publicMetadata?.siteId === siteId ||
      candidate.name.toLowerCase() === businessName.toLowerCase()
  );

  if (!organization) {
    organization = await client.organizations.createOrganization({
      name: businessName,
      createdBy: viewer.userId,
      publicMetadata: { siteId, siteName: businessName, siteUrl },
      privateMetadata: {
        siteId,
        workspaceKey: siteId,
        repository,
        defaultBranch: "main",
      },
    });
  } else {
    organization = await client.organizations.updateOrganizationMetadata(
      organization.id,
      {
        publicMetadata: { siteId, siteName: businessName, siteUrl },
        privateMetadata: {
          siteId,
          workspaceKey: siteId,
          repository,
          defaultBranch: "main",
        },
      }
    );
  }

  const users = await client.users.getUserList({
    emailAddress: [memberEmail],
    limit: 10,
  });
  const user = users.data.find((candidate) =>
    candidate.emailAddresses.some(
      (email) => email.emailAddress.toLowerCase() === memberEmail.toLowerCase()
    )
  );

  if (user) {
    const memberships = await client.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
      userId: [user.id],
      limit: 10,
    });
    if (memberships.data.length === 0) {
      await client.organizations.createOrganizationMembership({
        organizationId: organization.id,
        userId: user.id,
        role: "org:admin",
      });
    }
  } else {
    const invitations = await client.organizations.getOrganizationInvitationList({
      organizationId: organization.id,
      status: ["pending"],
      limit: 100,
    });
    const alreadyInvited = invitations.data.some(
      (invitation) =>
        invitation.emailAddress.toLowerCase() === memberEmail.toLowerCase()
    );
    if (!alreadyInvited) {
      await client.organizations.createOrganizationInvitation({
        organizationId: organization.id,
        inviterUserId: viewer.userId,
        emailAddress: memberEmail,
        role: "org:admin",
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://snoball.media"}/dashboard`,
      });
    }
  }

  return Response.json({
    organizationId: organization.id,
    name: organization.name,
    memberStatus: user ? "added" : "invited",
  });
}
