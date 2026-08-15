/**
 * Crimson Reliquary style reminder: dark editorial space, sealed-vermilion signals,
 * tactile transitions, and clear bilingual access over generic app chrome.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { ChamberRitual, RouteRitual } from "./components/RouteRitual";

const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const Resume = lazy(() => import("./pages/Resume"));
const PersonalSignature = lazy(() => import("./pages/PersonalSignature"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/zh" component={Home} />
      <Route path="/case-studies/:slug"><Suspense fallback={<ChamberRitual language="en" />}><CaseStudy /></Suspense></Route>
      <Route path="/zh/case-studies/:slug"><Suspense fallback={<ChamberRitual language="zh" />}><CaseStudy /></Suspense></Route>
      <Route path="/resume"><Suspense fallback={<ChamberRitual language="en" />}><Resume /></Suspense></Route>
      <Route path="/zh/resume"><Suspense fallback={<ChamberRitual language="zh" />}><Resume /></Suspense></Route>
      <Route path="/signature"><Suspense fallback={<ChamberRitual language="en" />}><PersonalSignature /></Suspense></Route>
      <Route path="/zh/signature"><Suspense fallback={<ChamberRitual language="zh" />}><PersonalSignature /></Suspense></Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <RouteRitual />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
