# Cloudflare Pages Migration Notes

This portfolio builds as a static Vite site. Use `pnpm build` and deploy the generated `dist/public` directory to Cloudflare Pages. Configure SPA routing so both `/zh` and `/case-studies/*` resolve to the application entry point rather than a 404 response.

The active portfolio artwork has been migrated to the `portfoliomk` bucket and is delivered through its public R2 development URL. The code now references that public R2 host for the hero, sigil, case-study, gallery, texture, and footer assets. Replace the temporary `r2.dev` host with a custom asset domain later by updating the shared asset-base references.

The direct Formspree endpoint remains compatible with Cloudflare Pages. In the Formspree dashboard, enable reCAPTCHA and restrict the form to the final Cloudflare custom domain before publishing.

| Cloudflare Pages setting | Value |
|---|---|
| Build command | `pnpm build` |
| Output directory | `dist/public` |
| Framework | Vite / React static site |
| SPA fallback | Route all unmatched paths to `/index.html` |
| Form domain restriction | Final custom domain only |
