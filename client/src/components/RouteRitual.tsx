/**
 * Crimson Reliquary style reminder: the project index becomes a blade sweep before a new reading chamber appears.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import type { RouteRitualDetail } from "@/lib/ritual";

type RitualState = { mark: string; language: "en" | "zh" } | null;

export function RouteRitual() {
  const [, setLocation] = useLocation();
  const reduceMotion = useReducedMotion();
  const [ritual, setRitual] = useState<RitualState>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  useEffect(() => {
    const begin = (event: Event) => {
      const detail = (event as CustomEvent<RouteRitualDetail>).detail;
      if (!detail?.target) return;
      const preference = window.localStorage.getItem("mk-motion-preference");
      const restrained = Boolean(reduceMotion) || preference === "reduced" || preference === "low-power";
      const language = detail.language ?? (detail.target.startsWith("/zh") ? "zh" : "en");
      if (timer.current) window.clearTimeout(timer.current);
      setRitual({ mark: detail.mark ?? "MK / ROUTE", language });
      timer.current = window.setTimeout(() => {
        setLocation(detail.target);
        window.requestAnimationFrame(() => setRitual(null));
      }, restrained ? 0 : 420);
    };
    window.addEventListener("mk:route-ritual", begin);
    return () => window.removeEventListener("mk:route-ritual", begin);
  }, [reduceMotion, setLocation]);

  return <AnimatePresence>{ritual && <motion.div className="route-ritual" role="status" aria-live="polite" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .16 }}><div className="route-ritual-seal" aria-hidden="true"><i /><i /><b /></div><div><span>{ritual.mark}</span><strong>{ritual.language === "zh" ? "正在揭示构建记录" : "Revealing build record"}</strong></div></motion.div>}</AnimatePresence>;
}

export function ChamberRitual({ language }: { language: "en" | "zh" }) {
  return <div className="chamber-ritual" role="status" aria-live="polite"><span className="chamber-ritual-blade" aria-hidden="true" /><b>{language === "zh" ? "正在打开项目空间" : "Opening project chamber"}</b></div>;
}
