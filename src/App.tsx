import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import VisualizerPage from "./pages/VisualizerPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import ProblemsPage from "./pages/ProblemsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";

import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";

// Load auth testing utility in development mode
if (import.meta.env.DEV) {
  import('./utils/auth-test.js')
    .then(() => console.log('Auth testing utilities loaded'))
    .catch(err => console.error('Failed to load auth testing utilities:', err));
}

const queryClient = new QueryClient();

// Animation wrapper component
const AnimationWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
      {children}
    </div>
  );
};

// Routes with animations
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout><AnimationWrapper><HomePage /></AnimationWrapper></Layout>} />
      <Route path="/visualizer" element={<Layout><AnimationWrapper><VisualizerPage /></AnimationWrapper></Layout>} />
      <Route path="/playground" element={<Layout><AnimationWrapper><PlaygroundPage /></AnimationWrapper></Layout>} />
      <Route path="/problems" element={<Layout><AnimationWrapper><ProblemsPage /></AnimationWrapper></Layout>} />
      <Route path="/about" element={<Layout><AnimationWrapper><AboutPage /></AnimationWrapper></Layout>} />
      <Route path="/contact" element={<Layout><AnimationWrapper><ContactPage /></AnimationWrapper></Layout>} />
      <Route path="/auth" element={<AnimationWrapper><AuthPage /></AnimationWrapper>} />

      <Route path="/profile" element={<Layout><AnimationWrapper><ProfilePage /></AnimationWrapper></Layout>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<Layout><AnimationWrapper><NotFound /></AnimationWrapper></Layout>} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
