import { Suspense, lazy, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BackToTop } from "@/components/BackToTop";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { CustomCursor } from "@/components/CustomCursor";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { trackPageView } from "@/lib/analytics";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

const BlogPage = lazy(() => import("@/pages/BlogPage"));
const WorksPage = lazy(() => import("@/pages/WorksPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ResearchPage = lazy(() => import("@/pages/ResearchPage"));
const ProjectPage = lazy(() => import("@/pages/ProjectPage"));

function AnalyticsPageView() {
  const [location] = useLocation();

  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return null;
}

function Router() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/blog">
            <ErrorBoundary>
              <BlogPage />
            </ErrorBoundary>
          </Route>
          <Route path="/works">
            <ErrorBoundary>
              <WorksPage />
            </ErrorBoundary>
          </Route>
          <Route path="/about" component={AboutPage} />
          <Route path="/research" component={ResearchPage} />
          <Route path="/projects/:slug" component={ProjectPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

function AppContent() {
  return (
    <>
      <AnalyticsPageView />
      <ScrollProgress />
      <Toaster />
      <CustomCursor />
      <ThemeProvider>
        <Router />
      </ThemeProvider>
      <BackToTop />
    </>
  );
}

function App() {
  return (
    <ConnectionProvider>
      <TooltipProvider>
        {/* Animations always run - explicit site-owner requirement. */}
        <MotionConfig>
          <AppContent />
        </MotionConfig>
      </TooltipProvider>
    </ConnectionProvider>
  );
}

export default App;
