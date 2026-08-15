import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Braces, ScanLine, CircleDashed } from "lucide-react";
import { useMemo, useState } from "react";
import { trackPortfolioEvent } from "@/lib/analytics";

type Language = "en" | "zh";
type ExperimentKind = "shader" | "study" | "prototype";
type ExperimentFilter = "all" | ExperimentKind;

type Experiment = {
  id: string;
  kind: ExperimentKind;
  icon: typeof Braces;
  title: { en: string; zh: string };
  note: { en: string; zh: string };
  stack: { en: string; zh: string };
  status: { en: string; zh: string };
};

const experiments: Experiment[] = [
  { id: "shader-field", kind: "shader", icon: CircleDashed, title: { en: "Crimson Field Study", zh: "赤红能量场研究" }, note: { en: "A compact study of particles, depth, and scroll-led energy motion.", zh: "研究粒子、纵深与由滚动驱动的能量动态。" }, stack: { en: "Three.js · WebGL · GLSL", zh: "Three.js · WebGL · GLSL" }, status: { en: "Shader study · not a product claim", zh: "着色器研究 · 非产品声明" } },
  { id: "gesture-grid", kind: "study", icon: ScanLine, title: { en: "Gesture Grid", zh: "手势网格" }, note: { en: "An interaction study for camera-led focus, hover intent, and readable feedback.", zh: "研究镜头驱动的聚焦、悬停意图与清晰反馈。" }, stack: { en: "Vision · Pointer input · Motion", zh: "视觉 · 指针输入 · 动态" }, status: { en: "Interaction study · exploration", zh: "交互研究 · 探索中" } },
  { id: "reliquary-prototype", kind: "prototype", icon: Braces, title: { en: "Reliquary Prototype", zh: "秘藏原型" }, note: { en: "A small route-and-state prototype testing sealed transitions before production.", zh: "在进入生产前测试封印式转场与状态的轻量原型。" }, stack: { en: "React · TypeScript · State", zh: "React · TypeScript · 状态" }, status: { en: "Prototype · private iteration", zh: "原型 · 私人迭代" } },
];

export default function ExperimentVault({ language }: { language: Language }) {
  const [filter, setFilter] = useState<ExperimentFilter>("all");
  const reducedMotion = useReducedMotion();
  const copy = language === "zh" ? { eyebrow: "实验秘藏 / 03", title: "小型研究，也值得被看见。", body: "这里收录紧凑的着色器、交互研究与原型。它们被诚实地标记为研究，不冒充已验证的产品成果。", archive: "实验档案", open: "记录", filter: "筛选研究", all: "全部", shader: "着色器", study: "交互", prototype: "原型" } : { eyebrow: "EXPERIMENT VAULT / 03", title: "Small studies, kept visible.", body: "A compact archive of shaders, interaction studies, and prototypes. Each entry is labeled honestly as research rather than presented as a finished product result.", archive: "Experiment archive", open: "Record", filter: "Filter studies", all: "All", shader: "Shaders", study: "Interactions", prototype: "Prototypes" };
  const visibleExperiments = useMemo(() => experiments.filter((experiment) => filter === "all" || experiment.kind === filter), [filter]);
  const filters: ExperimentFilter[] = ["all", "shader", "study", "prototype"];
  const selectFilter = (next: ExperimentFilter) => { setFilter(next); trackPortfolioEvent("experiment_vault_filter_selected", { filter: next, language }); };

  return <section className="experiment-vault" aria-labelledby="experiment-vault-title"><div className="experiment-vault-head"><div><p className="eyebrow">{copy.eyebrow}</p><h3 id="experiment-vault-title">{copy.title}</h3></div><p>{copy.body}</p></div><div className="experiment-vault-controls" role="group" aria-label={copy.filter}><span>{copy.filter}</span><div>{filters.map((item) => <button key={item} type="button" className={filter === item ? "is-active" : ""} aria-pressed={filter === item} onClick={() => selectFilter(item)}>{copy[item]}</button>)}</div></div><AnimatePresence mode="wait" initial={false}><motion.div key={filter} className="experiment-vault-grid" initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -5 }} transition={{ duration: reducedMotion ? 0 : .24, ease: [0.16, 1, 0.3, 1] }}>{visibleExperiments.map((experiment) => { const Icon = experiment.icon; return <article className={`experiment-card experiment-card--${experiment.kind}`} key={experiment.id}><div className="experiment-card-index"><span>{experiment.kind === "shader" ? "S" : experiment.kind === "study" ? "I" : "P"}</span><small>{experiment.status[language]}</small></div><Icon size={21} aria-hidden="true" /><h4>{experiment.title[language]}</h4><p>{experiment.note[language]}</p><div><b>{experiment.stack[language]}</b><button type="button" onClick={() => trackPortfolioEvent("experiment_vault_opened", { experiment: experiment.id, language })}>{copy.open}<ArrowUpRight size={13} /></button></div></article>; })}</motion.div></AnimatePresence><div className="experiment-vault-footer"><span>{copy.archive}</span><i aria-hidden="true" /><small>MK / 2026</small></div></section>;
}
