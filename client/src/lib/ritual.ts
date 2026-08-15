/**
 * Crimson Reliquary style reminder: cross-route movement is a blade-led handoff, never a generic loader.
 */
export type RouteRitualDetail = { target: string; mark?: string; language?: "en" | "zh" };

export function requestRouteRitual(target: string, detail: Omit<RouteRitualDetail, "target"> = {}) {
  window.dispatchEvent(new CustomEvent<RouteRitualDetail>("mk:route-ritual", { detail: { target, ...detail } }));
}

export function triggerAtmosphereCue(kind: "blade" | "seal" | "signal" = "blade") {
  window.dispatchEvent(new CustomEvent("mk:atmosphere-cue", { detail: { kind } }));
}
