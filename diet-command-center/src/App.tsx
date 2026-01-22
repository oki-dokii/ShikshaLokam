import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { KnowledgeProvider } from "./context/KnowledgeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ModuleGenerator from "./pages/ModuleGenerator";
import FrugalRecommender from "./pages/FrugalRecommender";
import SimulationArena from "./pages/SimulationArena";
import AssessmentAI from "./pages/AssessmentAI";
import EngagementAnalysis from "./pages/EngagementAnalysis";
import ImplementationCopilot from "./pages/ImplementationCopilot";
import RealTimeFeedback from "./pages/RealTimeFeedback";
import PredictiveTraining from "./pages/PredictiveTraining";
import AgencyEngine from "./pages/AgencyEngine";
import ContentTransformer from "./pages/ContentTransformer";

import ResourcePersonDashboard from "./pages/ResourcePersonDashboard";
import LiveQuizStudentView from "./components/content/LiveQuizStudentView";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme-provider";
import { GlobalSettings } from "./components/common/GlobalSettings";
import { LanguageSwitcher } from "./components/common/LanguageSwitcher";
import GoogleTranslate from "./components/common/GoogleTranslate";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <KnowledgeProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Index />} />

                {/* Protected Routes */}
                <Route path="/module-generator" element={<PrivateRoute><ModuleGenerator /></PrivateRoute>} />
                <Route path="/frugal-tlm" element={<PrivateRoute><FrugalRecommender /></PrivateRoute>} />
                <Route path="/simulation" element={<PrivateRoute><SimulationArena /></PrivateRoute>} />
                <Route path="/assessment-ai" element={<PrivateRoute><AssessmentAI /></PrivateRoute>} />
                <Route path="/engagement-analysis" element={<PrivateRoute><EngagementAnalysis /></PrivateRoute>} />
                <Route path="/implementation-copilot" element={<PrivateRoute><ImplementationCopilot /></PrivateRoute>} />
                <Route path="/real-time-feedback" element={<PrivateRoute><RealTimeFeedback /></PrivateRoute>} />
                <Route path="/predictive-training" element={<PrivateRoute><PredictiveTraining /></PrivateRoute>} />
                <Route path="/agency-engine" element={<PrivateRoute><AgencyEngine /></PrivateRoute>} />
                <Route path="/content-transformer" element={<PrivateRoute><ContentTransformer /></PrivateRoute>} />
                <Route path="/rp-dashboard" element={<PrivateRoute><ResourcePersonDashboard /></PrivateRoute>} />

                <Route path="/quiz-join/:sessionId" element={<LiveQuizStudentView />} />
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Global Language Switcher - Fixed on top of all headers */}
              <div className="fixed top-4 right-4 md:right-6 md:top-6 z-[100]">
                <LanguageSwitcher />
              </div>
            </BrowserRouter>
            <GlobalSettings />
            <GoogleTranslate />
          </KnowledgeProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
