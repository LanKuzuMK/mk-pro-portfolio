/**
 * Crimson Reliquary style reminder: this page reveals the MK identity as a working creative-technology system, not a generic brand board.
 */
import { ArrowLeft, ArrowUpRight, Check, MoveRight } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import BladeMark from "@/components/BladeMark";
import { applyPortfolioSeo } from "@/lib/seo";
import { requestRouteRitual, triggerAtmosphereCue } from "@/lib/ritual";

type Language = "en" | "zh";

const content = {
  en: {
    eyebrow: "MK / PERSONAL SIGNATURE", title: "A system for\nideas that move.", lead: "MK is a personal creative-technology signature: a blade-derived mark, a controlled signal color, and an editorial interaction language built to give software a point of view.", back: "Back to portfolio", language: "中文签名", record: "IDENTITY RECORD / 08", revealed: "The maker’s system, revealed", chapters: ["The mark", "The signal", "The voice", "The motion", "The principle"],
    markTitle: "The mark is\na direction, not decoration.", markBody: "Two vertical cuts and one sealed-vermilion diagonal form an M/K blade monogram. It appears at points of entry, movement, and return—so the visual identity also helps a visitor navigate.", markNotes: ["Two uprights — discipline and structure", "Diagonal cut — momentum and choice", "Open endpoint — the next build is always possible"],
    signalTitle: "Color carries\na job.", signalBody: "The palette uses emotional contrast, not visual noise. Every material has a role in the reading experience.", colors: [{ name: "Sealed Vermilion", code: "#D82B36", use: "Activation · routes · decisive actions" }, { name: "Bone Reveal", code: "#F5EEE8", use: "Reading · evidence · revealed records" }, { name: "Reliquary Charcoal", code: "#0C090A", use: "Depth · focus · cinematic pause" }, { name: "Archival Champagne", code: "#E4C494", use: "Craft · metadata · signature detail" }],
    voiceTitle: "A bilingual\neditorial instrument.", voiceBody: "Bodoni carries ceremonial statements. Manrope keeps technical proof legible. Noto Serif SC gives Chinese narrative passages their own intentional rhythm rather than treating translation as an afterthought.", typeLabels: ["Display / declaration", "Body / technical proof", "中文 / narrative layer"],
    motionTitle: "Motion should\nreveal an action.", motionBody: "The system uses movement only when it gives feedback, reveals a new chamber, or guides reading depth. It never asks visitors to wait for decoration.", motionRules: ["A blade path precedes a route change", "Cards respond to intent, not constant animation", "Every rich interaction has a static reduced-motion state"],
    principleTitle: "Build the idea.\nThen give it weight.", principleBody: "The signature is valuable only when it supports real work: an understandable interface, a credible build path, and a digital experience people can actually use.", work: "View selected work", contact: "Open a conversation", footer: "MK / A personal system in active practice.",
  },
  zh: {
    eyebrow: "MK / 个人签名系统", title: "让想法\n真正动起来的系统。", lead: "MK 是一套个人创意技术签名：源自剑刃的标记、克制的信号色，以及为软件赋予明确观点的编辑式交互语言。", back: "返回作品集", language: "English signature", record: "身份档案 / 08", revealed: "构建者的系统，已展开", chapters: ["标记", "信号", "声音", "动态", "原则"],
    markTitle: "标记是一种方向，\n不是装饰。", markBody: "两道竖直切线与一道封印朱红斜线构成 M/K 剑刃徽记。它出现在入口、移动与返回之处，让视觉身份同时成为访客的导航线索。", markNotes: ["两道竖线——纪律与结构", "斜向切线——动势与选择", "开放的终点——下一次构建永远可能"],
    signalTitle: "每一种颜色\n都有职责。", signalBody: "配色依靠情绪对比，而非视觉噪音。每种材料在阅读体验中都承担明确角色。", colors: [{ name: "封印朱红", code: "#D82B36", use: "激活 · 路径 · 决定性行动" }, { name: "骨白显现", code: "#F5EEE8", use: "阅读 · 证据 · 展开的记录" }, { name: "秘藏炭黑", code: "#0C090A", use: "纵深 · 聚焦 · 电影式停顿" }, { name: "档案香槟金", code: "#E4C494", use: "工艺 · 元数据 · 签名细节" }],
    voiceTitle: "一套双语的\n编辑式工具。", voiceBody: "Bodoni 承载仪式感的宣言，Manrope 保持技术证据的可读性，Noto Serif SC 则让中文叙事拥有自身的节奏，而非被当作事后的翻译。", typeLabels: ["显示文字 / 宣言", "正文 / 技术依据", "中文 / 叙事层"],
    motionTitle: "动态应当\n揭示行动。", motionBody: "这套系统仅在需要给出反馈、展开新空间或引导阅读深度时使用运动，不要求访客为装饰而等待。", motionRules: ["剑刃路径先于路由切换出现", "卡片回应意图，而非持续播放动画", "每个丰富交互都具备静态的减弱动态状态"],
    principleTitle: "构建想法。\n赋予它重量。", principleBody: "签名系统只有服务于真实工作才有价值：易懂的界面、可信的构建路径，以及人们能够真正使用的数字体验。", work: "查看精选作品", contact: "开启项目对话", footer: "MK / 一套持续实践中的个人系统。",
  },
} as const;

export default function PersonalSignature() {
  const [location] = useLocation();
  const language: Language = location.startsWith("/zh") ? "zh" : "en";
  const t = content[language];
  const home = language === "zh" ? "/zh" : "/";
  const alternate = language === "zh" ? "/signature" : "/zh/signature";
  const navigate = (target: string, mark: string) => { triggerAtmosphereCue("blade"); requestRouteRitual(target, { mark, language }); };
  const timeline = language === "zh" ? { title: "身份如何逐步成形。", body: "以下节点仅来自公开项目与已验证的作品记录。", items: [{ year: "2025", title: "从公开项目开始", detail: "以电商库存仪表盘建立实用的网页系统记录。", source: "e-commerce-inventory-dashboard / public repository" }, { year: "2026", title: "把交互放进动势", detail: "通过 MK Schedule 与 Skybound Knight 继续研究响应式界面与可玩循环。", source: "MK-_schedule · skybound-knight-play / public repositories" }, { year: "2026", title: "形成 MK 视觉系统", detail: "将公开构建经验收束为剑刃标记、双语编辑层与可访问的动态规则。", source: "MK Personal Signature / current portfolio" }] } : { title: "How the identity took shape.", body: "These milestones are limited to public projects and verified portfolio records.", items: [{ year: "2025", title: "Starting with public builds", detail: "A practical web-system record began with the e-commerce inventory dashboard.", source: "e-commerce-inventory-dashboard / public repository" }, { year: "2026", title: "Putting interaction into motion", detail: "MK Schedule and Skybound Knight extended the study into responsive interfaces and playable loops.", source: "MK-_schedule · skybound-knight-play / public repositories" }, { year: "2026", title: "Forming the MK visual system", detail: "Public build practice became a blade mark, bilingual editorial layer, and accessible motion language.", source: "MK Personal Signature / current portfolio" }] };

  useEffect(() => { applyPortfolioSeo({ path: location, title: language === "zh" ? "MK — 个人签名系统" : "MK — Personal Signature", description: t.lead, image: "https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/mk-hero-art-no-stars.png", imageAlt: language === "zh" ? "MK 个人签名系统的赤红剑客视觉" : "MK personal signature crimson swordsman artwork", type: "profile", structuredData: { "@context": "https://schema.org", "@type": "CreativeWork", name: language === "zh" ? "MK 个人签名系统" : "MK Personal Signature", description: t.lead, author: { "@type": "Person", name: "SereyMongkul", alternateName: ["Jack", "天毅"] }, inLanguage: language === "zh" ? "zh-CN" : "en", keywords: "creative technology, visual identity, interaction design, MK" } }); }, [language, location, t.lead]);

  return <main className="signature-page" lang={language === "zh" ? "zh-CN" : "en"}>
    <div className="signature-blade-rail" aria-hidden="true"><i /><span>08 / 08</span></div>
    <header className="signature-header"><button type="button" onClick={() => navigate(home, "MK / ORIGIN")}><ArrowLeft size={16} />{t.back}</button><div><span><BladeMark />MK / SIGNATURE</span><button type="button" onClick={() => navigate(alternate, "MK / LANGUAGE")}>{t.language}<ArrowUpRight size={14} /></button></div></header>
    <section className="signature-hero"><div className="signature-record"><span>{t.record}</span><i aria-hidden="true" /><small>{t.revealed}</small></div><div className="signature-hero-copy"><p>{t.eyebrow}</p><h1>{t.title}</h1><p>{t.lead}</p></div><div className="signature-mark-specimen"><div className="signature-mark-frame"><BladeMark /><i aria-hidden="true" /><i aria-hidden="true" /></div><span>MK / 01</span><small>标记 / MARK</small></div></section>
    <section className="signature-chapter signature-chapter--mark"><div className="signature-index"><span>01</span><b>{t.chapters[0]}</b></div><div><h2>{t.markTitle}</h2><p>{t.markBody}</p></div><ul>{t.markNotes.map((note) => <li key={note}><Check size={14} />{note}</li>)}</ul></section>
    <section className="signature-chapter signature-chapter--signal"><div className="signature-index"><span>02</span><b>{t.chapters[1]}</b></div><div><h2>{t.signalTitle}</h2><p>{t.signalBody}</p></div><div className="signature-color-grid">{t.colors.map((color, index) => <article key={color.code}><i className={`signature-swatch signature-swatch--${index + 1}`} /><span>{color.code}</span><h3>{color.name}</h3><p>{color.use}</p></article>)}</div></section>
    <section className="signature-chapter signature-chapter--voice"><div className="signature-index"><span>03</span><b>{t.chapters[2]}</b></div><div><h2>{t.voiceTitle}</h2><p>{t.voiceBody}</p></div><div className="signature-type-specimen"><article><span>{t.typeLabels[0]}</span><strong>Forge the idea.</strong></article><article><span>{t.typeLabels[1]}</span><p>Readable systems earn trust through clear structure, careful detail, and a reliable path forward.</p></article><article><span>{t.typeLabels[2]}</span><strong className="signature-zh-type">让想法有方向，也有重量。</strong></article></div></section>
    <section className="signature-chapter signature-chapter--motion"><div className="signature-index"><span>04</span><b>{t.chapters[3]}</b></div><div><h2>{t.motionTitle}</h2><p>{t.motionBody}</p></div><div className="signature-motion-rules">{t.motionRules.map((rule, index) => <article key={rule}><span>0{index + 1}</span><i aria-hidden="true"><MoveRight size={16} /></i><p>{rule}</p></article>)}</div></section>
    <section className="signature-chapter signature-chapter--timeline"><div className="signature-index"><span>05</span><b>{language === "zh" ? "时间线" : "Timeline"}</b></div><div><h2>{timeline.title}</h2><p>{timeline.body}</p></div><div className="signature-timeline">{timeline.items.map((item) => <article key={`-`}><span>{item.year}</span><div><h3>{item.title}</h3><p>{item.detail}</p><small>{item.source}</small></div></article>)}</div></section>
    <section className="signature-principle"><div><span>05 / {t.chapters[4]}</span><h2>{t.principleTitle}</h2><p>{t.principleBody}</p></div><div className="signature-principle-actions"><button type="button" onClick={() => navigate(`${home}#work`, "MK / WORK")}>{t.work}<ArrowUpRight size={17} /></button><button type="button" onClick={() => navigate(`${home}#contact`, "MK / SIGNAL")}>{t.contact}<ArrowUpRight size={17} /></button></div><BladeMark className="signature-principle-mark" /></section>
    <footer className="signature-footer"><span>{t.footer}</span><small>MK / 2026</small></footer>
  </main>;
}
