/**
 * Crimson Reliquary style reminder: command navigation is an immediate, searchable index into the build archive.
 */
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command";
import { BookOpen, Command, FileText, Search, SlidersHorizontal, CircleDashed } from "lucide-react";
import { useEffect, useState } from "react";

type MotionPreference = "full" | "reduced" | "low-power";
type CommandProject = { id: string; title: string; target: string };

export default function PortfolioCommand({ language, motionPreference, onMotionChange, onArchive, onNavigate, projects }: { language: "en" | "zh"; motionPreference: MotionPreference; onMotionChange: (value: MotionPreference) => void; onArchive: () => void; onNavigate: (target: string, mark?: string) => void; projects: CommandProject[] }) {
  const [open, setOpen] = useState(false);
  const labels = language === "zh" ? { title: "MK 命令路径", description: "搜索项目、路径和界面设置。", input: "搜索命令或项目…", empty: "没有匹配的命令。", paths: "路径", settings: "体验设置", archive: "搜索公开代码", resume: "打开招聘简历", full: "完整动态", reduced: "减少动态", low: "低功耗", project: "项目记录" } : { title: "MK command path", description: "Search projects, paths, and interface settings.", input: "Search a command or build…", empty: "No command found.", paths: "Paths", settings: "Experience settings", archive: "Search public code", resume: "Open recruiter résumé", full: "Full motion", reduced: "Reduced motion", low: "Low power", project: "Project records" };
  useEffect(() => {
    const isEditable = (target: EventTarget | null) => target instanceof HTMLElement && Boolean(target.closest("input, textarea, select, [contenteditable=true]"));
    const cycleMotion = () => { const next: Record<MotionPreference, MotionPreference> = { full: "reduced", reduced: "low-power", "low-power": "full" }; onMotionChange(next[motionPreference]); };
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditable(event.target)) return;
      if (event.key === "/") { event.preventDefault(); setOpen(true); }
      if (event.key.toLowerCase() === "m") { event.preventDefault(); cycleMotion(); }
      if (event.key.toLowerCase() === "r") { event.preventDefault(); onNavigate(language === "zh" ? "/zh/resume" : "/resume", "MK / CV"); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [language, motionPreference, onMotionChange, onNavigate]);
  const run = (action: () => void) => { setOpen(false); action(); };
  return <CommandDialog open={open} onOpenChange={setOpen} title={labels.title} description={labels.description} className="portfolio-command" showCloseButton={false}><CommandInput placeholder={labels.input} /><CommandList><CommandEmpty>{labels.empty}</CommandEmpty><CommandGroup heading={labels.paths}><CommandItem value="archive public code search" onSelect={() => run(onArchive)}><Search /><span>{labels.archive}</span><CommandShortcut>/</CommandShortcut></CommandItem><CommandItem value="recruiter resume cv" onSelect={() => run(() => onNavigate(language === "zh" ? "/zh/resume" : "/resume", "MK / CV"))}><FileText /><span>{labels.resume}</span><CommandShortcut>R</CommandShortcut></CommandItem></CommandGroup><CommandGroup heading={labels.project}>{projects.map((project) => <CommandItem key={project.id} value={project.title} onSelect={() => run(() => onNavigate(project.target, `MK / ${project.id}`))}><BookOpen /><span>{project.title}</span><CommandShortcut>↗</CommandShortcut></CommandItem>)}</CommandGroup><CommandGroup heading={labels.settings}><CommandItem value="full motion" onSelect={() => run(() => onMotionChange("full"))}><CircleDashed /><span>{labels.full}</span>{motionPreference === "full" && <CommandShortcut>✓</CommandShortcut>}</CommandItem><CommandItem value="reduced motion" onSelect={() => run(() => onMotionChange("reduced"))}><SlidersHorizontal /><span>{labels.reduced}</span>{motionPreference === "reduced" && <CommandShortcut>✓</CommandShortcut>}</CommandItem><CommandItem value="low power" onSelect={() => run(() => onMotionChange("low-power"))}><Command /><span>{labels.low}</span>{motionPreference === "low-power" && <CommandShortcut>✓</CommandShortcut>}</CommandItem></CommandGroup></CommandList></CommandDialog>;
}
