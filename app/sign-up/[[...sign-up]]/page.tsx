import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { isClerkConfigured } from "@/lib/auth-context";

export default function SignUpPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6 text-foreground">
        <div className="max-w-sm space-y-4 text-center">
          <h1 className="text-lg font-semibold">Clerk is not configured</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Add your Clerk keys to .env.local, then restart the development
            server.
          </p>
          <Link className="text-sm text-primary hover:underline" href="/">
            Return to Snoball
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </main>
  );
}
