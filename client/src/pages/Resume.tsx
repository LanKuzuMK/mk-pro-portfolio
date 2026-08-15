/**
 * Crimson Reliquary résumé reminder: a fast, plain archival reading mode with no ambient effects.
 */
import { ArrowLeft, ArrowUpRight, Github, Printer, Send } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { applyPortfolioSeo } from "@/lib/seo";
import BladeMark from "@/components/BladeMark";

type Language = "en" | "zh";

const CONTACT = {
  email: "lku199776@gmail.com",
  github: "https://github.com/LanKuzuMK",
  telegram: "https://t.me/TianyiXiong",
};

const content = {
  en: {
    eyebrow: "Recruiter / client résumé",
    title: "SereyMongkul · Jack",
    role: "Developer & Creative Technologist",
    summary: "I build focused web systems, interactive browser experiences, mobile-ready products, and experimental interfaces with a practical delivery mindset.",
    availability: "Available for selected freelance and creative-technology collaborations. Asia/Phnom_Penh timezone. Best fit: focused prototypes, portfolio sites, interface systems, and small-to-medium product work. Typical reply: 1–2 business days.",
    sections: [
      { title: "Core capabilities", items: ["Web systems — React, TypeScript, JavaScript, Node.js", "Interactive 3D — Three.js, WebGL, motion systems", "Mobile & play — Flutter, Dart, Android, Java", "Experiment & craft — HTML/CSS, computer vision, Git workflows"] },
      { title: "Selected public work", items: ["E-Commerce Inventory Dashboard — JSP/JSTL dashboard, Tomcat target, Docker delivery", "MK Schedule — TypeScript browser schedule interface with deployed public build", "Skybound Knight — responsive browser platformer with documented Android APK support", "Anonymous Encrypted Chat — TypeScript prototype with WebSocket and Web Crypto documentation"] },
      { title: "Working approach", items: ["Translate a clear problem into a readable interface and reliable build path", "Pair visual motion with accessible, responsive interaction", "Use public evidence and direct communication to keep project scope grounded"] },
    ],
    back: "Back to portfolio",
    print: "Print / Save PDF",
    contact: "Open a conversation",
    identity: "Verify public work on GitHub",
    language: "中文 résumé",
  },
  zh: {
    eyebrow: "招聘方 / 客户简历",
    title: "SereyMongkul · Jack · 天毅",
    role: "开发者与创意技术家",
    summary: "我构建聚焦的网页系统、互动式浏览器体验、面向移动端的产品，以及兼顾实际交付的实验性界面。",
    availability: "目前开放筛选后的自由职业与创意技术合作。工作时区为 Asia/Phnom_Penh；更适合目标明确的原型、作品集网站、界面系统及中小型产品工作。通常在 1–2 个工作日内回复。",
    sections: [
      { title: "核心能力", items: ["网页系统 — React、TypeScript、JavaScript、Node.js", "互动 3D — Three.js、WebGL、动效系统", "移动端与游戏 — Flutter、Dart、Android、Java", "实验与工程实践 — HTML/CSS、计算机视觉、Git 工作流"] },
      { title: "精选公开作品", items: ["电商库存管理仪表盘 — JSP/JSTL 仪表盘、Tomcat 运行目标与 Docker 交付", "MK Schedule — 带已部署公开版本的 TypeScript 日程界面", "Skybound Knight — 支持响应式浏览器游玩，并记录 Android APK 支持的平台游戏", "Anonymous Encrypted Chat — 使用 WebSocket 与 Web Crypto 文档的 TypeScript 原型"] },
      { title: "工作方式", items: ["将清晰的问题转化为易读的界面与可靠的构建路径", "让视觉运动服务于可访问、响应式的交互", "以公开依据和直接沟通保持项目范围清晰"] },
    ],
    back: "返回作品集",
    print: "打印 / 保存 PDF",
    contact: "开启项目对话",
    identity: "在 GitHub 验证公开作品",
    language: "English résumé",
  },
};

export default function Resume() {
  const [location, setLocation] = useLocation();
  const language: Language = location.startsWith("/zh") ? "zh" : "en";
  const t = content[language];
  const home = language === "zh" ? "/zh" : "/";
  const alternateResume = language === "zh" ? "/resume" : "/zh/resume";

  useEffect(() => {
    applyPortfolioSeo({
      path: location,
      title: `${t.title} — ${t.role} | Résumé`,
      description: t.summary,
      image: "https://pub-cb5d9686e840460095ffee04d891cbfe.r2.dev/assets/mk-hero-art-no-stars.png",
      imageAlt: "MK Crimson Reliquary portfolio artwork",
      type: "profile",
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "SereyMongkul",
        alternateName: ["Jack", "天毅"],
        jobTitle: "Developer & Creative Technologist",
        email: CONTACT.email,
        sameAs: [CONTACT.github, CONTACT.telegram],
        knowsAbout: ["Web development", "TypeScript", "React", "Three.js", "Flutter", "Android", "Creative technology"],
      },
    });
  }, [location, t]);

  return <main className="recruiter-resume" lang={language === "zh" ? "zh-CN" : "en"}>
    <div className="resume-blade-rail" aria-hidden="true"><i /><span>07 / 08</span></div>
    <header className="recruiter-resume-header">
      <button type="button" onClick={() => setLocation(home)}><ArrowLeft size={16} />{t.back}</button>
      <div><span className="resume-route-mark"><BladeMark />MK / CV</span><button type="button" onClick={() => setLocation(alternateResume)}>{t.language}<ArrowUpRight size={14} /></button></div>
    </header>
    <article className="recruiter-resume-sheet">
      <section className="recruiter-resume-intro">
        <BladeMark className="resume-sheet-mark" />
        <p>{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <h2>{t.role}</h2>
        <div className="resume-availability"><i aria-hidden="true" /><p>{t.availability}</p></div>
        <p className="recruiter-summary">{t.summary}</p>
      </section>
      <section className="recruiter-resume-details">
        {t.sections.map((section) => <section key={section.title}><h3>{section.title}</h3><ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}
      </section>
      <footer className="recruiter-resume-contact">
        <div><span>CONTACT</span><a href={`mailto:${CONTACT.email}`}><Send size={15} />{CONTACT.email}</a><a href={CONTACT.github} target="_blank" rel="noreferrer"><Github size={15} />LanKuzuMK</a></div>
        <div className="recruiter-resume-actions"><button type="button" onClick={() => window.print()}><Printer size={15} />{t.print}</button><a href={`${home}#contact`} onClick={(event) => { event.preventDefault(); setLocation(`${home}#contact`); }}>{t.contact}<ArrowUpRight size={15} /></a><a href={CONTACT.github} target="_blank" rel="noreferrer">{t.identity}<ArrowUpRight size={15} /></a></div>
      </footer>
    </article>
  </main>;
}
