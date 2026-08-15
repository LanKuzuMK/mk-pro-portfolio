# Portfolio Improvement Plan

This pass preserves the existing **Crimson Reliquary** identity: an editorial dark field, bone-white type, restrained vermilion, and the blade as a navigational metaphor. New interfaces should clarify the work and reduce friction rather than introduce another visual language.

## Content Decisions

The new services section will position three focused offerings: **Web Systems**, **Mobile & Play**, and **Creative Technology**. Each offering will state the practical outcome, the working shape, and the kind of collaboration it suits. English copy will be concise and direct; Chinese copy will favor natural professional phrasing over literal translation.

**Skybound Knight** will be the flagship case study because it demonstrates responsive interaction, browser delivery, and an Android path in one public build. Its extended record will distinguish verified public facts from the project framing: the brief is a responsive endless platformer; the constraints are browser readability and a parallel Android delivery path; the architecture follows interface, game loop, Android packaging, and responsive play; evidence links visitors to the live build and public repository. No unverified performance or commercial results will be claimed.

Availability will be stated precisely but modestly: available for selected freelance and creative-technology collaborations; working from the Asia/Phnom_Penh timezone; best suited to focused prototypes, portfolio sites, interface systems, and small-to-medium product work; with a typical response within one to two business days.

## Technical Decisions

Motion preferences will offer **Full motion**, **Reduced motion**, and **Low power**. The choice persists locally. Reduced and Low power modes disable the WebGL energy field; Low power also suppresses continuous decorative motion. System `prefers-reduced-motion` remains the safe first-run default.

The hero artwork is the only visual treated as high-priority. WebGL remains lazy-loaded and will mount only after a short idle period or a meaningful hero interaction, never on small screens or constrained preferences. Archive and case-study imagery will load lazily, with descriptive alt text for meaningful content.

Analytics will remain privacy-conscious: the existing first-party-compatible analytics script receives only named interaction events and non-identifying metadata. Inquiry events record completion, never form contents, email addresses, names, or other sensitive details.

SEO will include per-route canonical URLs, route-specific Open Graph/Twitter images, and `Person` plus `CreativeWork` JSON-LD. The public deployment domain is used only when known at runtime; a stable portfolio origin is configured as the canonical production base for metadata.

The standalone recruiter résumé mode will be a lazy-loaded, plain, bilingual `/resume` and `/zh/resume` route. It will offer a minimal print-friendly document with no WebGL, case-study galleries, or ambient effects.
