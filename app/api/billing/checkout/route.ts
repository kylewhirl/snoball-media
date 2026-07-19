import { getOrCreateStripeCustomer } from "@/lib/billing";
import { getViewer } from "@/lib/auth-context";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST() {
  const viewer = await getViewer();
  if (!viewer) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const basePriceId = process.env.STRIPE_BASE_PRICE_ID;

  if (!isStripeConfigured() || !basePriceId) {
    return Response.json(
      { error: "Stripe checkout is not configured" },
      { status: 503 }
    );
  }

  const customer = await getOrCreateStripeCustomer(viewer.userId);
  if (!customer) {
    return Response.json(
      { error: "A Stripe customer could not be created" },
      { status: 503 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const meteredPriceId = process.env.STRIPE_METERED_PRICE_ID;
  const lineItems = [
    { price: basePriceId, quantity: 1 },
    ...(meteredPriceId ? [{ price: meteredPriceId }] : []),
  ];

  const session = await getStripe().checkout.sessions.create({
    customer,
    mode: "subscription",
    line_items: lineItems,
    client_reference_id: viewer.userId,
    metadata: { clerkUserId: viewer.userId },
    success_url: `${appUrl}/dashboard?billing=success`,
    cancel_url: `${appUrl}/dashboard?billing=canceled`,
  });

  return Response.json({ url: session.url });
}
