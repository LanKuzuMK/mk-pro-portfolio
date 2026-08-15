/**
 * Crimson Reliquary style reminder: a gateway opens into a ceremonial project chamber.
 * The detail layer is immersive but keeps the original portfolio data, external links,
 * and keyboard escape route intact.
 */
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef } from "react";

type ProjectChamberProps = {
  open: boolean;
  onClose: () => void;
  project?: { title: string; label: string; description: string; evidence: string; trace: string; image: string };
  closeLabel: string;
  archiveLabel: string;
  githubUrl: string;
};

export default function ProjectChamber({ open, onClose, project, closeLabel, archiveLabel, githubUrl }: ProjectChamberProps) {
  const chamberRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const updateDepth = (event: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const element = chamberRef.current; if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--chamber-depth-x", `${((event.clientX - rect.left) / rect.width - .5) * 9}px`);
    element.style.setProperty("--chamber-depth-y", `${((event.clientY - rect.top) / rect.height - .5) * 7}px`);
  };
  const resetDepth = () => { chamberRef.current?.style.setProperty("--chamber-depth-x", "0px"); chamberRef.current?.style.setProperty("--chamber-depth-y", "0px"); };

  return <AnimatePresence>
    {open && project && <motion.div ref={chamberRef} className="project-chamber" onPointerMove={updateDepth} onPointerLeave={resetDepth} initial={{ clipPath: "inset(50% 50% 50% 50%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} exit={{ clipPath: "inset(50% 50% 50% 50%)" }} transition={{ duration: 0.56, ease: [0.77, 0, 0.175, 1] }} role="dialog" aria-modal="true" aria-label={project.title}>
      <motion.div className="chamber-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
      <button className="chamber-close" onClick={onClose} aria-label={closeLabel}><X size={19} /><span>{closeLabel}</span></button>
      <div className="chamber-index" aria-hidden="true"><b>MK</b><span>{project.trace}</span></div>
      <motion.div className="chamber-image" initial={{ scale: 1.26, filter: "blur(14px)" }} animate={{ scale: 1, filter: "blur(0px)" }} exit={{ scale: 1.12, filter: "blur(8px)" }} transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}><img src={project.image} alt="" /></motion.div>
      <motion.article className="chamber-content" initial={{ opacity: 0, y: 90, rotateX: 9 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: 35 }} transition={{ delay: 0.25, duration: 0.82, ease: [0.23, 1, 0.32, 1] }}>
        <p>{project.label}</p><h2>{project.title}</h2><span className="chamber-rule" /><p className="chamber-description">{project.description}</p><div className="chamber-build"><i>BUILD SPEC</i><b>{project.evidence}</b></div><a href={githubUrl} target="_blank" rel="noreferrer">{archiveLabel}<ArrowUpRight size={17} /></a>
      </motion.article>
    </motion.div>}
  </AnimatePresence>;
}
