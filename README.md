# Snoball Media

The public Snoball Media site and the authenticated client site-management
workspace at `/dashboard`.

## Development

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local`. With no Clerk keys, local development uses
a labeled Kokos Bowls account. Production requires Clerk. Run `codex login` on
the local machine, or configure a trusted runner with `CODEX_ACCESS_TOKEN`.

## Dashboard architecture

- Every client website belongs to a Clerk Organization. Organization membership
  is the access boundary, and backend-managed metadata connects that
  Organization to the live URL and private repository.
- Snoball administrators can create an Organization, connect its repository,
  and add or invite the business owner through `/dashboard/onboarding`.
- The browser submits edit requests to `/api/codex` and consumes an NDJSON
  stream of plain-language status, response, usage, and draft events.
- Each request runs in a fresh private clone, creates a review branch, and opens
  a private GitHub draft. Clients never supply filesystem paths or repository
  names to the assistant endpoint.
- Codex receives only the verified site workspace, workspace-write permissions,
  no network access, and a reduced environment without application secrets.
- Stripe Checkout, Billing Portal, webhook, and optional usage-meter routes are
  under `/api/billing`.

Kokos Bowls is the first real organization-backed site. Additional clients use
the same onboarding flow rather than code changes or demo records.

## Production runner

The Next.js app can deploy through Vercel. The assistant clones each private
repository into an isolated temporary workspace, so edits do not depend on a
durable Vercel filesystem. Production needs `SNOBALL_GITHUB_TOKEN` for private
repository access and `CODEX_ACCESS_TOKEN` for trusted Codex automation.

Validate with:

```bash
pnpm exec tsc --noEmit
pnpm build
```
