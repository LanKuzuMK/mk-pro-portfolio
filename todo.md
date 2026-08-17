# Project QA Checklist

- [x] English and Chinese routes render independently.
- [x] Case-study pages support recruiter, visual, and technical reading modes.
- [x] Mobile swipe navigation preserves vertical scrolling.
- [x] Reduced Motion and Low Power preferences disable non-essential motion.
- [x] Direct route refreshes use the SPA fallback.
- [x] Cloudflare Pages static build passes with `pnpm run build:cloudflare`.
- [x] Public project imagery resolves from Cloudflare R2.
- [x] Confirm a custom domain is optional; the project is ready to use its Cloudflare Pages domain.
- [x] Fix repository-card metadata and action labels so they never wrap one character per line on narrow layouts.
- [x] Audit the deployed portfolio for backend, database, public configuration, and practical security boundaries.
- [x] Add hardened Cloudflare Pages security headers and document the account-protection checklist.
- [x] Explain how the hardened static portfolio compares with common public website security profiles.
- [x] Provide simple GitHub and Cloudflare passkey or 2FA setup instructions.
- [x] Verify and clean the GitHub commit history and repository metadata of platform-specific attribution.
- [x] Improve the mobile hero composition so text, artwork, capability cards, and controls do not visually collide on phone screens.
- [x] Remove the Google AI Studio-branded repository preview asset and replace the README with clean owner-facing documentation.
