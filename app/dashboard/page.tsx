import { redirect } from "next/navigation"
import { connection } from "next/server"
import Link from "next/link"
import { Plus } from "lucide-react"
import { SnoballWorkspace } from "@/components/snoball-workspace"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getViewer, isClerkConfigured } from "@/lib/auth-context"
import { getSitesForViewer } from "@/lib/sites"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ organization?: string }>
}) {
  await connection()
  const params = await searchParams
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

  const sites = await getSitesForViewer(viewer)
  if (sites.length === 0) {
    return (
      <main className="grid h-[100dvh] place-items-center overflow-hidden bg-background p-6 text-foreground">
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold">No websites are connected yet</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Ask Snoball to connect your business, or add the first website if you manage client onboarding.
          </p>
          {viewer.isAdmin && !viewer.isDemo && (
            <Button asChild className="mt-6 gap-2">
              <Link href="/dashboard/onboarding"><Plus className="size-4" /> Add a website</Link>
            </Button>
          )}
        </div>
      </main>
    )
  }

  const selectedSite =
    sites.find((site) => site.organizationId === params.organization) ??
    sites.find((site) => site.organizationId === viewer.organizationId) ??
    sites[0]
  const clientSites = sites.map(({ id, name, organizationId, url }) => ({
    id,
    name,
    organizationId,
    url,
  }))

  return (
    <TooltipProvider>
      <SnoballWorkspace
        authEnabled={isClerkConfigured()}
        site={{
          id: selectedSite.id,
          name: selectedSite.name,
          organizationId: selectedSite.organizationId,
          url: selectedSite.url,
        }}
        sites={clientSites}
        viewer={viewer}
      />
    </TooltipProvider>
  )
}
