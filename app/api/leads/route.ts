import { NextResponse } from "next/server"
import { z } from "zod"
import { getResend } from "@/lib/resend"

export const runtime = "nodejs"

const leadSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  website: z.string().max(200).optional().default(""),
})

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin")
  const host = request.headers.get("host")

  if (!origin || !host) {
    return false
  }

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 })
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0)

  if (contentLength > 4_096) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const parsedLead = leadSchema.safeParse(body)

  if (!parsedLead.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  }

  const { email, website } = parsedLead.data

  // Silently accept honeypot submissions so automated form fillers do not retry.
  if (website) {
    return NextResponse.json({ ok: true })
  }

  const submittedAt = new Date().toISOString()

  // This remains available in Vercel function logs even when email is not configured.
  console.info(
    "[lead:availability-request]",
    JSON.stringify({ email, submittedAt, source: "availability-form" }),
  )

  const resend = getResend()

  if (!resend) {
    console.warn(
      "[lead:notification-skipped] RESEND_API_KEY is not configured; the lead was retained in function logs.",
    )
    return NextResponse.json({ ok: true })
  }

  const recipient = process.env.LEAD_NOTIFICATION_EMAIL ?? "contact@snoball.media"
  const sender =
    process.env.LEAD_FROM_EMAIL ?? "Snoball Website <contact@snoball.media>"

  const { error } = await resend.emails.send({
    from: sender,
    to: recipient,
    replyTo: email,
    subject: `New availability request from ${email}`,
    text: [
      "A visitor requested to view your available meeting times.",
      "",
      `Email: ${email}`,
      `Submitted: ${submittedAt}`,
      "Source: snoball.media availability form",
      "",
      "Reply to this email to contact them directly.",
    ].join("\n"),
  })

  if (error) {
    console.error(
      "[lead:notification-failed]",
      JSON.stringify({ name: error.name, message: error.message }),
    )
  }

  return NextResponse.json({ ok: true })
}
