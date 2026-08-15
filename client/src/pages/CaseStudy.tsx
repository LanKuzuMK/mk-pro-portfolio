/**
 * Crimson Reliquary case-study reminder: grounded public evidence, sealed-vermilion signals,
 * fast tactile transitions, and technical systems shown as readable visual records.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Github, Share2 } from "lucide-react";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { useLocation } from "wouter";
import { trackPortfolioEvent } from "@/lib/analytics";
import { applyPortfolioSeo } from "@/lib/seo";
import { requestRouteRitual, triggerAtmosphereCue } from "@/lib/ritual";
import BladeMark from "@/components/BladeMark";

type Language = "en" | "zh";
type StudyFilter = "all" | "web" | "mobile";
type ReadingMode = "recruiter" | "visual" | "technical";
const readingModes: ReadingMode[] = ["recruiter", "visual", "technical"];
type Navigate = (target: string) => (event: React.MouseEvent<HTMLAnchorElement>) => void;

const studies = {
  "e-commerce-inventory-dashboard": {
    category: "WEB SYSTEM / 01", group: "web" as const, tags: ["JSP", "JSTL", "Docker"], image: "https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/ecommerce-dashboard-source-preview.webp", source: "https://github.com/LanKuzuMK/e-commerce-inventory-dashboard", live: "https://e-commerce-inventory-dashboard-5yda.onrender.com/login.jsp",
    en: { title: "E-Commerce Inventory Dashboard", lead: "A public Java inventory-dashboard project organized around an operational browser workflow.", sections: [{ title: "Build focus", text: "The public repository presents an inventory dashboard built with JSP and JSTL, concentrating on a practical browser-facing management flow." }, { title: "Technical record", items: ["JSP and JSTL dashboard views", "Tomcat 11 runtime target", "Dockerfile included for cloud hosting"] }, { title: "Public evidence", text: "The project source and a deployed login route are available for review. The live service may take time to wake from an idle state." }] },
    zh: { title: "电商库存管理仪表盘", lead: "一个围绕实际浏览器工作流组织的公开 Java 库存仪表盘项目。", sections: [{ title: "构建重点", text: "公开仓库展示了一个使用 JSP 与 JSTL 构建的库存仪表盘，聚焦于实用的浏览器端管理流程。" }, { title: "技术记录", items: ["JSP 与 JSTL 仪表盘视图", "面向 Tomcat 11 的运行目标", "包含云端托管的 Dockerfile"] }, { title: "公开依据", text: "项目源码与已部署的登录路径均可供查看。在线服务从空闲状态唤醒时可能需要一点时间。" }] },
  },
  "MK-_schedule": {
    category: "WEB SYSTEM / 02", group: "web" as const, tags: ["TypeScript", "CSS", "Vite"], image: "https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/mk-schedule-live-preview.webp", source: "https://github.com/LanKuzuMK/MK-_schedule", live: "https://mk-schedule.vercel.app",
    en: { title: "MK Schedule", lead: "A public TypeScript schedule interface with a deployed browser build and weekday navigation.", sections: [{ title: "Build focus", text: "This project packages a scheduling interface into a small, accessible public web build." }, { title: "Technical record", items: ["TypeScript, CSS, and HTML", "Weekday navigation in the public interface", "Deployed public build"] }, { title: "Public evidence", text: "Both the live deployment and public source are linked directly from this case study." }] },
    zh: { title: "MK Schedule", lead: "一个带有已部署浏览器版本与工作日导航的公开 TypeScript 日程界面。", sections: [{ title: "构建重点", text: "该项目将日程界面打包为轻量、可访问的公开网页版本。" }, { title: "技术记录", items: ["TypeScript、CSS 与 HTML", "公开界面中的工作日导航", "已部署的公开版本"] }, { title: "公开依据", text: "在线部署与公开源码均可直接从此案例进入。" }] },
  },
  "skybound-knight-play": {
    category: "MOBILE + PLAY / 03", group: "mobile" as const, tags: ["TypeScript", "Java", "Android"], image: "https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/skybound-knight-live-preview.webp", source: "https://github.com/LanKuzuMK/skybound-knight-play", live: "https://skybound-knight-play.pages.dev",
    en: { title: "Skybound Knight", lead: "A responsive endless fantasy platformer published for the browser, with Android APK support documented in its public project description.", sections: [{ title: "Build focus", text: "The project brings a playable platforming loop to a responsive browser surface while keeping an Android delivery path in view." }, { title: "Technical record", items: ["TypeScript, JavaScript, Java, and HTML", "Responsive endless fantasy platformer", "Public project description documents Android APK support"] }, { title: "Public evidence", text: "The playable deployment and public repository are available for direct exploration." }] },
    zh: { title: "Skybound Knight", lead: "一个发布在浏览器上的响应式无尽奇幻平台游戏，其公开项目说明记录了 Android APK 支持。", sections: [{ title: "构建重点", text: "该项目将可玩的平台跳跃循环带到响应式浏览器界面，同时保留 Android 端交付路径。" }, { title: "技术记录", items: ["TypeScript、JavaScript、Java 与 HTML", "响应式无尽奇幻平台游戏", "公开项目说明记录了 Android APK 支持"] }, { title: "公开依据", text: "可玩的在线版本与公开仓库均可直接探索。" }] },
  },
} as const;

type StudyEntry = [keyof typeof studies, (typeof studies)[keyof typeof studies]];
type CategoryGroup = "web" | "mobile" | "craft";

function CategoryIcon({ group }: { group: CategoryGroup }) {
  if (group === "mobile") return <svg className={`category-icon category-icon--${group}`} viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2" /><path d="M10 5h4M10 18.5h4" /><circle cx="12" cy="16" r=".7" /></svg>;
  if (group === "craft") return <svg className={`category-icon category-icon--${group}`} viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.2 6.4L21 11l-6.8 2.6L12 20l-2.2-6.4L3 11l6.8-2.6L12 2Z" /><path d="M17.5 3.5v4M15.5 5.5h4" /></svg>;
  return <svg className={`category-icon category-icon--${group}`} viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="15" rx="1.5" /><path d="M3 8h18M7 12h3M7 15h7M17 12h1" /></svg>;
}

function FeaturedSealMark() {
  return <svg className="featured-seal-mark" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5 16.5 5v10L10 18.5 3.5 15V5L10 1.5Z" /><path d="M6.8 10h6.4M10 6.8v6.4" /><circle cx="10" cy="10" r="1.2" /></svg>;
}

function ArchitecturePanel({ slug, language }: { slug: keyof typeof studies; language: Language }) {
  const isMobile = slug === "skybound-knight-play";
  const isSchedule = slug === "MK-_schedule";
  const labels = language === "zh" ? { eyebrow: "公开系统图", title: "构建路径", input: "浏览器界面", core: isMobile ? "游戏循环" : isSchedule ? "TypeScript 日程逻辑" : "JSP / JSTL 仪表盘", runtime: isMobile ? "Android 交付路径" : isSchedule ? "静态网页部署" : "Tomcat 11 运行时", output: isMobile ? "响应式游玩体验" : isSchedule ? "工作日导航" : "库存管理工作流", note: "基于项目公开源码与已部署界面整理。" } : { eyebrow: "Public system map", title: "Build path", input: "Browser interface", core: isMobile ? "Game loop" : isSchedule ? "TypeScript schedule logic" : "JSP / JSTL dashboard", runtime: isMobile ? "Android delivery path" : isSchedule ? "Static web deployment" : "Tomcat 11 runtime", output: isMobile ? "Responsive play experience" : isSchedule ? "Weekday navigation" : "Inventory management flow", note: "Mapped from the project’s public source and deployed interface." };
  return <section className="case-architecture" aria-labelledby="architecture-title"><div className="case-architecture-head"><p>{labels.eyebrow}</p><h2 id="architecture-title">{labels.title}</h2><small>{labels.note}</small></div><div className="architecture-flow"><article><span>01</span><b>{labels.input}</b></article><i aria-hidden="true"><ArrowRight size={17} /></i><article><span>02</span><b>{labels.core}</b></article><i aria-hidden="true"><ArrowRight size={17} /></i><article><span>03</span><b>{labels.runtime}</b></article><i aria-hidden="true"><ArrowRight size={17} /></i><article><span>04</span><b>{labels.output}</b></article></div></section>;
}

function FlagshipNarrative({ language }: { language: Language }) {
  const t = language === "zh" ? {
    eyebrow: "旗舰案例记录", title: "Skybound Knight 的构建重点", briefLabel: "项目目标", brief: "将无尽平台跳跃的核心循环带入浏览器，并保持移动端交付的可能性。", constraintsLabel: "关键限制", constraints: "需要兼顾不同屏幕下的可玩性、轻量的浏览器呈现，以及公开项目说明中记录的 Android APK 路径。", interactionLabel: "核心交互", interaction: "玩家在响应式界面中进入持续的平台跳跃循环；公开在线版本用于直接体验，仓库用于查阅实现记录。", evidenceLabel: "可验证结果", evidence: "公开部署、公开源码，以及 Android APK 支持说明共同构成可审阅的交付证据。", source: "所有叙述仅基于公开项目说明、仓库和在线版本；未声明未验证的性能或商业数据。"
  } : {
    eyebrow: "Flagship build record", title: "Skybound Knight, in focus", briefLabel: "Brief", brief: "Bring an endless platforming loop to the browser while retaining a credible path to mobile delivery.", constraintsLabel: "Constraints", constraints: "The build needed to stay playable across screen sizes, remain legible as a lightweight browser experience, and preserve the Android APK path documented in the public project description.", interactionLabel: "Key interaction", interaction: "Players enter a continuous platforming loop through a responsive interface; the live build supports direct exploration and the repository supports technical review.", evidenceLabel: "Verifiable result", evidence: "The public deployment, source repository, and documented Android APK support form a reviewable delivery record.", source: "This narrative is limited to public project evidence; it makes no unverified performance or commercial claims."
  };
  return <section className="flagship-narrative" aria-labelledby="flagship-narrative-title"><header><p>{t.eyebrow}</p><h2 id="flagship-narrative-title">{t.title}</h2></header><div><article><span>01</span><b>{t.briefLabel}</b><p>{t.brief}</p></article><article><span>02</span><b>{t.constraintsLabel}</b><p>{t.constraints}</p></article><article><span>03</span><b>{t.interactionLabel}</b><p>{t.interaction}</p></article><article><span>04</span><b>{t.evidenceLabel}</b><p>{t.evidence}</p></article></div><small>{t.source}</small></section>;
}

function CaseStudyGallery({ currentSlug, language, onNavigate }: { currentSlug: keyof typeof studies; language: Language; onNavigate: Navigate }) {
  const [filter, setFilter] = useState<StudyFilter>("all");
  const [toolFilter, setToolFilter] = useState<string | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [pauseCarousel, setPauseCarousel] = useState(false);
  const labels = language === "zh" ? { eyebrow: "更多公开案例", title: "继续探索构建记录", featured: "精选轮播", all: "全部", web: "网页系统", mobile: "移动端与游戏", open: "打开案例", current: "当前案例", tools: "按技术筛选", next: "下一项" } : { eyebrow: "More public case studies", title: "Continue through the build record", featured: "Featured rotation", all: "All", web: "Web systems", mobile: "Mobile & play", open: "Open case study", current: "Current study", tools: "Filter by tool", next: "Next build" };
  const filterLabels: Record<StudyFilter, string> = { all: labels.all, web: labels.web, mobile: labels.mobile };
  const entries = Object.entries(studies) as StudyEntry[];
  const allTools = Array.from(new Set(entries.flatMap(([, study]) => [...study.tags])));
  const featured = entries[featuredIndex];
  const visible = entries.filter(([, study]) => (filter === "all" || study.group === filter) && (!toolFilter || study.tags.includes(toolFilter as never)));
  const pathFor = (slug: keyof typeof studies) => `${language === "zh" ? "/zh" : ""}/case-studies/${slug}`;
  const selectTool = (tool: string) => { trackPortfolioEvent("case_tool_filter_selected", { tool, language, current_study: currentSlug }); setToolFilter((current) => current === tool ? null : tool); };
  const selectFilter = (nextFilter: StudyFilter) => { trackPortfolioEvent("case_gallery_filter_selected", { filter: nextFilter, language, current_study: currentSlug }); setFilter(nextFilter); };
  const selectFeatured = (index: number, action: string) => { trackPortfolioEvent("featured_carousel_interacted", { action, index: index + 1, language, current_study: currentSlug }); setFeaturedIndex(index); };
  useEffect(() => { if (pauseCarousel) return; const timer = window.setInterval(() => setFeaturedIndex((index) => (index + 1) % entries.length), 5200); return () => window.clearInterval(timer); }, [entries.length, pauseCarousel]);
  return <section className="case-gallery" aria-labelledby="case-gallery-title">
    <div className={`case-featured-rotator ${pauseCarousel ? "is-paused" : ""}`} onMouseEnter={() => setPauseCarousel(true)} onMouseLeave={() => setPauseCarousel(false)} onFocus={() => setPauseCarousel(true)} onBlur={() => setPauseCarousel(false)}>
      <AnimatePresence mode="sync" initial={false}><motion.a key={featured[0]} className="case-featured" href={pathFor(featured[0])} onClick={featured[0] === currentSlug ? (event) => event.preventDefault() : onNavigate(pathFor(featured[0]))} initial={{ opacity: 0, x: 22, scale: .985 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -14, scale: 1.008 }} transition={{ duration: .62, ease: [0.22, 0.76, 0.16, 1] }}><img src={featured[1].image} alt={`${featured[1][language].title} ${language === "zh" ? "项目预览" : "project preview"}`} loading="lazy" decoding="async" /><span className="case-featured-veil" aria-hidden="true" /><div><small><CategoryIcon group={featured[1].group} />{labels.featured} · {featuredIndex + 1} / {entries.length}</small><h2>{featured[1][language].title}</h2><p>{featured[1][language].lead}</p><ul>{featured[1].tags.map((tag) => <li key={tag}>{tag}</li>)}</ul><b>{featured[0] === currentSlug ? labels.current : labels.open}<ArrowUpRight size={15} /></b></div></motion.a></AnimatePresence>
      <span key={featured[0]} className="featured-progress" aria-hidden="true" />
      <button className="featured-next" type="button" onClick={() => selectFeatured((featuredIndex + 1) % entries.length, "next")} aria-label={labels.next}><ArrowRight size={17} /></button>
      <div className="featured-dots" aria-label={labels.featured}>{entries.map(([slug], index) => <button type="button" key={slug} className={index === featuredIndex ? "is-active" : ""} onClick={() => selectFeatured(index, "dot")} aria-label={`${labels.featured} ${index + 1}`} />)}</div>
    </div>
    <div className="case-gallery-head"><div><p>{labels.eyebrow}</p><h2 id="case-gallery-title">{labels.title}</h2></div><div className="case-gallery-filters" role="group" aria-label={labels.title}>{(["all", "web", "mobile"] as StudyFilter[]).map((item) => <button key={item} type="button" onClick={() => selectFilter(item)} aria-pressed={filter === item} className={`case-gallery-filter case-gallery-filter--${item} ${filter === item ? "is-active" : ""}`}>{filterLabels[item]}</button>)}</div></div>
    <div className="case-tool-filter" role="group" aria-label={labels.tools}><span>{labels.tools}</span>{allTools.map((tool) => <button type="button" key={tool} onClick={() => selectTool(tool)} aria-pressed={toolFilter === tool} className={toolFilter === tool ? "is-active" : ""}>{tool}</button>)}</div>
    <AnimatePresence mode="wait"><motion.div key={`${filter}-${toolFilter ?? "all"}`} className="case-gallery-grid" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .24, ease: [0.16, 1, 0.3, 1] }}>{visible.map(([slug, study]) => { const content = study[language]; const path = pathFor(slug); const current = slug === currentSlug; return <article key={slug} className={`case-gallery-card case-gallery-card--${study.group} ${current ? "is-current" : ""}`}><a className="case-gallery-card-main" href={path} onClick={current ? (event) => event.preventDefault() : onNavigate(path)} aria-current={current ? "page" : undefined}><img src={study.image} alt={`${content.title} ${language === "zh" ? "项目预览" : "project preview"}`} loading="lazy" decoding="async" /><span className="case-gallery-card-veil" aria-hidden="true" /><div className="case-gallery-card-copy"><small><CategoryIcon group={study.group} />{study.category}</small><h3>{content.title}</h3><b>{current ? labels.current : labels.open}<ArrowUpRight size={14} /></b></div></a><div className="case-gallery-card-tags">{study.tags.map((tag) => <button type="button" key={tag} onClick={() => selectTool(tag)} className={toolFilter === tag ? "is-active" : ""}>{tag}</button>)}</div></article>; })}</motion.div></AnimatePresence>
  </section>;
}

function ShareControls({ title, language }: { title: string; language: Language }) {
  const [copied, setCopied] = useState(false); const url = typeof window === "undefined" ? "" : window.location.href; const shareText = language === "zh" ? `查看 ${title} 的构建案例` : `Explore the ${title} case study`; const labels = language === "zh" ? { title: "分享案例", native: "分享", copy: "复制链接", copied: "已复制", linkedin: "LinkedIn", x: "X" } : { title: "Share this study", native: "Share", copy: "Copy link", copied: "Copied", linkedin: "LinkedIn", x: "X" }; const copyLink = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } }; const nativeShare = async () => { if (navigator.share) { try { await navigator.share({ title, text: shareText, url }); } catch { /* visitor dismissed share sheet */ } return; } await copyLink(); };
  return <aside className="case-share" aria-label={labels.title}><span>{labels.title}</span><div><button type="button" onClick={nativeShare}><Share2 size={15} />{labels.native}</button><button type="button" onClick={copyLink}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? labels.copied : labels.copy}</button><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">{labels.linkedin}<ArrowUpRight size={14} /></a><a href={`https://x.com/intent/post?text=${encodeURIComponent(`${shareText} ${url}`)}`} target="_blank" rel="noreferrer">{labels.x}<ArrowUpRight size={14} /></a></div></aside>;
}

export default function CaseStudy() {
  const [location] = useLocation(); const [readingMode, setReadingMode] = useState<ReadingMode>("recruiter"); const language: Language = location.startsWith("/zh/") ? "zh" : "en"; const slug = location.split("/").filter(Boolean).at(-1) as keyof typeof studies; const study = studies[slug]; const homePath = language === "zh" ? "/zh" : "/"; const navigate: Navigate = (target) => (event) => { event.preventDefault(); triggerAtmosphereCue("blade"); trackPortfolioEvent("route_ritual_started", { target, language, source: slug }); requestRouteRitual(target, { mark: `CASE / ${slug}`, language }); };
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [showSwipeTip, setShowSwipeTip] = useState(false);
  const setMode = (mode: ReadingMode, source: "tap" | "swipe") => { if (mode === readingMode) return; if (source === "swipe" && !prefersReducedMotion && "vibrate" in navigator) navigator.vibrate(10); trackPortfolioEvent("case_reading_mode_selected", { mode, slug, language, source }); triggerAtmosphereCue("signal"); setReadingMode(mode); };
  useEffect(() => { if (prefersReducedMotion || !window.matchMedia("(max-width:760px)").matches || window.localStorage.getItem("mk-case-swipe-tip-seen")) return; setShowSwipeTip(true); const timer = window.setTimeout(() => { setShowSwipeTip(false); window.localStorage.setItem("mk-case-swipe-tip-seen", "1"); }, 4200); return () => window.clearTimeout(timer); }, [prefersReducedMotion]);
  const handleTouchStart = (event: TouchEvent<HTMLElement>) => { const touch = event.touches[0]; if (touch) touchStartRef.current = { x: touch.clientX, y: touch.clientY }; };
  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => { const start = touchStartRef.current; const touch = event.changedTouches[0]; touchStartRef.current = null; if (!start || !touch) return; const deltaX = touch.clientX - start.x; const deltaY = touch.clientY - start.y; if (Math.abs(deltaX) < 56 || Math.abs(deltaX) < Math.abs(deltaY) * 1.35) return; const currentIndex = readingModes.indexOf(readingMode); const nextIndex = deltaX < 0 ? Math.min(readingModes.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1); setMode(readingModes[nextIndex], "swipe"); };
  useEffect(() => {
    if (!study) return;
    const content = study[language];
    const title = `${content.title} — MK Case Study`;
    const description = `${content.lead} ${language === "zh" ? "查看 SereyMongkul／天毅的公开项目记录。" : "Explore SereyMongkul / 天毅’s public project record."}`;
    applyPortfolioSeo({ path: location, title, description, image: study.image, imageAlt: `${content.title} ${language === "zh" ? "项目预览" : "project preview"}`, type: "article", structuredData: { "@context": "https://schema.org", "@type": "CreativeWork", name: content.title, description, image: study.image, inLanguage: language === "zh" ? "zh-CN" : "en", author: { "@type": "Person", name: "SereyMongkul", alternateName: ["Jack", "天毅"] }, codeRepository: study.source, url: study.live, keywords: study.tags.join(", ") } });
    trackPortfolioEvent("case_study_opened", { slug, language });
  }, [language, location, slug, study]);
  if (!study) return <main className="case-study-page"><a href={homePath} onClick={navigate(homePath)}>← {language === "zh" ? "返回作品集" : "Back to portfolio"}</a></main>;
  const content = study[language];
  const chamberMeta = language === "zh" ? { record: "项目档案 / CASE RECORD", reveal: "秘藏记录已展开", exit: "路径继续 / RETURN TO ORIGIN" } : { record: "项目档案 / CASE RECORD", reveal: "Reliquary record revealed", exit: "路径继续 / RETURN TO ORIGIN" };
  const modeLabels = language === "zh" ? { title: "阅读方式", recruiter: "招聘摘要", visual: "视觉记录", technical: "技术记录" } : { title: "Reading mode", recruiter: "Recruiter", visual: "Visual", technical: "Technical" };
  return <motion.main onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className={`case-study-page case-study-page--${study.group} case-study-page--mode-${readingMode}`} data-reading-mode={readingMode} lang={language === "zh" ? "zh-CN" : "en"} initial={{ opacity: 0, scale: 1.012, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .36, ease: [0.16, 1, 0.3, 1] }}>
    <div className="route-blade-rail" aria-hidden="true"><i /><span>03 / 08</span></div>
    <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .28, delay: .04 }}><a className="case-back" href={`${homePath}#work`} onClick={navigate(`${homePath}#work`)}><ArrowLeft size={16} />{language === "zh" ? "返回公开代码库" : "Back to public code"}</a><span className="case-route-mark"><BladeMark /><small>MK / CASE STUDY</small></span></motion.header>
    <div className="case-chamber-index" aria-label={chamberMeta.record}><span>03 / 08</span><i aria-hidden="true" /><b>{chamberMeta.record}</b><small>{chamberMeta.reveal}</small><em aria-hidden="true"><u /><u /></em></div>
    <div className="case-reading-switch" role="tablist" aria-label={modeLabels.title}>{readingModes.map((mode) => <button key={mode} type="button" role="tab" aria-selected={readingMode === mode} className={readingMode === mode ? "is-active" : ""} onClick={() => setMode(mode, "tap")}>{modeLabels[mode]}</button>)}</div><p className="case-reading-swipe-hint" aria-live="polite">{language === "zh" ? "在案例记录上向左或向右滑动以切换阅读方式。" : "Swipe left or right on this case record to change reading mode."}</p>{showSwipeTip && <motion.div className="case-reading-tooltip" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><span>{language === "zh" ? "向左或向右滑动，切换阅读方式" : "Swipe left or right to change reading mode"}</span><button type="button" onClick={() => { setShowSwipeTip(false); window.localStorage.setItem("mk-case-swipe-tip-seen", "1"); }}>{language === "zh" ? "关闭" : "Close"}</button></motion.div>}
    <section className="case-hero"><motion.div initial={{ opacity: 0, y: 17 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .38, delay: .05, ease: [0.16, 1, 0.3, 1] }}><p className="case-category-label"><CategoryIcon group={study.group} />{study.category}</p><h1>{content.title}</h1><p className="case-lead">{content.lead}</p><div className="case-actions"><a href={study.source} target="_blank" rel="noreferrer">{language === "zh" ? "查看源码" : "View source"}<Github size={16} /></a><a href={study.live} target="_blank" rel="noreferrer">{language === "zh" ? "打开在线版本" : "Open live build"}<ArrowUpRight size={16} /></a></div></motion.div><motion.figure initial={{ opacity: 0, scale: .975, x: 16 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: .42, delay: .07, ease: [0.16, 1, 0.3, 1] }}><img src={study.image} alt={`${content.title} ${language === "zh" ? "项目预览" : "project preview"}`} decoding="async" /></motion.figure></section>
    <section className="case-record">{content.sections.map((section, index) => <motion.article key={section.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, delay: .14 + index * .06, ease: [0.16, 1, 0.3, 1] }}><span>{section.title}</span>{"text" in section && <p>{section.text}</p>}{"items" in section && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</motion.article>)}</section>
    {slug === "skybound-knight-play" && <FlagshipNarrative language={language} />}
    <ArchitecturePanel slug={slug} language={language} />
    <ShareControls title={content.title} language={language} />
    <CaseStudyGallery currentSlug={slug} language={language} onNavigate={navigate} />
    <nav className="case-reading-progress" aria-label={modeLabels.title}>{readingModes.map((mode, index) => <button key={mode} type="button" className={readingMode === mode ? "is-active" : ""} aria-current={readingMode === mode ? "step" : undefined} onClick={() => setMode(mode, "tap")}><span>{String(index + 1).padStart(2, "0")}</span>{modeLabels[mode]}</button>)}</nav>
    <motion.footer className="case-ritual-exit" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, delay: .34 }}><span>{chamberMeta.exit}</span><a href={`${homePath}#contact`} onClick={navigate(`${homePath}#contact`)}>{language === "zh" ? "开始项目对话" : "Start a project conversation"}<ArrowUpRight size={16} /></a></motion.footer>
  </motion.main>;
}
