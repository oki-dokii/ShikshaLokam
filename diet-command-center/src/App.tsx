import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { KnowledgeProvider } from "./context/KnowledgeContext";
import Index from "./pages/Index";
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
import ClusterDashboard from "./pages/ClusterDashboard";
import LiveQuizStudentView from "./components/content/LiveQuizStudentView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <KnowledgeProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            <Route path="/module-generator" element={<ModuleGenerator />} />
            <Route path="/frugal-tlm" element={<FrugalRecommender />} />
            <Route path="/simulation" element={<SimulationArena />} />
            <Route path="/assessment-ai" element={<AssessmentAI />} />
            <Route path="/engagement-analysis" element={<EngagementAnalysis />} />
            <Route path="/implementation-copilot" element={<ImplementationCopilot />} />
            <Route path="/real-time-feedback" element={<RealTimeFeedback />} />
            <Route path="/predictive-training" element={<PredictiveTraining />} />
            <Route path="/agency-engine" element={<AgencyEngine />} />
            <Route path="/content-transformer" element={<ContentTransformer />} />
            <Route path="/quiz-join/:sessionId" element={<LiveQuizStudentView />} />
            <Route path="/cluster/:clusterId" element={<ClusterDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </KnowledgeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
