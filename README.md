# MK — Developer & Creative Technologist

MK is the personal portfolio of SereyMongkul (Jack / 天毅). It presents software work, creative technology experiments, interactive systems, and the visual language of the Crimson Reliquary identity in English and Chinese.

The site is designed as a quiet editorial space with strong typography, restrained interface marks, and deliberate motion. It is a static frontend: there is no application server, login system, or project database in this repository.

## Experience

The public experience includes separate English and Chinese routes, cinematic case-study chambers, recruiter, visual, and technical reading modes, a searchable project archive, a Personal Signature page, an Experiment Vault, a bilingual résumé, and a Formspree-powered contact form.

The portfolio is responsive by design. On smaller screens, the hero composition becomes a vertical sequence so the headline, description, capability summary, artwork, and primary action remain readable without competing for the same space. Visitors can also choose Reduced Motion or Low Power preferences.

## Technology

| Area | Implementation |
| --- | --- |
| Frontend | React 19 with TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 and project-specific CSS |
| Motion | Framer Motion |
| 3D interaction | Three.js and WebGL |
| Icons | Lucide and Simple Icons |
| Hosting | Cloudflare Pages |
| Image delivery | Public Cloudflare R2 asset URLs |
| Contact | Formspree |
| Runtime | Node.js 22.13.0 for local builds and deployment |

## Local development

Install Node.js 22.13.0 and pnpm, then install the project dependencies:

```bash
pnpm install
```

Start the local development server:

```bash
pnpm dev
```

Run the static checks and test suite:

```bash
pnpm check
pnpm test
```

Create the normal production build:

```bash
pnpm build
```

The Cloudflare Pages build uses the following command:

```bash
pnpm run build:cloudflare
```

The generated static site is written to `dist/public`.

## Cloudflare Pages

Connect the private GitHub repository to Cloudflare Pages with these settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `pnpm run build:cloudflare` |
| Build output directory | `dist/public` |
| Root directory | `/` |
| Node.js version | `22.13.0` |

The `client/public/_redirects` file keeps client-side routes working when a visitor opens or refreshes a nested URL. The `client/public/_headers` file applies the site’s browser security policy at the edge.

A custom domain is optional. The free Cloudflare Pages address is sufficient for the portfolio.

## Public routes

| Route | Purpose |
| --- | --- |
| `/` | English portfolio home |
| `/zh` | Chinese portfolio home |
| `/resume` | English résumé |
| `/zh/resume` | Chinese résumé |
| `/signature` | English Personal Signature page |
| `/zh/signature` | Chinese Personal Signature page |
| `/case-studies/:slug` | Bilingual case-study chambers |

## Content and assets

Public project screenshots and portfolio artwork are delivered from Cloudflare R2 through public image URLs. These images are intended for public viewing; private documents and credentials must never be placed in the public asset bucket.

Repository cards use verified project titles, descriptions, links, and technical notes. The MK Schedule dossier uses its live project screenshot; no branded development-tool preview is used in the gallery.

## Contact

Project inquiries are submitted through Formspree. Formspree Formshield and CAPTCHA should remain enabled in the form dashboard. The form includes client-side validation, a response-time note, a project-type selector, a honeypot field, and a submission state that confirms success without opening a mail client.

## Security notes

The deployed site is static and does not store visitor accounts, passwords, payment data, or a project database. Keep GitHub and Cloudflare protected with passkeys or authenticator-based two-factor authentication. Never commit R2 access keys, Formspree private credentials, recovery codes, or other secrets.

## Project structure

```text
client/
  public/          Cloudflare routing and security files
  src/
    components/    Reusable interface and motion components
    pages/         Portfolio, résumé, case-study, and signature routes
    tests/         Layout and security regression tests
    index.css      Global visual system and responsive rules

docs/              Deployment, design, and security notes
research/          Source validation and project evidence
```

## License

This repository contains a personal portfolio and its original visual system. Contact the owner before reusing branded artwork, copy, or interface assets.
