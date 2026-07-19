import { getOrCreateStripeCustomer } from "@/lib/billing";
import { getViewer } from "@/lib/auth-context";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST() {
  const viewer = await getViewer();
  if (!viewer) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isStripeConfigured()) {
    return Response.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const customer = await getOrCreateStripeCustomer(viewer.userId);
  if (!customer) {
    return Response.json(
      { error: "Stripe customer not found" },
      { status: 404 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const session = await getStripe().billingPortal.sessions.create({
    customer,
    return_url: `${appUrl}/dashboard`,
  });

  return Response.json({ url: session.url });
}
