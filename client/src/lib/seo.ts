/**
 * Crimson Reliquary metadata: clear canonical records and social previews for each route.
 */
type SeoPayload = {
  path: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  type?: "website" | "article" | "profile";
  structuredData: Record<string, unknown>;
};

const setMeta = (selector: string, value: string) => {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", value);
};

export function applyPortfolioSeo({ path, title, description, image, imageAlt, type = "website", structuredData }: SeoPayload) {
  if (typeof document === "undefined") return;
  const origin = window.location.origin;
  const canonicalUrl = new URL(path, origin).toString();
  document.title = title;
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:image"]', image);
  setMeta('meta[property="og:image:alt"]', imageAlt);
  setMeta('meta[property="og:url"]', canonicalUrl);
  setMeta('meta[property="og:type"]', type);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[name="twitter:image"]', image);
  setMeta('meta[name="twitter:image:alt"]', imageAlt);
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  canonical?.setAttribute("href", canonicalUrl);
  let script = document.getElementById("portfolio-structured-data") as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = "portfolio-structured-data";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(structuredData);
}
