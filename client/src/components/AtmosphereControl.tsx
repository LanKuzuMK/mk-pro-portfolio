/**
 * Crimson Reliquary style reminder: atmosphere is manual-only; it may never autoplay or obscure the reading path.
 */
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { trackPortfolioEvent } from "@/lib/analytics";

type Cue = "blade" | "seal" | "signal";

export default function AtmosphereControl({ language, motionRestricted }: { language: "en" | "zh"; motionRestricted: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const labels = language === "zh" ? { on: "关闭氛围音", off: "开启氛围音", note: "氛围音已开启" } : { on: "Mute atmosphere", off: "Enable atmosphere", note: "Atmosphere enabled" };
  const play = (cue: Cue) => {
    if (!enabled || motionRestricted) return;
    const context = contextRef.current;
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const frequencies: Record<Cue, number> = { blade: 220, seal: 164.81, signal: 329.63 };
    oscillator.type = cue === "signal" ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(frequencies[cue], context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(frequencies[cue] * 1.28, context.currentTime + .18);
    gain.gain.setValueAtTime(.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.045, context.currentTime + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .27);
    oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .29);
  };
  useEffect(() => { const onCue = (event: Event) => play(((event as CustomEvent<{ kind?: Cue }>).detail?.kind ?? "blade")); window.addEventListener("mk:atmosphere-cue", onCue); return () => window.removeEventListener("mk:atmosphere-cue", onCue); });
  useEffect(() => () => { void contextRef.current?.close(); }, []);
  const toggle = async () => { if (!enabled) { contextRef.current ??= new AudioContext(); await contextRef.current.resume(); setEnabled(true); trackPortfolioEvent("atmosphere_audio_toggled", { enabled: true, language }); window.setTimeout(() => play("signal"), 0); } else { setEnabled(false); trackPortfolioEvent("atmosphere_audio_toggled", { enabled: false, language }); } };
  return <button type="button" className={`atmosphere-control ${enabled ? "is-active" : ""}`} onClick={toggle} aria-pressed={enabled} aria-label={enabled ? labels.on : labels.off} title={enabled ? labels.on : labels.off}>{enabled ? <Volume2 size={14} /> : <VolumeX size={14} />}<span>{enabled ? labels.note : labels.off}</span></button>;
}
