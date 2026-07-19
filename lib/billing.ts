import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import type { Usage } from "@openai/codex-sdk";
import { isClerkConfigured } from "@/lib/auth-context";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function getOrCreateStripeCustomer(userId: string) {
  if (!isStripeConfigured()) return null;

  if (!isClerkConfigured()) {
    return process.env.STRIPE_DEMO_CUSTOMER_ID ?? null;
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const existingCustomerId = user.privateMetadata.stripeCustomerId;

  if (typeof existingCustomerId === "string") return existingCustomerId;

  const email = user.primaryEmailAddress?.emailAddress;
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const customer = await getStripe().customers.create({
    email,
    name: name || undefined,
    metadata: { clerkUserId: userId },
  });

  await clerk.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...user.privateMetadata,
      stripeCustomerId: customer.id,
    },
  });

  return customer.id;
}

export async function recordCodexUsage({
  userId,
  runId,
  usage,
}: {
  userId: string;
  runId: string;
  usage: Usage;
}) {
  if (process.env.SNOBALL_BILLING_MODE !== "metered") {
    return { recorded: false, reason: "billing_disabled" } as const;
  }

  const eventName = process.env.STRIPE_CODEX_METER_EVENT_NAME;
  const customerId = await getOrCreateStripeCustomer(userId);
  if (!eventName || !customerId) {
    return { recorded: false, reason: "billing_not_configured" } as const;
  }

  const billableTokens =
    usage.input_tokens + usage.output_tokens + usage.reasoning_output_tokens;

  await getStripe().billing.meterEvents.create({
    event_name: eventName,
    identifier: runId,
    payload: {
      stripe_customer_id: customerId,
      value: String(billableTokens),
    },
  });

  return { recorded: true, billableTokens } as const;
}
