import { redirect } from "next/navigation";
import { SiteOnboardingForm } from "@/components/site-onboarding-form";
import { getViewer } from "@/lib/auth-context";

export default async function SiteOnboardingPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/sign-in");
  if (!viewer.isAdmin || viewer.isDemo) redirect("/dashboard");
  return <SiteOnboardingForm />;
}
