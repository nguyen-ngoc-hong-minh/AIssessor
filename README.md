# BENCHFLOW

BENCHFLOW turns a plain-language goal into an editable AI workflow, then recommends models from dated external evidence using deterministic, auditable scoring. The LLM plans the workflow; it never selects models.

## Architecture

- Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-style primitives, Lucide, React Hook Form, Zod, and React Flow
- Clerk for authentication and identity lifecycle
- Convex for persistent data, server functions, schedules, and signed webhook endpoints
- OpenAI Responses API Structured Outputs for task analysis and workflow planning
- Artificial Analysis and OpenRouter adapters for benchmarks, capabilities, and pricing
- Stripe Checkout, Customer Portal, subscriptions, and webhook-synchronized entitlements
- Vitest, React Testing Library, `convex-test`, and Playwright

The recommendation engine applies hard eligibility filters before scoring. Missing critical evidence excludes a model; it never silently invents a value or substitutes fixtures in production.

## Local setup

Prerequisites: Node.js 22+, Clerk, Convex, OpenAI, Artificial Analysis/OpenRouter, and Stripe accounts.

1. Install packages with `npm install`.
2. Copy `.env.example` to `.env.local` and supply provider credentials.
3. Run `npm run convex:dev`. This creates the Convex deployment, generates typed bindings, and prints the URL values to place in `.env.local`.
4. Configure Clerk's Convex JWT template, then set `CLERK_JWT_ISSUER_DOMAIN` in Convex.
5. Configure the signed webhooks below.
6. Start the app with `npm run dev`.

The checked-in `convex/_generated` files are minimal bootstrapping declarations for credential-free CI. Replace them by running `npm run convex:codegen` after linking a real Convex deployment.

## Required environment variables

See `.env.example` for the complete list. The essential groups are:

- App: `NEXT_PUBLIC_APP_URL`
- Clerk: publishable/secret keys, webhook secret, JWT issuer
- Convex: public URL and deployment identifier
- OpenAI: API key and planner model
- Model sources: Artificial Analysis and OpenRouter keys/base URLs
- Stripe: secret, webhook secret, price IDs, and public key

The application deliberately displays an integration notice and refuses persistent/product actions if Clerk or Convex browser configuration is missing.

## Webhooks and scheduled data sync

- Clerk webhook: `POST https://<your-convex-site>/webhooks/clerk`
- Stripe webhook: `POST https://<your-convex-site>/webhooks/stripe`

Subscribe Clerk to user created/updated/deleted events. Subscribe Stripe to checkout completion, subscription created/updated/deleted, and invoice payment failure events. Both endpoints verify signatures before writing data.

Convex cron jobs refresh Artificial Analysis and OpenRouter every 12 hours. Each run creates immutable source observations and a dated snapshot. Failed syncs are recorded and do not overwrite the previous snapshot.

## Verification

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:e2e
npm run build
npm run build:vercel
```

The public Playwright smoke flow runs locally. The credentialed production gate requires `E2E_BASE_URL`, `E2E_CLERK_TEST_EMAIL`, and `E2E_STRIPE_TEST_MODE`; it skips rather than faking a signed-in account or payment journey when those values are absent. Expand that gate against the configured staging tenant before launch.

## Deployment

### Convex

Run `npm run convex:deploy`, copy the production Convex URLs into the frontend environment, add all server-only secrets in the Convex dashboard, and register the production webhook URLs.

### Vercel

Import the repository, select Next.js, add all frontend/server environment variables, and deploy. `vercel.json` uses the native Next.js production build. Set `NEXT_PUBLIC_APP_URL` to the final HTTPS origin and use that same origin in Clerk and Stripe redirect allowlists.

### Post-deploy checks

Verify email and social sign-in, password recovery, the three-question onboarding gate, one-off and monthly strategy flows, workflow edits, result tabs, duplicate/delete actions, Stripe checkout/portal, team invitation permissions, webhook replay protection, and the timestamp/source links on every recommendation.

## Security and production limitations

- API routes authenticate through Clerk and pass a Clerk JWT to Convex.
- Convex functions enforce ownership or team role checks server-side.
- Stripe entitlements are derived from signed webhook state, never from client flags.
- Planner output is Zod-validated Structured Output and cannot name or recommend models.
- Provider tokens remain server-only.
- Full end-to-end acceptance requires real provider credentials, a deployed Convex backend, configured Clerk/Stripe dashboards, seeded model evidence, and a production Vercel deployment. A credential-free build proves compilation and deterministic logic only.
