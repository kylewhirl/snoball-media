import { redirect } from "next/navigation"
import { connection } from "next/server"
import { SnoballWorkspace } from "@/components/snoball-workspace"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getViewer, isClerkConfigured } from "@/lib/auth-context"
import { getSite, loadSiteContent } from "@/lib/sites"

export default async function DashboardPage() {
  await connection()
  const viewer = await getViewer()

  if (!viewer && isClerkConfigured()) redirect("/sign-in")

  if (!viewer) {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-6 text-foreground">
        <div className="max-w-md space-y-3 text-center">
          <p className="text-sm font-semibold">Snoball needs authentication</p>
          <p className="text-sm leading-6 text-muted-foreground">
            Add the Clerk environment variables from .env.example to run the
            production dashboard.
          </p>
        </div>
      </main>
    )
  }

  const content = await loadSiteContent(getSite("marigold"))

  return (
    <TooltipProvider>
      <SnoballWorkspace
        authEnabled={isClerkConfigured()}
        initialSiteContent={content}
        viewer={viewer}
      />
    </TooltipProvider>
  )
}
