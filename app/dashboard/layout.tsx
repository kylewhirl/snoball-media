import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "The AI workspace for managing Snoball client websites.",
  robots: { index: false, follow: false },
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="dark min-h-screen font-sans">{children}</div>
}
