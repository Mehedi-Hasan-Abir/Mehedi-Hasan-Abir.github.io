import { Suspense, lazy, useEffect, useState } from "react";
import { motion, MotionConfig, useScroll, useVelocity, useSpring, useTransform } from "framer-motion";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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

/** Subtle scroll-velocity skew on the whole page (desktop only). */
function ScrollSkew({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 220, damping: 50, mass: 0.6 });
  const skewY = useTransform(smooth, [-2400, 0, 2400], ["1.1deg", "0deg", "-1.1deg"], { clamp: true });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <motion.div style={{ skewY: isDesktop ? skewY : "0deg", willChange: "transform" }}>
      {children}
    </motion.div>
  );
}

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
  return (
    <>
      <AnalyticsPageView />
      <ScrollProgress />
      <Toaster />
      <CustomCursor />
      <ThemeProvider>
        <ScrollSkew>
          <Router />
        </ScrollSkew>
      </ThemeProvider>
      <BackToTop />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider>
        <TooltipProvider>
          {/* Animations always run - explicit site-owner requirement. */}
          <MotionConfig>
            <AppContent />
          </MotionConfig>
        </TooltipProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
}

export default App;
