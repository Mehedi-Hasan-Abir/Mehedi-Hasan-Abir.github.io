import { Suspense, lazy, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BackToTop } from "@/components/BackToTop";
import { CursorFollower } from "@/components/CursorFollower";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConnectionProvider, useConnection } from "@/contexts/ConnectionContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { trackPageView } from "@/lib/analytics";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

const BlogPage = lazy(() => import("@/pages/BlogPage"));

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
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { canLoadHeavy } = useConnection();
  return (
    <>
      <AnalyticsPageView />
      <ScrollProgress />
      <Toaster />
      {canLoadHeavy && <CursorFollower />}
      <BackToTop />
      <ThemeProvider />
      <Router />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider>
        <TooltipProvider>
          <MotionConfig reducedMotion="user">
            <AppContent />
          </MotionConfig>
        </TooltipProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
}

export default App;
