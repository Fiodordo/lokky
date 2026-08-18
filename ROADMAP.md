# Lokky Roadmap

## North Star

**You built it. Lokky makes sure it's safe to ship.**

Lokky is a security copilot for vibe-coded SaaS: scan, understand, fix, re-scan, then keep watching.

## P0 — Reliability & product foundation
- [x] FR/EN landing and dashboard routing
- [x] Browser-language detection on first visit
- [x] Manual FR/EN choice takes priority after first visit
- [x] Lokky Assistant as a dedicated dashboard page
- [ ] Verify the latest Vercel production build and fix any build/runtime regression
- [ ] Add automated product tests for critical flows
- [ ] Add a safe release checklist before production merges

## P1 — Make the Assistant genuinely useful
- [ ] Persistent conversation context
- [ ] Remember the user's stack across the conversation
- [ ] Detect misunderstandings/corrections instead of following a rigid script
- [ ] Ask for clarification only when required
- [ ] Explain scan findings in plain language
- [ ] Generate stack-aware Cursor / Claude Code prompts
- [ ] Keep a clear distinction between detected facts and assumptions
- [ ] Never expose or request secrets

## P1 — Scan results that lead to action
- [ ] Replace dense technical blocks with expandable result sections
- [ ] Every issue: What happened / Why it matters / What to do
- [ ] One-click “Ask Lokky” from an issue
- [ ] One-click “Fix with Cursor” where appropriate
- [ ] Re-scan after a fix
- [ ] Before/after score and resolved issues
- [ ] Clear “Ready to ship / Not ready to ship” state

## P1 — Security coverage
Expand checks only when Lokky can actually verify them:
- [ ] HTTPS / TLS
- [ ] Security headers
- [ ] Cookies
- [ ] CORS
- [ ] Exposed configuration
- [ ] Framework-specific checks (e.g. Next.js)
- [ ] Supabase configuration checks
- [ ] Vercel configuration checks
- [ ] Stripe-related checks where technically verifiable
- [ ] Clear severity and confidence for every finding

## P2 — Monetisation
### Free
- [ ] Limited manual scans
- [ ] Score
- [ ] Simplified report

### Pro
- [ ] Recurring scans
- [ ] Monitoring
- [ ] Alerts
- [ ] Assistant
- [ ] Full scan history
- [ ] Fix prompts
- [ ] CI / PR security checks

### Agency
- [ ] Multiple projects
- [ ] Client/project management
- [ ] Exportable reports
- [ ] Higher scan limits

## P2 — CI/CD / Pull Request security (paid feature)
This is a **Lokky customer feature**, not a requirement for Lokky's own development workflow.
- [ ] Connect GitHub repository
- [ ] Secure GitHub App / OAuth flow
- [ ] Install Lokky on selected repositories
- [ ] Scan pull requests
- [ ] Report new security regressions introduced by a PR
- [ ] Comment findings directly on the PR
- [ ] Configurable severity threshold
- [ ] Optional blocking check for critical findings
- [ ] CI integration for supported providers
- [ ] Clear audit trail

## P2 — Monitoring
- [ ] Scheduled scans
- [ ] Detect score regressions
- [ ] Detect newly exposed issues
- [ ] TLS/certificate monitoring
- [ ] Email/in-app alerts
- [ ] “Something changed” explanations

## P2 — Landing page & conversion
- [ ] Select 1–3 strong visual references
- [ ] Rework visual direction without copying
- [ ] Remove generic “AI-generated” UI patterns
- [ ] Stronger product demonstration
- [ ] Pricing aligned with real value
- [ ] Vulnerability demo videos
- [ ] Founder-led demo content
- [ ] FR/EN parity

## P3 — Social proof
- [ ] Interview makers from the Summer School
- [ ] Observe their current security workflow before pitching Lokky
- [ ] Give them a real scan of their own SaaS
- [ ] Record objections and confusing moments
- [ ] Ask what would make them pay
- [ ] Convert genuine positive feedback into testimonials with permission
- [ ] Use real name, photo and company/SaaS only with explicit consent
- [ ] Build a small group of beta users

## P3 — Content / demos
- [ ] Short “before you ship” videos
- [ ] Show realistic security failures without teaching abuse
- [ ] Show Lokky detecting the issue
- [ ] Show the fix workflow
- [ ] Show the re-scan / improved result
- [ ] Founder on camera for credibility

## Product loop

`Vibe code → Scan → Understand → Fix → Re-scan → Ready to ship → Monitor`

Every new feature should improve one of four outcomes:
1. Understand risk.
2. Fix risk.
3. Ship with confidence.
4. Create recurring value worth paying for.
