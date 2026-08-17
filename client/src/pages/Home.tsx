/**
 * Crimson Reliquary style reminder: dark editorial space, an original blade path,
 * separate English and Chinese reading modes, and clear type at every viewport.
 */
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { trackPortfolioEvent } from "@/lib/analytics";
import { applyPortfolioSeo } from "@/lib/seo";
import { requestRouteRitual, triggerAtmosphereCue } from "@/lib/ritual";
import PortfolioCommand from "@/components/PortfolioCommand";
import AtmosphereControl from "@/components/AtmosphereControl";
import ExperimentVault from "@/components/ExperimentVault";
import { ChamberRitual } from "@/components/RouteRitual";
import { SiAndroid, SiFlutter, SiGit, SiHtml5, SiJavascript, SiOpenjdk, SiReact, SiThreedotjs, SiTypescript, SiWebgl } from "react-icons/si";
import type { IconType } from "react-icons";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Braces,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Facebook,
  Gamepad2,
  Github,
  LoaderCircle,
  Menu,
  Printer,
  RefreshCw,
  Search,
  ScanLine,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  X,
} from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useLocation } from "wouter";

type Language = "en" | "zh";
type MotionPreference = "full" | "reduced" | "low-power";

const LINKS = {
  github: "https://github.com/LanKuzuMK",
  telegram: "https://t.me/TianyiXiong",
  facebook: "https://www.facebook.com/jackurgodking",
};

const disciplines = [
  { id: "01", icon: Braces, title: { en: "Web Systems", zh: "网页系统" }, subtitle: { en: "Web Development", zh: "网页开发" }, detail: { en: "Modern websites, interactive applications, and intentional user flows.", zh: "构建现代网站、交互应用，以及有明确目标的用户体验。" } },
  { id: "02", icon: Smartphone, title: { en: "Mobile Worlds", zh: "移动体验" }, subtitle: { en: "Flutter & Mobile", zh: "Flutter 与移动端" }, detail: { en: "Cross-platform applications shaped around actual human use.", zh: "围绕真实使用场景设计的跨平台移动应用。" } },
  { id: "03", icon: Gamepad2, title: { en: "Playable Ideas", zh: "可玩的想法" }, subtitle: { en: "Game Development", zh: "游戏开发" }, detail: { en: "Systems where mechanics, movement, visuals, and technology meet.", zh: "让机制、运动、视觉与技术相互连接的游戏系统。" } },
  { id: "04", icon: ScanLine, title: { en: "Perceptive Interfaces", zh: "感知交互" }, subtitle: { en: "Computer Vision", zh: "计算机视觉" }, detail: { en: "Gesture, camera, and human-computer interaction experiments.", zh: "探索手势、镜头与人机交互的实验性体验。" } },
];

const services = [
  { id: "01", tone: "web", title: { en: "Web Systems", zh: "网页系统" }, outcome: { en: "Clear, responsive interfaces and product flows that turn a working idea into a usable browser experience.", zh: "将可行的想法转化为清晰、响应式且真正可用的浏览器体验与产品流程。" }, fit: { en: "Best for portfolio sites, small product surfaces, dashboards, and interface rebuilds.", zh: "适合作品集网站、小型产品界面、仪表盘与现有界面的重构。" } },
  { id: "02", tone: "mobile", title: { en: "Mobile & Play", zh: "移动端与游戏" }, outcome: { en: "Cross-platform prototypes and playful interaction systems shaped for real screens and real input.", zh: "围绕真实屏幕与实际输入方式打造跨平台原型和可玩的交互系统。" }, fit: { en: "Best for mobile prototypes, browser games, touch-first ideas, and Android delivery paths.", zh: "适合移动端原型、浏览器游戏、触控优先的想法与 Android 交付路径。" } },
  { id: "03", tone: "craft", title: { en: "Creative Technology", zh: "创意技术" }, outcome: { en: "Expressive digital moments where visual direction, motion, code, and emerging interfaces work as one.", zh: "让视觉方向、动态、代码与新型交互协同工作的表现型数字体验。" }, fit: { en: "Best for interactive stories, experiments, 3D explorations, and experience-led launches.", zh: "适合互动叙事、实验项目、3D 探索与以体验为核心的发布。" } },
];

const explorations = [
  {
    index: "A / 01",
    title: { en: "Code Gateway", zh: "代码之门" },
    label: { en: "Web · Product · Systems", zh: "网页 · 产品 · 系统" },
    description: { en: "Interfaces and web systems that turn a rough thought into something clear, responsive, and alive.", zh: "将模糊的想法转化为清晰、灵敏且真正可用的界面与网页系统。" },
    trace: { en: "INTERFACE / BUILD 014", zh: "界面 / 构建 014" },
    evidence: { en: "React · TypeScript · Motion System", zh: "React · TypeScript · 动效系统" },
    image: "https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/mk-worlds-code-gateway.jpg",
    offset: "gateway-card--right",
  },
  {
    index: "A / 02",
    title: { en: "MK Signal", zh: "MK 信号" },
    label: { en: "Identity · Direction · Motion", zh: "身份 · 方向 · 动态" },
    description: { en: "An original signature system: sharp, direct, and built for ideas that need a distinct point of view.", zh: "一个原创的个人标记系统：锋利、直接，并为需要独特视角的想法而存在。" },
    trace: { en: "SIGIL / SYSTEM 001", zh: "标记 / 系统 001" },
    evidence: { en: "Identity Token · UI System · Interaction", zh: "身份标记 · UI 系统 · 交互" },
    image: "https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/mk-sigil-supplied.png",
    offset: "gateway-card--left",
    mark: true,
  },
];

type SkillIcon = IconType;
type SkillDefinition = { name: string; level: number; icon: SkillIcon; note: { en: string; zh: string } };
type SkillTone = "web" | "mobile" | "craft";
type ProjectFilter = "all" | SkillTone;
type GalleryImage = { image: string; kind: { en: string; zh: string }; alt: { en: string; zh: string } };
type RepositoryDefinition = { name: string; category: SkillTone; url: string; liveUrl?: string; languages: string; description: { en: string; zh: string }; gallery: GalleryImage[]; technicalNotes: { en: string[]; zh: string[] }; activity: { updatedAt: string; message: string; sha: string; commitUrl: string } };
type ActivityRecord = { repository: RepositoryDefinition; updatedAt: string; message: string; sha: string; commitUrl: string };

const EnergyField = lazy(() => import("@/components/EnergyField"));
const ProjectChamber = lazy(() => import("@/components/ProjectChamber"));
const caseStudySlugs = new Set(["e-commerce-inventory-dashboard", "MK-_schedule", "skybound-knight-play"]);

function HeroFieldLoader({ language }: { language: Language }) {
  return <div className="hero-field-loader" role="status" aria-live="polite"><div className="hero-field-loader-orbit" aria-hidden="true"><i /><i /><b /></div><span>{language === "zh" ? "正在唤醒能量场" : "Awakening energy field"}</span></div>;
}

function MotionPreferenceControl({ language, value, onChange }: { language: Language; value: MotionPreference; onChange: (value: MotionPreference) => void }) {
  const labels = language === "zh" ? { title: "动态偏好", full: "完整动态", reduced: "减少动态", low: "低功耗" } : { title: "Motion preference", full: "Full motion", reduced: "Reduced motion", low: "Low power" };
  const options: { value: MotionPreference; label: string }[] = [{ value: "full", label: labels.full }, { value: "reduced", label: labels.reduced }, { value: "low-power", label: labels.low }];
  return <div className="motion-preference" role="group" aria-label={labels.title}><span><SlidersHorizontal size={13} />{labels.title}</span><div>{options.map((option) => <button key={option.value} type="button" onClick={() => onChange(option.value)} className={value === option.value ? "is-active" : ""} aria-pressed={value === option.value}>{option.label}</button>)}</div></div>;
}

function SkillMeter({ skill, language, index, cycle, motionRestricted }: { skill: SkillDefinition; language: Language; index: number; cycle: number; motionRestricted: boolean }) {
  const Icon = skill.icon;
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (motionRestricted) { setProgress(skill.level); setComplete(true); return; }
    if (cycle === 0) { setProgress(0); setComplete(false); return; }
    let frame = 0;
    setProgress(0); setComplete(false);
    const delay = window.setTimeout(() => {
      const start = performance.now();
      const duration = 1500;
      const animate = (now: number) => {
        const raw = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - raw, 4);
        setProgress(Math.round(skill.level * eased));
        if (raw < 1) frame = window.requestAnimationFrame(animate);
        else setComplete(true);
      };
      frame = window.requestAnimationFrame(animate);
    }, index * 180);
    return () => { window.clearTimeout(delay); if (frame) window.cancelAnimationFrame(frame); };
  }, [cycle, index, skill.level, motionRestricted]);

  return <div className="skill-row"><div><span className="skill-icon"><Icon aria-hidden="true" /></span><b>{skill.name}</b><span>{skill.note[language]}</span><em>{progress}%</em></div><div className="skill-track"><div className={`skill-fill ${complete ? "skill-fill--complete" : ""}`} style={{ width: `${progress}%` }} /><span className={`skill-complete ${complete ? "skill-complete--visible" : ""}`} style={{ left: `${progress}%` }}><Check size={10} strokeWidth={3} /></span></div></div>;
}

const skillGroups: { id: string; tone: SkillTone; summaryLevel: number; summary: { en: string; zh: string }; title: { en: string; zh: string }; detail: { en: string; zh: string }; skills: SkillDefinition[] }[] = [
  {
    id: "A", tone: "web", summaryLevel: 83, summary: { en: "Web + 3D", zh: "网页 + 3D" }, title: { en: "Web & 3D Systems", zh: "网页与 3D 系统" }, detail: { en: "Interactive product interfaces and browser-based worlds.", zh: "交互产品界面与浏览器中的沉浸式世界。" },
    skills: [
      { name: "JavaScript", level: 88, icon: SiJavascript, note: { en: "Interface systems", zh: "界面系统" } },
      { name: "TypeScript", level: 84, icon: SiTypescript, note: { en: "Typed product builds", zh: "类型化产品构建" } },
      { name: "React / Node.js", level: 82, icon: SiReact, note: { en: "Product systems", zh: "产品系统" } },
      { name: "Three.js / WebGL", level: 76, icon: SiThreedotjs, note: { en: "3D interaction", zh: "3D 交互" } },
    ],
  },
  {
    id: "B", tone: "mobile", summaryLevel: 74, summary: { en: "Mobile + Play", zh: "移动端 + 游戏" }, title: { en: "Mobile & Play", zh: "移动端与游戏" }, detail: { en: "Cross-platform applications and playful interactive experiences.", zh: "跨平台应用与可玩的互动体验。" },
    skills: [
      { name: "Flutter / Dart", level: 80, icon: SiFlutter, note: { en: "Cross-platform apps", zh: "跨平台应用" } },
      { name: "Android / Capacitor", level: 72, icon: SiAndroid, note: { en: "Mobile delivery", zh: "移动端交付" } },
      { name: "Java", level: 70, icon: SiOpenjdk, note: { en: "Android foundations", zh: "Android 基础" } },
      { name: "Game Development", level: 74, icon: SiWebgl, note: { en: "Playable systems", zh: "可玩系统" } },
    ],
  },
  {
    id: "C", tone: "craft", summaryLevel: 79, summary: { en: "Experiment + Craft", zh: "实验 + 工艺" }, title: { en: "Experiment & Craft", zh: "实验与工艺" }, detail: { en: "Emerging interfaces, computer vision, and build discipline.", zh: "新型交互、计算机视觉与工程实践。" },
    skills: [
      { name: "HTML5 / CSS3", level: 91, icon: SiHtml5, note: { en: "Editorial interfaces", zh: "编辑式界面" } },
      { name: "Computer Vision", level: 68, icon: SiWebgl, note: { en: "Gesture experiments", zh: "手势实验" } },
      { name: "Git / Android Studio", level: 77, icon: SiGit, note: { en: "Build workflow", zh: "构建流程" } },
    ],
  },
];

const repositories: RepositoryDefinition[] = [
  { name: "e-commerce-inventory-dashboard", category: "web", url: "https://github.com/LanKuzuMK/e-commerce-inventory-dashboard", liveUrl: "https://e-commerce-inventory-dashboard-5yda.onrender.com/login.jsp", languages: "Java · Docker", description: { en: "Lab Exercise 1: E-Commerce Inventory Dashboard", zh: "实验项目 1：电商库存管理仪表盘" }, gallery: [{ image: "https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/ecommerce-dashboard-source-preview.webp", kind: { en: "Source context · live service waking", zh: "源码上下文 · 在线服务正在启动" }, alt: { en: "Public GitHub source page for the e-commerce inventory dashboard", zh: "电商库存管理仪表盘的公开 GitHub 源码页面" } }], technicalNotes: { en: ["JSP and JSTL inventory dashboard", "Tomcat 11 run target", "Dockerfile included for cloud hosting"], zh: ["基于 JSP 与 JSTL 的库存仪表盘", "面向 Tomcat 11 的运行目标", "包含用于云端部署的 Dockerfile"] }, activity: { updatedAt: "2026-08-15T04:03:04Z", message: "Update README", sha: "1b2c26e", commitUrl: "https://github.com/LanKuzuMK/e-commerce-inventory-dashboard/commit/1b2c26e6f21ee8978bfe9abca4e16c7f9dc4d57a" } },
  { name: "MK-_schedule", category: "web", url: "https://github.com/LanKuzuMK/MK-_schedule", liveUrl: "https://mk-schedule.vercel.app", languages: "TypeScript · CSS", description: { en: "A public TypeScript scheduling project.", zh: "一个公开的 TypeScript 日程项目。" }, gallery: [{ image: "https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/mk-schedule-live-preview.webp", kind: { en: "Live project screenshot", zh: "在线项目界面截图" }, alt: { en: "MK Schedule live project interface", zh: "MK Schedule 在线项目界面" } }], technicalNotes: { en: ["TypeScript, CSS, and HTML", "Public schedule interface with weekday navigation", "Deployed public build"], zh: ["TypeScript、CSS 与 HTML", "带工作日导航的公开日程界面", "已部署的公开版本"] }, activity: { updatedAt: "2026-03-10T17:14:04Z", message: "Update App.tsx", sha: "b24b846", commitUrl: "https://github.com/LanKuzuMK/MK-_schedule/commit/b24b84616267c1c2f9bbfd1a2bfe85eff9700964" } },
  { name: "skybound-knight-play", category: "mobile", url: "https://github.com/LanKuzuMK/skybound-knight-play", liveUrl: "https://skybound-knight-play.pages.dev", languages: "TypeScript · JavaScript", description: { en: "Skybound Knight — a responsive endless fantasy platformer with Android APK support.", zh: "Skybound Knight：支持 Android APK 的响应式无尽奇幻平台游戏。" }, gallery: [{ image: "https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/skybound-knight-live-preview.webp", kind: { en: "Live project screenshot", zh: "在线项目截图" }, alt: { en: "Skybound Knight live game interface", zh: "Skybound Knight 在线游戏界面" } }, { image: "https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/skybound-knight-source-preview.webp", kind: { en: "Public source context", zh: "公开源码上下文" }, alt: { en: "Skybound Knight public GitHub source page", zh: "Skybound Knight 公开 GitHub 源码页面" } }], technicalNotes: { en: ["TypeScript, JavaScript, Java, and HTML", "Responsive endless fantasy platformer", "Public project description confirms Android APK support"], zh: ["TypeScript、JavaScript、Java 与 HTML", "响应式无尽奇幻平台游戏", "公开项目说明确认支持 Android APK"] }, activity: { updatedAt: "2026-08-14T03:40:19Z", message: "Verify protected public repository release", sha: "3bfdd22", commitUrl: "https://github.com/LanKuzuMK/skybound-knight-play/commit/3bfdd226d7c629c188ed24ea3721bc75016cc3fc" } },
  { name: "Anonymouse_chat", category: "craft", url: "https://github.com/LanKuzuMK/Anonymouse_chat", languages: "TypeScript · CSS", description: { en: "A public TypeScript prototype.", zh: "一个公开的 TypeScript 原型。" }, gallery: [{ image: "https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/anonymouse-chat-source-preview.webp", kind: { en: "Source context screenshot", zh: "源码上下文截图" }, alt: { en: "Public GitHub source page for Anonymous Encrypted Chat", zh: "Anonymous Encrypted Chat 的公开 GitHub 源码页面" } }], technicalNotes: { en: ["React 18, TypeScript, Vite, Tailwind CSS, and Framer Motion", "Node.js WebSocket backend", "Browser-native Web Crypto is documented in the public README"], zh: ["React 18、TypeScript、Vite、Tailwind CSS 与 Framer Motion", "Node.js WebSocket 后端", "公开 README 记录了浏览器原生 Web Crypto 的使用"] }, activity: { updatedAt: "2026-08-05T09:40:31Z", message: "fix: enforce server-side auto-mute when a user receives 3 reports", sha: "5a367d7", commitUrl: "https://github.com/LanKuzuMK/Anonymouse_chat/commit/5a367d7bdac49762220f8b34a24e64d245a17590" } },
];

function RepositoryCard({ repository, language, embedded = false, sourceLabel, liveLabel, previewLabel, onPreview, onRouteRitual, cardRef, onKeyDown }: { repository: RepositoryDefinition; language: Language; embedded?: boolean; sourceLabel: string; liveLabel: string; previewLabel: string; onPreview: (repository: RepositoryDefinition) => void; onRouteRitual?: (target: string, mark: string) => void; cardRef?: (element: HTMLElement | null) => void; onKeyDown?: (event: ReactKeyboardEvent<HTMLElement>) => void }) {
  const caseStudyPath = caseStudySlugs.has(repository.name) ? `${language === "zh" ? "/zh" : ""}/case-studies/${repository.name}` : null;
  const caseStudyLabel = language === "zh" ? "阅读案例" : "Read case study";
  const openDossier = () => { triggerAtmosphereCue("seal"); trackPortfolioEvent("repository_dossier_opened", { repository: repository.name, category: repository.category, language }); onPreview(repository); };
  const enterCaseStudy = (event: React.MouseEvent<HTMLAnchorElement>) => { event.stopPropagation(); if (!onRouteRitual) return; event.preventDefault(); onRouteRitual(caseStudyPath!, `CASE / ${repository.name}`); };
  return <article ref={cardRef} tabIndex={0} role="button" onClick={openDossier} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openDossier(); return; } onKeyDown?.(event); }} className={`repository-card repository-card--interactive repository-card--${repository.category} ${embedded ? "repository-card--embedded" : ""}`} aria-label={`${previewLabel}: ${repository.name}`}><div className="repository-card-top"><span>{repository.category.toUpperCase()} / SOURCE</span><i aria-hidden="true" /></div><h4>{repository.name}</h4><p>{repository.description[language]}</p><div className="repository-card-meta"><small>{repository.languages}</small><span>{repository.category === "web" ? (language === "zh" ? "网页系统" : "Web systems") : repository.category === "mobile" ? (language === "zh" ? "移动端与游戏" : "Mobile & play") : (language === "zh" ? "实验与工艺" : "Experiment & craft")}</span></div><div className="repository-card-actions"><button type="button" onClick={(event) => { event.stopPropagation(); openDossier(); }}>{previewLabel}<ArrowUpRight size={14} /></button>{caseStudyPath && <a onClick={enterCaseStudy} href={caseStudyPath}>{caseStudyLabel}<ArrowUpRight size={14} /></a>}<a onClick={(event) => event.stopPropagation()} href={repository.url} target="_blank" rel="noreferrer">{sourceLabel}<Github size={14} /></a>{repository.liveUrl && <a onClick={(event) => event.stopPropagation()} href={repository.liveUrl} target="_blank" rel="noreferrer">{liveLabel}<ArrowUpRight size={14} /></a>}</div></article>;
}

function ActivityTimeline({ records, language, live, eyebrow, title, body, liveLabel, snapshotLabel, commitLabel }: { records: ActivityRecord[]; language: Language; live: boolean; eyebrow: string; title: string; body: string; liveLabel: string; snapshotLabel: string; commitLabel: string }) {
  const formatDate = (date: string) => new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
  return <aside className="activity-timeline"><div className="activity-timeline-head"><div><p className="eyebrow">{eyebrow}</p><h3>{title}</h3></div><span className={live ? "activity-status activity-status--live" : "activity-status"}><i aria-hidden="true" />{live ? liveLabel : snapshotLabel}</span></div><p className="activity-timeline-body">{body}</p><ol>{records.map((record) => <li key={record.repository.name} className={`activity-item activity-item--${record.repository.category}`}><div className="activity-date"><span>{formatDate(record.updatedAt)}</span><i aria-hidden="true" /></div><div className="activity-copy"><a href={record.commitUrl} target="_blank" rel="noreferrer">{record.repository.name}<ArrowUpRight size={13} /></a><p>{record.message}</p><small>{commitLabel} · {record.sha}</small></div></li>)}</ol></aside>;
}

function RepositoryPreviewDialog({ repository, language, open, onOpenChange, technicalLabel, sourceLabel, liveLabel, galleryLabel, previousLabel, nextLabel }: { repository: RepositoryDefinition | null; language: Language; open: boolean; onOpenChange: (open: boolean) => void; technicalLabel: string; sourceLabel: string; liveLabel: string; galleryLabel: string; previousLabel: string; nextLabel: string }) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  useEffect(() => { setGalleryIndex(0); }, [repository?.name]);
  if (!repository) return null;
  const galleryLength = repository.gallery.length;
  const activeImage = { ...repository.gallery[galleryIndex], image: repository.gallery[galleryIndex].image };
  const moveGallery = (delta: number) => setGalleryIndex((current) => (current + delta + galleryLength) % galleryLength);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent onKeyDown={(event) => { if (galleryLength < 2) return; if (event.key === "ArrowLeft") { event.preventDefault(); moveGallery(-1); } if (event.key === "ArrowRight") { event.preventDefault(); moveGallery(1); } }} className="repository-preview-dialog"><div className={`repository-preview-frame repository-preview-frame--${repository.category}`} onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const start = touchStart.current; const end = event.changedTouches[0]?.clientX; touchStart.current = null; if (start === null || end === undefined || Math.abs(start - end) < 42 || galleryLength < 2) return; moveGallery(start > end ? 1 : -1); }}><img src={activeImage.image} alt={activeImage.alt[language]} /><span>{activeImage.kind[language]}</span>{galleryLength > 1 && <><button className="gallery-arrow gallery-arrow--previous" type="button" onClick={() => moveGallery(-1)} aria-label={previousLabel}><ChevronLeft size={18} /></button><button className="gallery-arrow gallery-arrow--next" type="button" onClick={() => moveGallery(1)} aria-label={nextLabel}><ChevronRight size={18} /></button><div className="gallery-dots" role="tablist" aria-label={galleryLabel}>{repository.gallery.map((image, index) => <button key={image.image} type="button" role="tab" aria-selected={index === galleryIndex} aria-label={`${galleryLabel} ${index + 1}`} onClick={() => setGalleryIndex(index)} />)}</div></>}</div><div className="repository-preview-copy"><div className="repository-preview-kicker"><span>{repository.category.toUpperCase()} / REPOSITORY DOSSIER</span><i aria-hidden="true" /></div><DialogTitle>{repository.name}</DialogTitle><DialogDescription>{repository.description[language]}</DialogDescription><div className="repository-technical-notes"><b>{technicalLabel}</b><ul>{repository.technicalNotes[language].map((note) => <li key={note}>{note}</li>)}</ul></div><div className="repository-preview-actions"><a href={repository.url} target="_blank" rel="noreferrer">{sourceLabel}<Github size={15} /></a>{repository.liveUrl && <a href={repository.liveUrl} target="_blank" rel="noreferrer">{liveLabel}<ArrowUpRight size={15} /></a>}</div></div></DialogContent></Dialog>;
}

const resumeContent = {
  en: { eyebrow: "Print-ready CV", title: "A concise record\nof what I build.", body: "A bilingual capability profile drawn from the public portfolio, suited to project conversations and print-to-PDF sharing.", name: "SereyMongkul · Jack", role: "Developer & Creative Technologist", summaryTitle: "Profile", summary: "I build modern web systems, interactive 3D experiences, mobile-ready products, and experimental interfaces with practical intent.", strengthsTitle: "Core capabilities", strengths: ["Web systems · React · TypeScript", "3D interaction · Three.js · WebGL", "Mobile delivery · Flutter · Android", "Experiments · Computer vision · AI"], projectsTitle: "Selected public work", projects: ["E-Commerce Inventory Dashboard", "MK Schedule", "Skybound Knight", "Anonymous Encrypted Chat"], contactTitle: "Contact", print: "Print / save as PDF", download: "Download CV view", printNote: "Use your browser’s Print dialog to save a clean PDF." },
  zh: { eyebrow: "可打印简历", title: "一份简洁的\n构建记录。", body: "基于公开作品集整理的双语能力档案，适合项目沟通与打印为 PDF 分享。", name: "SereyMongkul · Jack · 天毅", role: "开发者与创意技术家", summaryTitle: "个人简介", summary: "我构建现代网页系统、互动式 3D 体验、面向移动端的产品，以及兼具实用目的的实验性界面。", strengthsTitle: "核心能力", strengths: ["网页系统 · React · TypeScript", "3D 交互 · Three.js · WebGL", "移动端交付 · Flutter · Android", "实验方向 · 计算机视觉 · AI"], projectsTitle: "精选公开作品", projects: ["电商库存管理仪表盘", "MK Schedule", "Skybound Knight", "Anonymous Encrypted Chat"], contactTitle: "联系", print: "打印 / 保存为 PDF", download: "下载简历视图", printNote: "使用浏览器的打印窗口保存清晰的 PDF。" },
};

const captchaChallenges = [
  { prompt: { en: "Human check: 3 + 4 = ?", zh: "人机验证：3 + 4 = ?" }, answer: "7" },
  { prompt: { en: "Human check: 6 − 2 = ?", zh: "人机验证：6 − 2 = ?" }, answer: "4" },
  { prompt: { en: "Human check: 5 + 3 = ?", zh: "人机验证：5 + 3 = ?" }, answer: "8" },
];

function ResumeSection({ language, email }: { language: Language; email: string }) {
  const resume = resumeContent[language];
  const downloadView = () => {
    const source = `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><title>${resume.name} — CV</title><style>body{font-family:Arial,sans-serif;max-width:760px;margin:48px auto;color:#171113;line-height:1.55}h1{font-size:36px;margin:0}h2{font-size:14px;letter-spacing:.12em;text-transform:uppercase;border-top:1px solid #a81925;padding-top:14px;margin-top:28px}ul{padding-left:18px}small{color:#6b5f5a}</style></head><body><small>MK / ${resume.eyebrow}</small><h1>${resume.name}</h1><p><strong>${resume.role}</strong></p><h2>${resume.summaryTitle}</h2><p>${resume.summary}</p><h2>${resume.strengthsTitle}</h2><ul>${resume.strengths.map((item) => `<li>${item}</li>`).join("")}</ul><h2>${resume.projectsTitle}</h2><ul>${resume.projects.map((item) => `<li>${item}</li>`).join("")}</ul><h2>${resume.contactTitle}</h2><p>${email}<br>github.com/LanKuzuMK</p></body></html>`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([source], { type: "text/html" }));
    link.download = `SereyMongkul-CV-${language}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return <section id="resume" className="resume-scene scene-section"><div className="section-stamp" aria-hidden="true"><b>06</b><span>CV<br />06</span></div><div className="resume-frame"><div className="resume-copy"><p className="eyebrow">{resume.eyebrow}</p><h2>{resume.title}</h2><p>{resume.body}</p><div className="resume-actions"><button type="button" onClick={() => window.print()}><Printer size={16} />{resume.print}</button><button type="button" onClick={downloadView}><Download size={16} />{resume.download}</button></div><small>{resume.printNote}</small></div><article className="resume-sheet"><div className="resume-sheet-head"><div><span>MK / CV</span><h3>{resume.name}</h3><p>{resume.role}</p></div><i aria-hidden="true" /></div><div className="resume-sheet-grid"><section><b>{resume.summaryTitle}</b><p>{resume.summary}</p></section><section><b>{resume.strengthsTitle}</b><ul>{resume.strengths.map((item) => <li key={item}>{item}</li>)}</ul></section><section><b>{resume.projectsTitle}</b><ul>{resume.projects.map((item) => <li key={item}>{item}</li>)}</ul></section><section><b>{resume.contactTitle}</b><p>{email}<br />github.com/LanKuzuMK<br />t.me/TianyiXiong</p></section></div></article></div></section>;
}

function InquiryForm({ language, email }: { language: Language; email: string }) {
  const [values, setValues] = useState({ name: "", sender: "", projectType: "", brief: "", website: "" });
  const [errors, setErrors] = useState<{ name?: string; sender?: string; projectType?: string; brief?: string; captcha?: string }>({});
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string; title?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaIndex, setCaptchaIndex] = useState(0);
  const [openedAt, setOpenedAt] = useState(() => Date.now());
  const challenge = captchaChallenges[captchaIndex];
  const captchaCopy = language === "zh" ? { title: "安全验证", note: "此步骤帮助拦截自动垃圾信息。", refresh: "更换验证题", invalid: "请完成正确的人机验证。", wait: "请稍候片刻后再提交。" } : { title: "Security check", note: "This step helps filter automated spam submissions.", refresh: "New challenge", invalid: "Please complete the human verification correctly.", wait: "Please wait a moment before submitting." };
  const labels = language === "zh" ? { title: "开始一段构建对话。", body: "留下项目背景，信息会直接安全地发送到我的收件箱，无需打开你的邮件客户端。", response: "通常会在 1–2 个工作日内回复项目询问。", privacyTitle: "隐私与信任", privacy: "表单由 Formspree 安全转发至 lku199776@gmail.com。内容仅用于回复你的项目询问，不会被出售或公开。", identity: "在 GitHub 查看我的公开身份与项目记录", name: "你的名字", sender: "你的邮箱", type: "项目类型", typePlaceholder: "选择项目类型", types: [{ value: "web", label: "网页开发" }, { value: "mobile", label: "移动应用" }, { value: "consulting", label: "咨询与技术方向" }, { value: "creative", label: "创意技术与交互" }, { value: "other", label: "其他" }], brief: "项目概述", placeholder: "目标、时间线与希望一起构建的内容。", submit: "发送项目询问", sending: "正在发送…", successTitle: "信号已抵达。", success: "感谢你的信任。你的项目询问已经进入我的工作台，我会在 1–2 个工作日内回复。", failure: "暂时无法发送。请稍后再试，或通过 Telegram 联系我。", invalidName: "请输入名字。", invalidEmail: "请输入有效邮箱。", invalidType: "请选择项目类型。", invalidBrief: "请至少写 20 个字符的项目概述。" } : { title: "Start a build conversation.", body: "Share the project context and it will be routed directly to my inbox without opening your email client.", response: "I typically reply to project inquiries within 1–2 business days.", privacyTitle: "Privacy & trust", privacy: "Formspree securely routes this form to lku199776@gmail.com. Your details are used only to reply to this project inquiry and are not sold or published.", identity: "Review my public identity and project record on GitHub", name: "Your name", sender: "Your email", type: "Project type", typePlaceholder: "Select a project type", types: [{ value: "web", label: "Web development" }, { value: "mobile", label: "Mobile app" }, { value: "consulting", label: "Consulting & technical direction" }, { value: "creative", label: "Creative technology & interaction" }, { value: "other", label: "Other" }], brief: "Project brief", placeholder: "Goals, timeline, and what you would like to build together.", submit: "Send project inquiry", sending: "Sending…", successTitle: "Signal received.", success: "Thank you for the trust. Your project inquiry is now on my workbench, and I will reply within 1–2 business days.", failure: "The message could not be sent just now. Please try again or reach out through Telegram.", invalidName: "Please enter your name.", invalidEmail: "Please enter a valid email address.", invalidType: "Please select a project type.", invalidBrief: "Please add at least 20 characters about the project." };
  const refreshChallenge = () => { setCaptchaAnswer(""); setCaptchaIndex((value) => (value + 1) % captchaChallenges.length); setOpenedAt(Date.now()); };
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const nextErrors: typeof errors = {}; if (!values.name.trim()) nextErrors.name = labels.invalidName; if (!/^\S+@\S+\.\S+$/.test(values.sender)) nextErrors.sender = labels.invalidEmail; if (!values.projectType) nextErrors.projectType = labels.invalidType; if (values.brief.trim().length < 20) nextErrors.brief = labels.invalidBrief; if (captchaAnswer.trim() !== challenge.answer) nextErrors.captcha = captchaCopy.invalid; if (Date.now() - openedAt < 1200) nextErrors.captcha = captchaCopy.wait; setErrors(nextErrors); setStatus(null); if (Object.keys(nextErrors).length) return; if (values.website.trim()) { setValues({ name: "", sender: "", projectType: "", brief: "", website: "" }); setStatus({ type: "success", title: labels.successTitle, message: labels.success }); refreshChallenge(); return; } const selectedType = values.projectType; setIsSubmitting(true); try { const response = await fetch("https://formspree.io/f/xljrweeb", { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ name: values.name.trim(), email: values.sender.trim(), project_type: selectedType, message: values.brief.trim(), human_verification: "visible challenge passed", _subject: `Portfolio inquiry from ${values.name.trim()}`, recipient: email }) }); if (!response.ok) throw new Error("Form submission failed"); trackPortfolioEvent("inquiry_completed", { language, project_type: selectedType }); setValues({ name: "", sender: "", projectType: "", brief: "", website: "" }); setStatus({ type: "success", title: labels.successTitle, message: labels.success }); refreshChallenge(); } catch { setStatus({ type: "error", message: labels.failure }); } finally { setIsSubmitting(false); } };
  return <form className="inquiry-form" onSubmit={submit} noValidate><div className="inquiry-form-head"><h3>{labels.title}</h3><p>{labels.body}</p><p className="inquiry-response-note"><i aria-hidden="true" />{labels.response}</p><aside className="inquiry-trust"><b>{labels.privacyTitle}</b><p>{labels.privacy}</p><a href={LINKS.github} target="_blank" rel="noreferrer"><Github size={13} />{labels.identity}<ArrowUpRight size={13} /></a></aside></div><label><span>{labels.name}</span><input name="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} aria-invalid={Boolean(errors.name)} />{errors.name && <em>{errors.name}</em>}</label><label><span>{labels.sender}</span><input name="email" type="email" value={values.sender} onChange={(event) => setValues({ ...values, sender: event.target.value })} aria-invalid={Boolean(errors.sender)} />{errors.sender && <em>{errors.sender}</em>}</label><label><span>{labels.type}</span><select name="project_type" value={values.projectType} onChange={(event) => setValues({ ...values, projectType: event.target.value })} aria-invalid={Boolean(errors.projectType)}><option value="">{labels.typePlaceholder}</option>{labels.types.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select>{errors.projectType && <em>{errors.projectType}</em>}</label><label><span>{labels.brief}</span><textarea name="message" value={values.brief} onChange={(event) => setValues({ ...values, brief: event.target.value })} placeholder={labels.placeholder} aria-invalid={Boolean(errors.brief)} />{errors.brief && <em>{errors.brief}</em>}</label><fieldset className="human-check" aria-describedby="human-check-note"><legend><ShieldCheck size={15} />{captchaCopy.title}</legend><p id="human-check-note">{captchaCopy.note}</p><div><b>{challenge.prompt[language]}</b><input inputMode="numeric" aria-label={challenge.prompt[language]} value={captchaAnswer} onChange={(event) => setCaptchaAnswer(event.target.value.replace(/[^0-9]/g, ""))} aria-invalid={Boolean(errors.captcha)} /><button type="button" onClick={refreshChallenge} aria-label={captchaCopy.refresh}><RefreshCw size={14} /><span>{captchaCopy.refresh}</span></button></div>{errors.captcha && <em>{errors.captcha}</em>}</fieldset><label className="inquiry-form-honeypot" aria-hidden="true"><span>Website</span><input name="_gotcha" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => setValues({ ...values, website: event.target.value })} /></label><button type="submit" disabled={isSubmitting}>{isSubmitting ? <LoaderCircle className="form-submit-spinner" size={16} /> : <Send size={16} />}{isSubmitting ? labels.sending : labels.submit}</button><AnimatePresence>{status?.type === "success" && <motion.div className="inquiry-success" role="status" aria-live="polite" initial={{ opacity: 0, y: 12, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: .98 }} transition={{ duration: .42, ease: [0.16, 1, 0.3, 1] }}><span className="inquiry-success-seal"><Check size={22} strokeWidth={2.6} /></span><div><b>{status.title}</b><p>{status.message}</p></div></motion.div>}</AnimatePresence>{status?.type === "error" && <p className="inquiry-status inquiry-status--error" role="status">{status.message}</p>}</form>;
}

function SkillGroupPanel({ group, language, replayToken, repositoryLabel, sourceLabel, liveLabel, previewLabel, onPreview, onRouteRitual, motionRestricted }: { group: typeof skillGroups[number]; language: Language; replayToken: number; repositoryLabel: string; sourceLabel: string; liveLabel: string; previewLabel: string; onPreview: (repository: RepositoryDefinition) => void; onRouteRitual: (target: string, mark: string) => void; motionRestricted: boolean }) {
  const groupRef = useRef<HTMLElement>(null);
  const [cycle, setCycle] = useState(0);
  const replay = () => {
    const element = groupRef.current;
    if (!element) return;
    element.classList.remove("skill-group--filled");
    void element.offsetWidth;
    element.classList.add("skill-group--filled");
    setCycle((value) => value + 1);
  };

  useEffect(() => {
    if (replayToken > 0) replay();
  }, [replayToken]);

  useEffect(() => {
    const element = groupRef.current;
    if (!element) return;
    let armed = false;
    let frame = 0;
    const checkCrossing = () => {
      const rect = element.getBoundingClientRect();
      const triggerLine = window.innerHeight * 0.56;
      const crossing = rect.top <= triggerLine && rect.bottom >= triggerLine;
      if (crossing && !armed) { replay(); armed = true; }
      if (!crossing) { armed = false; element.classList.remove("skill-group--filled"); }
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(checkCrossing); };
    checkCrossing(); window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  const relatedRepositories = repositories.filter((repository) => repository.category === group.tone);
  return <article id={`skill-${group.tone}`} ref={groupRef} className={`skill-group skill-group--${group.tone}`}><div className="skill-group-head"><span>{group.id} / 03</span><h3>{group.title[language]}</h3><p>{group.detail[language]}</p></div><div className="skill-list">{group.skills.map((skill, index) => <SkillMeter key={skill.name} skill={skill} language={language} index={index} cycle={cycle} motionRestricted={motionRestricted} />)}</div>{relatedRepositories.length > 0 && <div className="skill-repository-section"><div className="skill-repository-label"><span>{repositoryLabel}</span><small>{group.id} / GITHUB</small></div><div className="skill-repository-grid">{relatedRepositories.map((repository) => <RepositoryCard key={repository.name} repository={repository} language={language} embedded sourceLabel={sourceLabel} liveLabel={liveLabel} previewLabel={previewLabel} onPreview={onPreview} onRouteRitual={onRouteRitual} />)}</div></div>}</article>;
}

function HeroSkillSummary({ language, eyebrow, title, body }: { language: Language; eyebrow: string; title: string; body: string }) {
  return <aside className="hero-skill-summary" aria-label={title}><div className="hero-skill-summary-head"><span>{eyebrow}</span><b>{title}</b><p>{body}</p></div><div className="hero-skill-summary-list">{skillGroups.map((group) => <button key={group.id} type="button" className={`hero-skill-summary-row hero-skill-summary-row--${group.tone}`} onClick={() => scrollToId(`skill-${group.tone}`)} aria-label={group.title[language]}><div><span>{group.id}</span><b>{group.summary[language]}</b><em>{group.summaryLevel}%</em></div><i><u style={{ width: `${group.summaryLevel}%` }} /></i></button>)}</div></aside>;
}

const copy = {
  en: {
    nav: ["Work", "Disciplines", "Services", "About", "Skills", "CV", "Contact"], mark: "MK / Developer & Creative Technologist", eyebrow: "SereyMongkul · Jack",
    heroLead: "I turn ideas into", heroEmphasis: "interactive\nexperiences.", heroBody: "I build modern software, experiential interfaces, and experimental digital products with a clear reason to exist.", heroProof: ["WEB SYSTEMS", "MOBILE APPS", "3D INTERACTION"], proofLabel: "MK BUILD INDEX", heroSkillsEyebrow: "Capability signal", heroSkillsTitle: "11 active disciplines", heroSkillsBody: "A concise read of the systems I am actively sharpening. Choose a current to enter its ledger.",
    enter: "Draw the blade", scroll: "Scroll to descend", chapter: "Chapter", workEyebrow: "Selected explorations", workTitle: "A practice of\nmaking things move.", workBody: "A selection of the worlds I am building across web, mobile, interactive systems, and emerging technology.", code: "Unseal build archive", inspect: "Enter project chamber", close: "Seal chamber", returnHome: "Return to origin", replaySkills: "Replay skills",
    disciplinesEyebrow: "The craft", disciplinesTitle: "Four paths.\nOne evolving practice.", disciplinesBody: "I work where useful software and memorable interaction meet—across system logic, visual motion, and real-world use.", servicesEyebrow: "Ways to work together", servicesTitle: "Focused systems.\nMemorable interaction.", servicesBody: "Three collaboration paths for turning a clear brief into an intentional build.", servicesOutcome: "Outcome", servicesFit: "Best fit",
    philosophyEyebrow: "The person behind MK", philosophyTitle: "Build with purpose.\nDesign with intention.", philosophy: "Development is more than writing code. It is the work of taking an idea from a spark to an experience that is useful, memorable, and enjoyable.",
    loreLabel: "Personal universe", loreTitle: "The Wandering Sword Cultivator", lore: "Behind MK is a personal mythology: a traveler who keeps learning, refining, and moving forward without needing to display every measure of strength.", quote: "I walk as a Saint. I wield the sword of a Di.",
    nowEyebrow: "Current trajectory", now: ["Web Development", "3D Experiences", "Game Development", "Flutter & Mobile", "Computer Vision", "AI & Emerging Technologies"],
    skillsEyebrow: "Capability ledger", skillsTitle: "Code sharpened\nthrough practice.", skillsBody: "A working skill map drawn from my GitHub README: web, mobile, games, 3D, computer vision, and the systems that connect them.", skillsRepositories: "Repository evidence", sourceLabel: "Open source", liveLabel: "Visit build", previewLabel: "Preview dossier", technicalLabel: "Technical notes", galleryLabel: "Project gallery", previousLabel: "Previous screenshot", nextLabel: "Next screenshot",
    archiveEyebrow: "Build archive", archiveTitle: "Selected public code.", archiveBody: "Filter verified GitHub work by the practice it extends.", archiveSearchPlaceholder: "Search repository, language, or system", archiveSearchHint: "Type to narrow · ↑ ↓ move · Enter opens", archiveSearchEmpty: "No verified build matches this search.", filters: { all: "All builds", web: "Web & 3D", mobile: "Mobile & Play", craft: "Experiment & Craft" }, activityEyebrow: "Recent GitHub signal", activityTitle: "The forge is moving.", activityBody: "Latest public commits across the selected repository archive.", activityLive: "Live GitHub data", activitySnapshot: "Verified snapshot", activityCommit: "Commit",
    contactEyebrow: "Open a channel", contactTitle: "Have an idea\nworth forging?", contactBody: "I am available for selected web, mobile, and creative-technology collaborations with a clear problem worth solving.", availabilityTitle: "Available for selected collaborations", availabilityBody: "Asia/Phnom_Penh · focused prototypes, portfolio sites, interface systems, and small-to-medium builds · typical reply: 1–2 business days.", signal: "Send a signal", story: "Follow the story", archive: "Enter the archive", footer: "Imagine it. Build it. Improve it.", closed: "Reliquary sealed · 2026",
    stamp: ["WORK", "CRAFT", "SERVICES", "ORIGIN", "SKILLS", "CV", "SIGNAL"], switchLabel: "中文",
  },
  zh: {
    nav: ["作品", "方向", "服务", "关于", "技能", "简历", "联系"], mark: "MK / 开发者与创意技术家", eyebrow: "SereyMongkul · Jack · 天毅",
    heroLead: "我把想法变成", heroEmphasis: "可互动的\n数字体验。", heroBody: "我专注于现代软件、体验型界面与实验性数字产品，让每个想法都有清晰的目标与真实的交互感。", heroProof: ["网页系统", "移动应用", "3D 交互"], proofLabel: "MK 构建索引", heroSkillsEyebrow: "能力信号", heroSkillsTitle: "11 项核心能力", heroSkillsBody: "快速浏览我持续精进的技术方向。选择任一方向进入对应技能账本。",
    enter: "拔剑探索", scroll: "向下进入", chapter: "章节", workEyebrow: "精选探索", workTitle: "让想法\n真正动起来。", workBody: "我在网页、移动端、交互系统与新兴技术之间持续构建的数字世界。", code: "解封构建档案", inspect: "进入项目空间", close: "关闭项目空间", returnHome: "返回起点", replaySkills: "重播技能动画",
    disciplinesEyebrow: "创作领域", disciplinesTitle: "四条路径，\n持续进化的实践。", disciplinesBody: "我在实用的软件与难忘的交互之间工作，让系统逻辑、视觉运动和真实使用自然衔接。", servicesEyebrow: "合作方式", servicesTitle: "聚焦系统。\n难忘交互。", servicesBody: "三条合作路径，将清晰的需求转化为有意图的构建成果。", servicesOutcome: "交付结果", servicesFit: "适合的合作",
    philosophyEyebrow: "MK 背后的人", philosophyTitle: "有目的地构建。\n有意识地设计。", philosophy: "开发不只是编写代码，而是把一个想法从火花带到真正有用、难忘且令人愉悦的体验。",
    loreLabel: "个人世界观", loreTitle: "天毅 · 行走的剑修", lore: "天毅独自行走于斗气大陆。他以剑道为路，只向世人显露部分力量，并持续学习、淬炼与远行。", quote: "我以斗圣行走，执斗帝之剑。",
    nowEyebrow: "正在探索", now: ["网页开发", "3D 体验", "游戏开发", "Flutter 与移动端", "计算机视觉", "AI 与新兴技术"],
    skillsEyebrow: "能力账本", skillsTitle: "以实践磨砺\n代码。", skillsBody: "一份源自 GitHub README 的技能地图：网页、移动端、游戏、3D、计算机视觉，以及连接它们的系统能力。", skillsRepositories: "代码依据", sourceLabel: "查看源码", liveLabel: "访问作品", previewLabel: "查看项目档案", technicalLabel: "技术说明", galleryLabel: "项目画廊", previousLabel: "上一张截图", nextLabel: "下一张截图",
    archiveEyebrow: "构建档案", archiveTitle: "精选公开代码。", archiveBody: "按其延伸的技能方向筛选经过验证的 GitHub 项目。", archiveSearchPlaceholder: "搜索仓库、语言或系统", archiveSearchHint: "输入筛选 · ↑ ↓ 移动 · Enter 打开", archiveSearchEmpty: "没有符合本次搜索的已验证项目。", filters: { all: "全部构建", web: "网页与 3D", mobile: "移动端与游戏", craft: "实验与工艺" }, activityEyebrow: "近期 GitHub 信号", activityTitle: "锻造仍在继续。", activityBody: "精选仓库档案中的最新公开提交。", activityLive: "GitHub 实时数据", activitySnapshot: "已验证快照", activityCommit: "提交",
    contactEyebrow: "开启联络", contactTitle: "有值得锻造的\n想法吗？", contactBody: "目前开放筛选后的网页、移动端与创意技术合作，尤其欢迎有明确问题和目标的项目。", availabilityTitle: "当前开放筛选后的合作", availabilityBody: "Asia/Phnom_Penh 时区 · 聚焦原型、作品集网站、界面系统与中小型构建 · 通常在 1–2 个工作日内回复。", signal: "发送信号", story: "关注故事", archive: "进入代码档案", footer: "想象它。构建它。改进它。", closed: "秘藏已封 · 2026",
    stamp: ["作品", "技艺", "服务", "本源", "技能", "简历", "信号"], switchLabel: "EN",
  },
};

function scrollToId(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }

export default function Home() {
  const [location, setLocation] = useLocation();
  const language: Language = location === "/zh" ? "zh" : "en";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scene, setScene] = useState(0);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [showReturnHome, setShowReturnHome] = useState(false);
  const [skillReplayToken, setSkillReplayToken] = useState(0);
  const [activeProjectFilter, setActiveProjectFilter] = useState<ProjectFilter>("all");
  const [archiveQuery, setArchiveQuery] = useState("");
  const [activeRepository, setActiveRepository] = useState<RepositoryDefinition | null>(null);
  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>(() => repositories.map((repository) => ({ repository, ...repository.activity })).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)));
  const [activityLive, setActivityLive] = useState(false);
  const [motionPreference, setMotionPreference] = useState<MotionPreference>(() => {
    if (typeof window === "undefined") return "full";
    const stored = window.localStorage.getItem("mk-motion-preference");
    return stored === "reduced" || stored === "low-power" || stored === "full" ? stored : "full";
  });
  const [energyActivated, setEnergyActivated] = useState(false);
  const archiveSearchRef = useRef<HTMLInputElement>(null);
  const archiveCardRefs = useRef<Array<HTMLElement | null>>([]);
  const reduceMotion = useReducedMotion();
  const motionRestricted = Boolean(reduceMotion) || motionPreference !== "full";
  const shouldRenderEnergy = !motionRestricted && energyActivated;
  const motionClass = motionRestricted ? (motionPreference === "low-power" ? "low-power" : "reduced") : motionPreference;
  const t = copy[language];
  const navigateWithRitual = (target: string, mark = "MK / ROUTE") => { triggerAtmosphereCue("blade"); trackPortfolioEvent("route_ritual_started", { target, mark, language }); requestRouteRitual(target, { mark, language }); };
  const openChamber = (index: number) => { triggerAtmosphereCue("seal"); setActiveProject(index); };
  const openArchiveCommand = () => { scrollToId("work"); window.setTimeout(() => archiveSearchRef.current?.focus(), 460); };
  const commandProjects = repositories.filter((repository) => caseStudySlugs.has(repository.name)).map((repository, index) => ({ id: `0${index + 1}`, title: repository.name, target: `${language === "zh" ? "/zh" : ""}/case-studies/${repository.name}` }));
  const navTargets = ["work", "disciplines", "services", "about", "skills", "resume", "contact"];
  const languagePages: { code: Language; path: string; label: string }[] = [{ code: "en", path: "/", label: "EN" }, { code: "zh", path: "/zh", label: "中文" }];
  const visibleRepositories = (activeProjectFilter === "all" ? repositories : repositories.filter((repository) => repository.category === activeProjectFilter)).filter((repository) => {
    const query = archiveQuery.trim().toLowerCase();
    return !query || [repository.name, repository.languages, repository.description[language], repository.category, ...repository.technicalNotes[language]].join(" ").toLowerCase().includes(query);
  });
  const { scrollY, scrollYProgress } = useScroll();
  const scrollVelocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 380, mass: 0.42 });
  const bladeTravel = useTransform(scrollYProgress, [0, 1], ["5vh", "89vh"]);
  const heroCopyTravel = useTransform(scrollY, [0, 720], [0, -125]);
  const heroCopyFade = useTransform(scrollY, [0, 540, 820], [1, 0.92, 0]);
  const heroPortraitTravel = useTransform(scrollY, [0, 760], [0, -205]);
  const heroPortraitRotate = useTransform(scrollY, [0, 760], [0, -7]);
  const ringTravel = useTransform(scrollY, [0, 760], [0, -85]);
  const ringRotate = useTransform(scrollY, [0, 760], [0, 42]);

  useEffect(() => {
    window.localStorage.setItem("mk-motion-preference", motionPreference);
  }, [motionPreference]);

  useEffect(() => {
    if (motionRestricted || window.matchMedia("(max-width: 720px)").matches) { setEnergyActivated(false); return; }
    let active = true;
    const activate = () => { if (active) setEnergyActivated(true); };
    const timer = window.setTimeout(activate, 1450);
    window.addEventListener("pointerdown", activate, { once: true, passive: true });
    window.addEventListener("keydown", activate, { once: true });
    return () => { active = false; window.clearTimeout(timer); window.removeEventListener("pointerdown", activate); window.removeEventListener("keydown", activate); };
  }, [motionRestricted]);

  useEffect(() => {
    const description = language === "zh" ? "SereyMongkul／天毅的开发者与创意技术作品集，涵盖网页系统、移动端、互动体验与新兴技术探索。" : "MK is the developer and creative-technology portfolio of SereyMongkul, spanning web systems, mobile products, interactive experiences, and emerging technology.";
    applyPortfolioSeo({
      path: location,
      title: language === "zh" ? "MK — 开发者与创意技术家" : "MK — Developer & Creative Technologist",
      description,
      image: "https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/mk-crimson-reliquary-hero-bg.jpg",
      imageAlt: language === "zh" ? "MK 赤红秘藏作品集主视觉" : "MK Crimson Reliquary portfolio hero artwork",
      structuredData: {
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Person", name: "SereyMongkul", alternateName: ["Jack", "天毅"], jobTitle: "Developer & Creative Technologist", sameAs: [LINKS.github, LINKS.telegram, LINKS.facebook], knowsAbout: ["React", "TypeScript", "Three.js", "WebGL", "Flutter", "Android", "Creative technology"] },
          { "@type": "WebSite", name: "MK — Developer & Creative Technologist", inLanguage: language === "zh" ? "zh-CN" : "en", description },
        ],
      },
    });
  }, [language, location]);

  useEffect(() => {
    let cancelled = false;
    const refreshActivity = async () => {
      try {
        const records = await Promise.all(repositories.map(async (repository) => {
          const response = await fetch(`https://api.github.com/repos/LanKuzuMK/${repository.name}/commits?per_page=1`, { headers: { Accept: "application/vnd.github+json" } });
          if (!response.ok) throw new Error(`GitHub activity unavailable for ${repository.name}`);
          const commits = await response.json() as Array<{ sha: string; html_url: string; commit: { message: string; committer: { date: string } } }>;
          const commit = commits[0];
          if (!commit) throw new Error(`No public commits returned for ${repository.name}`);
          return { repository, updatedAt: commit.commit.committer.date, message: commit.commit.message.split("\n")[0], sha: commit.sha.slice(0, 7), commitUrl: commit.html_url };
        }));
        if (!cancelled) { setActivityRecords(records.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))); setActivityLive(true); }
      } catch {
        if (!cancelled) setActivityLive(false);
      }
    };
    void refreshActivity();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const isFormControl = (target: EventTarget | null) => target instanceof HTMLElement && Boolean(target.closest("input, textarea, select, button"));
    const blockContext = (event: MouseEvent) => { if (!isFormControl(event.target)) event.preventDefault(); };
    const blockCopy = (event: ClipboardEvent) => { if (!isFormControl(event.target)) event.preventDefault(); };
    const blockDrag = (event: DragEvent) => { if (event.target instanceof HTMLImageElement) event.preventDefault(); };
    const blockInspectShortcuts = (event: KeyboardEvent) => {
      if (event.key === "F12" || ((event.ctrlKey || event.metaKey) && ["u", "s"].includes(event.key.toLowerCase()))) event.preventDefault();
    };
    document.addEventListener("contextmenu", blockContext);
    document.addEventListener("copy", blockCopy);
    document.addEventListener("dragstart", blockDrag);
    window.addEventListener("keydown", blockInspectShortcuts);
    return () => { document.removeEventListener("contextmenu", blockContext); document.removeEventListener("copy", blockCopy); document.removeEventListener("dragstart", blockDrag); window.removeEventListener("keydown", blockInspectShortcuts); };
  }, []);

  useEffect(() => {
    if (motionRestricted) return;
    const root = document.documentElement;
    let currentOpacity = 0;
    let targetOpacity = 0;
    let frame = 0;
    const easeBlur = () => {
      currentOpacity += (targetOpacity - currentOpacity) * 0.16;
      root.style.setProperty("--scroll-haze", currentOpacity.toFixed(3));
      if (Math.abs(targetOpacity - currentOpacity) > 0.002) frame = window.requestAnimationFrame(easeBlur);
      else { root.style.setProperty("--scroll-haze", targetOpacity.toFixed(3)); frame = 0; }
    };
    const unsubscribe = scrollVelocity.on("change", (velocity) => {
      targetOpacity = Math.min(0.5, Math.abs(velocity) / 1200 * 0.5);
      if (!frame) frame = window.requestAnimationFrame(easeBlur);
    });
    return () => { unsubscribe(); if (frame) window.cancelAnimationFrame(frame); document.documentElement.style.setProperty("--scroll-haze", "0"); };
  }, [motionRestricted, scrollVelocity]);

  useEffect(() => {
    const sections = ["origin", "work", "disciplines", "services", "about", "skills", "resume", "contact"];
    const updateScene = () => {
      const marker = window.scrollY + window.innerHeight * 0.46;
      setScene(Math.max(sections.findLastIndex((id) => (document.getElementById(id)?.offsetTop ?? Infinity) <= marker), 0));
    };
    updateScene(); window.addEventListener("scroll", updateScene, { passive: true });
    return () => window.removeEventListener("scroll", updateScene);
  }, []);

  useEffect(() => {
    const updateReturnControl = () => setShowReturnHome(window.scrollY > window.innerHeight * 0.78);
    updateReturnControl(); window.addEventListener("scroll", updateReturnControl, { passive: true });
    return () => window.removeEventListener("scroll", updateReturnControl);
  }, []);

  useEffect(() => {
    if (motionRestricted || !window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    const cursor = document.querySelector<HTMLElement>(".crimson-cursor");
    const hero = document.querySelector<HTMLElement>(".hero-scene");
    let frame = 0;
    let latestPointer: PointerEvent | null = null;

    const renderPointer = () => {
      if (!latestPointer) return;
      const { clientX, clientY } = latestPointer;
      root.style.setProperty("--cursor-x", `${clientX}px`);
      root.style.setProperty("--cursor-y", `${clientY}px`);
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const ratioX = Math.max(-1, Math.min(1, (clientX - rect.left) / rect.width * 2 - 1));
        const ratioY = Math.max(-1, Math.min(1, (clientY - rect.top) / rect.height * 2 - 1));
        hero.style.setProperty("--hero-x", `${ratioX * 9}px`);
        hero.style.setProperty("--hero-y", `${ratioY * 7}px`);
      }
      frame = 0;
    };

    const handlePointer = (event: PointerEvent) => {
      latestPointer = event;
      if (!frame) frame = window.requestAnimationFrame(renderPointer);
    };

    const interactive = Array.from(document.querySelectorAll<HTMLElement>(".gateway-card, .repository-card, .service-card, .discipline-card, .contact-path, .draw-button, .gateway-content a, .project-filter, .skills-replay"));
    const handleTilt = (event: PointerEvent) => {
      const element = event.currentTarget as HTMLElement;
      const rect = element.getBoundingClientRect();
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 4;
      const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -3;
      element.style.setProperty("--tilt-x", `${rotateX}deg`);
      element.style.setProperty("--tilt-y", `${rotateY}deg`);
      if (element.matches(".draw-button, .contact-path, .gateway-content a, .project-filter, .skills-replay")) {
        const magneticX = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
        const magneticY = ((event.clientY - rect.top) / rect.height - 0.5) * 7;
        element.style.setProperty("--magnetic-x", `${magneticX}px`);
        element.style.setProperty("--magnetic-y", `${magneticY}px`);
      }
    };
    const clearTilt = (event: PointerEvent) => {
      const element = event.currentTarget as HTMLElement;
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
      element.style.setProperty("--magnetic-x", "0px");
      element.style.setProperty("--magnetic-y", "0px");
    };
    const activateCursor = () => cursor?.classList.add("crimson-cursor--active");
    const resetCursor = () => cursor?.classList.remove("crimson-cursor--active");

    window.addEventListener("pointermove", handlePointer, { passive: true });
    interactive.forEach((element) => {
      element.addEventListener("pointermove", handleTilt);
      element.addEventListener("pointerleave", clearTilt);
      element.addEventListener("pointerenter", activateCursor);
      element.addEventListener("pointerleave", resetCursor);
    });

    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>(".section-head, .gateway-list, .project-archive, .discipline-grid, .services-grid, .about-layout, .skills-ledger, .resume-frame, .contact-main, .inquiry-form, .contact-paths"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("motion-stage--in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((element) => {
      element.classList.add("motion-stage");
      observer.observe(element);
    });

    const chapterTargets = Array.from(document.querySelectorAll<HTMLElement>(".scene-section"));
    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("scroll-chapter--in");
          chapterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    chapterTargets.forEach((section) => {
      section.classList.add("scroll-chapter");
      chapterObserver.observe(section);
    });

    return () => {
      window.removeEventListener("pointermove", handlePointer);
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      chapterObserver.disconnect();
      interactive.forEach((element) => {
        element.removeEventListener("pointermove", handleTilt);
        element.removeEventListener("pointerleave", clearTilt);
        element.removeEventListener("pointerenter", activateCursor);
        element.removeEventListener("pointerleave", resetCursor);
      });
    };
  }, [motionRestricted]);

  useEffect(() => {
    if (motionRestricted || window.matchMedia("(max-width:720px)").matches) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".scene-section"));
    let frame = 0;
    const updateDepth = () => {
      const viewport = window.innerHeight;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const center = rect.top + rect.height * 0.5;
        const distance = Math.min(1, Math.abs(center - viewport * 0.5) / (viewport * 0.86));
        section.style.setProperty("--section-depth", `${1 - distance}`);
        section.classList.toggle("section-approaching", rect.top < viewport * 0.9 && rect.bottom > viewport * 0.1);
      });
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateDepth); };
    updateDepth(); window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, [motionRestricted]);

  useEffect(() => {
    if (activeProject === null && activeRepository === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [activeProject, activeRepository]);

  return (
    <main className={`reliquary-shell reliquary-shell--${language} reliquary-shell--motion-${motionClass}`} lang={language === "zh" ? "zh-CN" : "en"}>
      <div className="crimson-cursor" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="scroll-haze" aria-hidden="true" />
      <div className="blade-spine" aria-hidden="true"><span className={`spine-glow spine-glow--${scene}`} /><motion.span className="blade-traveler" style={{ top: bladeTravel }} /><span className="spine-counter">0{scene + 1} / 08</span></div>
      <AnimatePresence>{showReturnHome && <motion.button className="return-origin" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={t.returnHome} initial={{ opacity: 0, y: 18, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.92 }} transition={{ duration: 0.34, ease: [0.23, 1, 0.32, 1] }}><span className="return-origin-glyph"><ArrowUp size={16} /></span><span className="return-origin-copy"><b>{t.returnHome}</b><small>MK / 01</small></span><motion.i style={{ scaleY: scrollYProgress }} /></motion.button>}</AnimatePresence>

      <header className="site-header">
        <button className="brand-lockup" onClick={() => scrollToId("origin")} aria-label="Back to top"><span className="brand-sigil" aria-hidden="true"><i /><i /><b /></span><span className="brand-role">{t.mark}</span></button>
        <nav className="desktop-nav" aria-label="Main navigation">{t.nav.map((label, index) => <button key={label} onClick={() => scrollToId(navTargets[index])} className="nav-link"><span>0{index + 1}</span>{label}</button>)}<button onClick={() => navigateWithRitual(language === "zh" ? "/zh/signature" : "/signature", "MK / SIGNATURE")} className="signature-nav-link"><span>MK</span>{language === "zh" ? "签名" : "Signature"}</button></nav>
        <div className="header-actions"><div className="language-page-switch" aria-label="Switch portfolio language">{languagePages.map((page) => <button key={page.code} className={page.code === language ? "active" : ""} onClick={() => setLocation(page.path)}>{page.label}</button>)}</div><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Open navigation menu">{menuOpen ? <X size={20} /> : <Menu size={21} />}</button></div>
      </header>
      <motion.div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`} initial={false} animate={{ opacity: menuOpen ? 1 : 0, y: menuOpen ? 0 : -16 }} transition={{ duration: 0.24 }} aria-hidden={!menuOpen}>{t.nav.map((label, index) => <button key={label} onClick={() => { scrollToId(navTargets[index]); setMenuOpen(false); }}>{label}<ChevronRight size={16} /></button>)}<button className="mobile-signature-link" onClick={() => { navigateWithRitual(language === "zh" ? "/zh/signature" : "/signature", "MK / SIGNATURE"); setMenuOpen(false); }}>{language === "zh" ? "MK 个人签名" : "MK Personal Signature"}<ArrowUpRight size={16} /></button><div className="mobile-language-switch">{languagePages.map((page) => <button key={page.code} className={page.code === language ? "active" : ""} onClick={() => { setLocation(page.path); setMenuOpen(false); }}>{page.label}</button>)}</div></motion.div>

      <section id="origin" className="hero-scene">
        <img className="hero-world" src="https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/mk-crimson-reliquary-hero-bg.jpg" alt="" aria-hidden="true" fetchPriority="high" decoding="async" />{!motionRestricted && (shouldRenderEnergy ? <Suspense fallback={<HeroFieldLoader language={language} />}><EnergyField scrollProgress={scrollYProgress} scrollVelocity={scrollVelocity} /></Suspense> : <HeroFieldLoader language={language} />)}<div className="hero-veil" aria-hidden="true" /><motion.div className="hero-rings" style={{ y: ringTravel, rotate: ringRotate }} aria-hidden="true"><i /><i /><i /></motion.div>
        <motion.div className="hero-copy-motion" style={{ y: heroCopyTravel, opacity: heroCopyFade }}><div className="hero-copy"><motion.p className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>{t.eyebrow}</motion.p><motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.22 }}><span>{t.heroLead}</span><em>{t.heroEmphasis}</em></motion.h1><motion.p className="hero-body" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>{t.heroBody}</motion.p><motion.div className="hero-tech-strip" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.66 }}><span>{t.proofLabel}</span><div>{t.heroProof.map((item) => <b key={item}>{item}</b>)}</div></motion.div><motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.62, delay: 0.72 }}><HeroSkillSummary language={language} eyebrow={t.heroSkillsEyebrow} title={t.heroSkillsTitle} body={t.heroSkillsBody} /></motion.div><motion.button className="draw-button" onClick={() => scrollToId("work")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}><span className="button-glyph">↘</span>{t.enter}<ArrowUpRight size={17} /></motion.button></div></motion.div>
        <motion.div className="hero-portrait-wrap" style={{ y: heroPortraitTravel, rotate: heroPortraitRotate }} initial={{ opacity: 0, scale: 0.96, x: 32 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: motionRestricted ? 0.1 : 1.05, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}><img className="hero-portrait" src="https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/mk-hero-art-no-stars.png" alt={language === "zh" ? "MK 天毅的赤红剑客作品图" : "MK crimson swordsman portfolio artwork"} fetchPriority="high" decoding="async" /><span className="portrait-caption">{language === "zh" ? "天毅 / MK" : "MK / Jack"}</span></motion.div>
        <MotionPreferenceControl language={language} value={motionPreference} onChange={setMotionPreference} />
        <AtmosphereControl language={language} motionRestricted={motionRestricted} />
        <button className="scroll-invitation" onClick={() => scrollToId("work")}><span>{t.scroll}</span><ArrowDown size={15} /></button><span className="hero-index">01<br /><i>{t.chapter}</i></span>
      </section>

      <section id="work" className="work-scene scene-section"><div className="section-stamp" aria-hidden="true"><b>02</b><span>{t.stamp[0]}<br />02</span></div><div className="section-head section-head--wide"><div><p className="eyebrow">{t.workEyebrow}</p><h2>{t.workTitle}</h2></div><p className="section-body">{t.workBody}</p></div><div className="blade-transition" aria-hidden="true"><span /><i /></div><div className="gateway-list">{explorations.map((item, index) => <article key={item.index} className={`gateway-card ${item.offset}`} data-build={item.trace[language]}><div className={`gateway-media ${item.mark ? "gateway-media--mark" : ""}`} role="button" tabIndex={0} onClick={() => openChamber(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openChamber(index); } }}><img src={item.image} alt={item.mark ? (language === "zh" ? "MK 徽记标志" : "MK monogram mark") : ""} loading="lazy" decoding="async" /><span className="gateway-sweep" aria-hidden="true" />{!item.mark && <span className="gateway-ring" />}{item.mark && <span className="mark-aura" />}</div><div className="gateway-content"><p>{item.index}</p><h3>{item.title[language]}</h3><span>{item.label[language]}</span><p className="gateway-description">{item.description[language]}</p><div className="build-evidence"><i>BUILD SPEC</i><b>{item.evidence[language]}</b></div><button className="project-chamber-trigger" onClick={() => openChamber(index)}>{t.inspect}<ArrowUpRight size={16} /></button><a href={LINKS.github} target="_blank" rel="noreferrer">{t.code}<ArrowUpRight size={16} /></a></div><span className="gateway-number">0{index + 1}</span></article>)}</div><div className="project-archive"><div className="project-archive-head"><div><p className="eyebrow">{t.archiveEyebrow}</p><h3>{t.archiveTitle}</h3></div><p>{t.archiveBody}</p></div><div className="project-archive-tools"><div className="archive-search"><Search size={15} aria-hidden="true" /><input ref={archiveSearchRef} value={archiveQuery} onChange={(event) => setArchiveQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); archiveCardRefs.current[0]?.focus(); } if (event.key === "Escape") { setArchiveQuery(""); event.currentTarget.blur(); } }} placeholder={t.archiveSearchPlaceholder} aria-label={t.archiveSearchPlaceholder} /><small>{t.archiveSearchHint}</small></div><div className="project-filter-bar" role="group" aria-label={t.archiveTitle}>{(["all", "web", "mobile", "craft"] as ProjectFilter[]).map((filter) => <button key={filter} type="button" onClick={() => { triggerAtmosphereCue("signal"); trackPortfolioEvent("case_gallery_filter_selected", { filter, language, surface: "archive" }); setActiveProjectFilter(filter); }} className={`project-filter project-filter--${filter} ${activeProjectFilter === filter ? "is-active" : ""}`} aria-pressed={activeProjectFilter === filter}><i aria-hidden="true" />{t.filters[filter]}</button>)}</div></div><ExperimentVault language={language} /><div className="project-repository-grid">{visibleRepositories.map((repository, index) => <RepositoryCard key={repository.name} repository={repository} language={language} sourceLabel={t.sourceLabel} liveLabel={t.liveLabel} previewLabel={t.previewLabel} onPreview={setActiveRepository} onRouteRitual={navigateWithRitual} cardRef={(element) => { archiveCardRefs.current[index] = element; }} onKeyDown={(event) => { const nextIndex = event.key === "ArrowRight" || event.key === "ArrowDown" ? index + 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? index - 1 : index; if (nextIndex !== index) { event.preventDefault(); archiveCardRefs.current[(nextIndex + visibleRepositories.length) % visibleRepositories.length]?.focus(); } }} />)}</div>{visibleRepositories.length === 0 && <p className="archive-search-empty">{t.archiveSearchEmpty}</p>}<ActivityTimeline records={activityRecords} language={language} live={activityLive} eyebrow={t.activityEyebrow} title={t.activityTitle} body={t.activityBody} liveLabel={t.activityLive} snapshotLabel={t.activitySnapshot} commitLabel={t.activityCommit} /></div></section>

      <section id="disciplines" className="discipline-scene scene-section"><div className="section-stamp section-stamp--light" aria-hidden="true"><b>03</b><span>{t.stamp[1]}<br />03</span></div><img src="https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/mk-sword-path-texture.jpg" alt="" className="path-texture" aria-hidden="true" loading="lazy" decoding="async" /><div className="section-head section-head--split"><div><p className="eyebrow">{t.disciplinesEyebrow}</p><h2 className="craft-title">{t.disciplinesTitle}</h2></div><p className="section-body">{t.disciplinesBody}</p></div><div className="discipline-grid">{disciplines.map((item) => { const Icon = item.icon; return <article className="discipline-card" key={item.id} tabIndex={0} data-seal={language === "zh" ? `封 / ${item.id}` : `SEAL / ${item.id}`}><div className="discipline-top"><span>{item.id}</span><Icon size={21} /></div><h3>{item.title[language]}</h3><p className="discipline-subtitle">{item.subtitle[language]}</p><p>{item.detail[language]}</p><i className="discipline-cut" aria-hidden="true" /></article>; })}</div></section>

      <section id="services" className="services-scene scene-section"><div className="section-stamp" aria-hidden="true"><b>04</b><span>{t.stamp[2]}<br />04</span></div><div className="section-head section-head--split"><div><p className="eyebrow">{t.servicesEyebrow}</p><h2>{t.servicesTitle}</h2></div><p className="section-body">{t.servicesBody}</p></div><div className="services-grid">{services.map((service) => <article key={service.id} className={`service-card service-card--${service.tone}`}><div><span>{service.id} / 03</span><i aria-hidden="true" /></div><h3>{service.title[language]}</h3><section><b>{t.servicesOutcome}</b><p>{service.outcome[language]}</p></section><section><b>{t.servicesFit}</b><p>{service.fit[language]}</p></section></article>)}</div></section>

      <section id="about" className="about-scene scene-section"><div className="section-stamp" aria-hidden="true"><b>05</b><span>{t.stamp[3]}<br />05</span></div><div className="about-line" aria-hidden="true"><span /></div><div className="about-layout"><div className="about-statement"><p className="eyebrow">{t.philosophyEyebrow}</p><h2>{t.philosophyTitle}</h2><p>{t.philosophy}</p><div className="now-list"><span>{t.nowEyebrow}</span><div>{t.now.map((item) => <b key={item}>{item}</b>)}</div></div></div><aside className="lore-panel"><div className="lore-symbol lore-symbol--clean"><span>{language === "zh" ? "天毅" : "MK"}</span></div><p className="lore-label">{t.loreLabel}</p><h3>{t.loreTitle}</h3><p>{t.lore}</p><blockquote>“{t.quote}”</blockquote><div className="lore-meta"><span>{language === "zh" ? "道路 / 剑道" : "Path / Sword Dao"}</span><span>{language === "zh" ? "力量 / 封印" : "Realm / Sealed"}</span></div></aside></div></section>

      <section id="skills" className="skills-scene scene-section"><div className="section-stamp section-stamp--light" aria-hidden="true"><b>06</b><span>{t.stamp[4]}<br />06</span></div><div className="skills-orbit" aria-hidden="true"><i /><i /><span /></div><div className="section-head section-head--split"><div><p className="eyebrow">{t.skillsEyebrow}</p><h2>{t.skillsTitle}</h2></div><p className="section-body">{t.skillsBody}</p></div><div className="skills-controls"><button className="skills-replay" onClick={() => setSkillReplayToken((value) => value + 1)}><span>↻</span>{t.replaySkills}</button><small>SCROLL LINE / REPLAY</small></div><div className="skills-ledger">{skillGroups.map((group) => <SkillGroupPanel key={group.id} group={group} language={language} replayToken={skillReplayToken} repositoryLabel={t.skillsRepositories} sourceLabel={t.sourceLabel} liveLabel={t.liveLabel} previewLabel={t.previewLabel} onPreview={setActiveRepository} onRouteRitual={navigateWithRitual} motionRestricted={motionRestricted} />)}</div></section>

      <ResumeSection language={language} email="lku199776@gmail.com" />
      <section id="contact" className="contact-scene scene-section"><div className="section-stamp section-stamp--light" aria-hidden="true"><b>08</b><span>{t.stamp[6]}<br />08</span></div><div className="contact-orbit" aria-hidden="true"><i /><i /><i /><span /></div><div className="contact-main"><p className="eyebrow">{t.contactEyebrow}</p><h2>{t.contactTitle}</h2><p>{t.contactBody}</p><div className="availability-signal"><i aria-hidden="true" /><div><b>{t.availabilityTitle}</b><span>{t.availabilityBody}</span></div></div></div><InquiryForm language={language} email="lku199776@gmail.com" /><div className="contact-paths"><a href={LINKS.telegram} target="_blank" rel="noreferrer" className="contact-path" data-seal={language === "zh" ? "传 / 01" : "LINK / 01"}><span className="path-icon"><Send size={19} /></span><span><b>Telegram</b><small>@TianyiXiong</small></span><ArrowUpRight size={19} /><em>{t.signal}</em></a><a href={LINKS.github} target="_blank" rel="noreferrer" className="contact-path" data-seal={language === "zh" ? "码 / 02" : "CODE / 02"}><span className="path-icon"><Github size={19} /></span><span><b>GitHub</b><small>LanKuzuMK</small></span><ArrowUpRight size={19} /><em>{t.archive}</em></a><a href={LINKS.facebook} target="_blank" rel="noreferrer" className="contact-path" data-seal={language === "zh" ? "见 / 03" : "SOCIAL / 03"}><span className="path-icon"><Facebook size={19} /></span><span><b>Facebook</b><small>jackurgodking</small></span><ArrowUpRight size={19} /><em>{t.story}</em></a></div></section>
      <footer className="site-footer"><div><img src="https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/mk-blade-monogram.png" alt="" /><span>MK</span></div><p>{t.footer}</p><small>{t.closed}</small></footer>
      {activeProject !== null && <Suspense fallback={<ChamberRitual language={language} />}><ProjectChamber open onClose={() => setActiveProject(null)} closeLabel={t.close} archiveLabel={t.code} githubUrl={LINKS.github} project={{ title: explorations[activeProject].title[language], label: explorations[activeProject].label[language], description: explorations[activeProject].description[language], evidence: explorations[activeProject].evidence[language], trace: explorations[activeProject].trace[language], image: explorations[activeProject].image }} /></Suspense>}
      <RepositoryPreviewDialog repository={activeRepository} language={language} open={activeRepository !== null} onOpenChange={(open) => { if (!open) setActiveRepository(null); }} technicalLabel={t.technicalLabel} sourceLabel={t.sourceLabel} liveLabel={t.liveLabel} galleryLabel={t.galleryLabel} previousLabel={t.previousLabel} nextLabel={t.nextLabel} />
      <PortfolioCommand language={language} motionPreference={motionPreference} onMotionChange={setMotionPreference} onArchive={openArchiveCommand} onNavigate={navigateWithRitual} projects={commandProjects} />
    </main>
  );
}
