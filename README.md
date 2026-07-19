# Snoball Media

The public Snoball Media site and the authenticated client site-management
workspace at `/dashboard`.

## Development

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local`. With no Clerk keys, local development uses
a labeled demo account. Production requires Clerk. Run `codex login` on the
persistent machine or worker that will execute site edits.

## Dashboard architecture

- Clerk authenticates dashboard users and stores the matching Stripe customer
  ID in private user metadata.
- The browser submits edit requests to `/api/codex` and consumes an NDJSON
  stream of status, file-change, response, usage, and preview-content events.
- Codex receives only a server-resolved site workspace, workspace-write
  permissions, no network access, and a reduced environment without app
  secrets.
- Browser thread tokens are signed and scoped to both the user and site.
- Stripe Checkout, Billing Portal, webhook, and optional usage-meter routes are
  under `/api/billing`.

The included Marigold workspace is a safe demo. Register real client workspaces
server-side in `lib/sites.ts`; never accept a filesystem path from the browser.

## Production runner

The Next.js app can deploy through Vercel, but Codex code editing should run in
an isolated persistent worker/container with the client worktree mounted.
Vercel Functions do not provide the durable writable worktree or local Codex
login expected by the current runner.

Validate with:

```bash
pnpm exec tsc --noEmit
pnpm build
```
