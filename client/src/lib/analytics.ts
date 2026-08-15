/**
 * Crimson Reliquary telemetry: purposeful, non-identifying interaction signals only.
 * Never include form content, names, email addresses, IP addresses, or other personal data.
 */
export type PortfolioEvent =
  | "case_study_opened"
  | "case_gallery_filter_selected"
  | "case_tool_filter_selected"
  | "featured_carousel_interacted"
  | "repository_dossier_opened"
  | "inquiry_completed"
  | "atmosphere_audio_toggled"
  | "command_path_opened"
  | "command_path_executed"
  | "experiment_vault_opened"
  | "experiment_vault_filter_selected"
  | "case_reading_mode_selected"
  | "route_ritual_started";

type EventMetadata = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    umami?: { track?: (event: string, metadata?: EventMetadata) => void };
  }
}

export function trackPortfolioEvent(event: PortfolioEvent, metadata: EventMetadata = {}) {
  if (typeof window === "undefined") return;
  const safeMetadata = Object.fromEntries(Object.entries(metadata).filter(([, value]) => value !== undefined));
  window.umami?.track?.(event, safeMetadata);
  window.dispatchEvent(new CustomEvent("mk:portfolio-event", { detail: { event, metadata: safeMetadata } }));
}
