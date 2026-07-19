"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function siteIdFor(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function SiteOnboardingForm() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [siteId, setSiteId] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [repository, setRepository] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string>();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setError(undefined);

    const response = await fetch("/api/onboarding/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessName, siteId, siteUrl, repository, memberEmail }),
    });
    const body = (await response.json().catch(() => null)) as
      | { error?: string; organizationId?: string }
      | null;

    if (!response.ok || !body?.organizationId) {
      setError(body?.error ?? "The website could not be added.");
      setStatus("idle");
      return;
    }

    setStatus("done");
    router.push(`/dashboard?organization=${encodeURIComponent(body.organizationId)}`);
    router.refresh();
  }

  return (
    <main className="h-[100dvh] overflow-y-auto bg-background text-foreground">
      <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 sm:py-12">
        <Button className="-ml-3 mb-8 gap-2" onClick={() => router.push("/dashboard")} variant="ghost">
          <ArrowLeft className="size-4" /> Back to websites
        </Button>
        <p className="text-sm font-medium text-primary">Client onboarding</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Add a website</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Create the client workspace, connect its private repository, and give the business owner access in one step.
        </p>

        <form className="mt-10 space-y-6" onSubmit={submit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business name</Label>
              <Input
                id="business-name"
                onChange={(event) => {
                  setBusinessName(event.target.value);
                  setSiteId(siteIdFor(event.target.value));
                }}
                placeholder="Kokos Bowls"
                required
                value={businessName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-email">Owner email</Label>
              <Input id="member-email" onChange={(event) => setMemberEmail(event.target.value)} placeholder="owner@example.com" required type="email" value={memberEmail} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-url">Live website</Label>
            <Input id="site-url" onChange={(event) => setSiteUrl(event.target.value)} placeholder="https://example.com" required type="url" value={siteUrl} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repository">Private repository</Label>
            <Input id="repository" onChange={(event) => setRepository(event.target.value)} placeholder="kylewhirl/example-site" required value={repository} />
            <p className="text-xs text-muted-foreground">Only Snoball administrators see this connection.</p>
          </div>
          <input name="siteId" type="hidden" value={siteId} />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="gap-2" disabled={status !== "idle"} type="submit">
            {status === "saving" ? <Loader2 className="size-4 animate-spin" /> : status === "done" ? <CheckCircle2 className="size-4" /> : null}
            {status === "saving" ? "Setting up workspace" : status === "done" ? "Website added" : "Add website and owner"}
          </Button>
        </form>
      </div>
    </main>
  );
}
