# Cloudflare Pages via GitHub

This portfolio is a client-side React/Vite single-page application. Cloudflare Pages should build the Vite output only; the server bundle is not used by a static Pages deployment.

## Repository preparation

Push the project to a GitHub repository and keep the production branch consistent, preferably `main`. The repository now includes a `build:cloudflare` script that runs only `vite build`, plus `client/public/_redirects` with the SPA fallback rule:

```text
/* /index.html 200
```

The fallback keeps Wouter routes such as `/zh`, `/case-studies/skybound-knight-play`, `/resume`, and `/signature` resolvable on direct navigation and refresh.

## Cloudflare Pages setup

1. Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/) and open **Workers & Pages**.
2. Select **Create application**, choose **Pages**, and select **Connect to Git**.
3. Authorize the **Cloudflare Workers and Pages** GitHub App. Grant access only to the repository containing this portfolio.
4. Select the repository and choose the production branch, normally `main`.
5. Configure the build as follows.

| Setting | Value |
| --- | --- |
| Framework preset | Vite, or None if Vite is not offered |
| Root directory | `/` |
| Build command | `pnpm run build:cloudflare` |
| Build output directory | `dist/public` |
| Node.js version | `22` |
| Package manager | pnpm, using the committed `pnpm-lock.yaml` |

6. Leave environment variables empty. This static portfolio does not need build-time secrets, database credentials, R2 credentials, or analytics keys.
7. Select **Save and Deploy**. Every later push to the production branch will trigger a production deployment; pull requests can receive preview deployments.

The portfolio artwork is served from the existing Cloudflare R2 public URL, so no R2 secret is needed for this static frontend build. Do not place private R2 access keys in Pages environment variables or the repository.

## Built-in browser hardening

The committed `client/public/_headers` file supplies HTTPS enforcement, a restrictive Content Security Policy, clickjacking protection, MIME-type hardening, a reduced browser-permissions policy, and a strict referrer policy for all static Pages responses. It permits only the public R2 image host, Google Fonts, and the Formspree contact endpoint required by the portfolio.

## Post-deploy checks

After the first deployment, verify the root route, `/zh`, `/resume`, `/zh/resume`, `/signature`, `/zh/signature`, and both case-study language routes directly in a new browser tab. Verify that a hard refresh on each route returns the correct page rather than a 404. Check the browser console for failed asset requests, confirm the R2 images load, and test the Formspree inquiry flow separately.

## Important limitation

Cloudflare Pages serves the compiled static frontend. The existing `server/` bundle is not deployed by this Pages configuration. The contact form continues to submit directly to Formspree, analytics continues to use the configured Umami endpoint, and the R2 public bucket continues to serve media. If a future feature requires server-side APIs, authentication, or protected data, use Cloudflare Workers/Pages Functions or a server-capable deployment path instead of treating this static Pages build as a backend.

## Official references

- [Cloudflare Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
- [Cloudflare Pages serving and SPA behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/)
