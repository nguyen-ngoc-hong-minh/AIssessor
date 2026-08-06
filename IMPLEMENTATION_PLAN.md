# BENCHFLOW implementation plan

## Delivery posture

BENCHFLOW is being rebuilt as a strict TypeScript Next.js application with a Convex data layer, Clerk identity, OpenAI planning, deterministic server-side recommendations, live model-source adapters, and Stripe entitlements. Production integrations fail closed: no benchmark, recommendation, payment, or entitlement data is invented when a provider is unavailable.

The current workspace remains compatible with the existing Sites preview while the application is prepared for the requested Vercel + Convex production deployment. Live acceptance requires the environment variables and provider configuration listed in `.env.example`.

## Workstreams

1. **Foundation** — dependencies, environment validation, shared UI primitives, route layout, and provider wiring.
2. **Domain and data** — Zod planner contracts, deterministic scoring engine, source adapters, Convex schema, indexes, queries, mutations, actions, HTTP routes, and cron sync.
3. **Identity and billing** — Clerk UI/provider integration, Clerk-to-Convex webhook contract, Stripe Checkout/Portal/webhook handlers, and server-authoritative subscription entitlements.
4. **Product journey** — landing, onboarding, usage choice, one-off/monthly forms, editable workflow approval, explainable results, dashboard, billing, settings, and minimal team pages.
5. **Quality** — unit tests for schemas and recommendation behavior, adapter and webhook contracts, Playwright journey specifications, lint, TypeScript, tests, and production build.

## Safety and correctness rules

- Planner AI produces task requirements only; it never selects a model.
- Recommendations are computed by deterministic TypeScript from stored observations.
- Missing critical evidence creates an exclusion or a `Limited Evidence` result.
- Production reads the latest valid stored snapshot; stale snapshots are dated and labelled.
- Development fixtures are opt-in and visibly labelled.
- Protected Convex functions derive identity from `ctx.auth.getUserIdentity()` and verify ownership or team membership.
- Stripe entitlements change only after a verified webhook.
- No passwords, invented benchmarks, invented prices, or client-controlled access grants are stored.

## Verification gates

- `npm run lint`
- `npm run typecheck`
- `npm run test:unit`
- `npm run build`
- `npm run test:e2e` after Clerk, Convex, Stripe, and provider test environments are configured

## Live setup gates

1. Create and configure Clerk email, Google, and Apple providers; add the Convex JWT template and webhook secret.
2. Create Convex development and production deployments; set server environment variables and deploy functions.
3. Add OpenAI, Artificial Analysis, and OpenRouter credentials.
4. Create Stripe Plus and Team prices; configure Checkout, Portal, and the webhook endpoint.
5. Add the complete environment set to Vercel, deploy, then run the Playwright acceptance journey against that deployment.
