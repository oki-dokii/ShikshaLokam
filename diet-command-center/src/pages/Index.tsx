import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Map, Recycle, MessageSquare, BookOpen, Activity } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { ClusterCard } from "@/components/ClusterCard";
import { IssueCard } from "@/components/IssueCard";
import { CTAButton } from "@/components/CTAButton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import clusterA from "@/assets/cluster-a.png";
import clusterB from "@/assets/cluster-b.png";
import clusterC from "@/assets/cluster-c.png";

const clusters = [
  {
    id: "a",
    title: "Cluster A",
    subtitle: "Addressing Absenteeism & Behavior",
    image: clusterA,
    glowColor: "cyan" as const,
  },
  {
    id: "b",
    title: "Cluster B",
    subtitle: "Advanced Science Materials",
    image: clusterB,
    glowColor: "purple" as const,
  },
  {
    id: "c",
    title: "Cluster C",
    subtitle: "Contextualized Learning",
    image: clusterC,
    glowColor: "orange" as const,
  },
];

const issues = [
  {
    title: "High Absenteeism in Cluster A",
    metric: "35%",
    icon: "alert" as const,
    glowColor: "cyan" as const,
  },
  {
    title: "No Lab Equipment in Cluster B",
    icon: "activity" as const,
    glowColor: "purple" as const,
  },
  {
    title: "Language Barrier in Cluster C",
    icon: "book" as const,
    glowColor: "orange" as const,
  },
];

import { CaptureFab } from "@/components/knowledge/CaptureFab";
import { KnowledgeProvider } from "@/context/KnowledgeContext";
import { KnowledgeFeed } from "@/components/knowledge/KnowledgeFeed";


const Index = () => {
  const navigate = useNavigate();

  const handleClusterClick = (id: string, title: string) => {
    toast.info(`Accessing ${title} data...`, {
      description: "Loading real-time analytics",
    });
    navigate(`/ cluster / ${id} `);
  };

  const handleGenerate = () => {
    toast.success("Training Program Generated!", {
      description: "Customized modules are being prepared based on current issues.",
    });
  };
  return (
    <KnowledgeProvider>
      <div className="min-h-screen bg-background overflow-hidden relative">
        <CaptureFab />
        {/* Hero Section */}
        <HeroSection />

        {/* ... existing sections ... */}

        {/* Knowledge Feed Section */}
        <section className="relative py-20 px-4 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <KnowledgeFeed />
          </div>
        </section>



        <section className="relative py-20 px-4">
          {/* Live Issues Section content... */}

          <div className="max-w-6xl mx-auto">
            {/* Section header with line accent */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-12"
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
                Live Issues <span className="neon-text-orange">Today</span>
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Heatmap Card */}
              <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-brand-purple/50 transition-all group">
                <div className="w-12 h-12 bg-brand-purple/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Map className="w-6 h-6 text-brand-purple" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Geospatial Heatmap</h3>
                <p className="text-slate-400 mb-6">
                  Analyze district-wise performance and identify priority clusters.
                </p>
                <Button
                  onClick={() => navigate('/heatmap')}
                  variant="outline"
                  className="w-full border-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white"
                >
                  View Heatmap
                </Button>
              </div>

              {/* Frugal TLM Card */}
              <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-brand-cyan/50 transition-all group">
                <div className="w-12 h-12 bg-brand-cyan/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Recycle className="w-6 h-6 text-brand-cyan" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Frugal TLM Recommender</h3>
                <p className="text-slate-400 mb-6">
                  Turn classroom trash into teaching treasures. AI identifies resources from photos.
                </p>
                <Button
                  onClick={() => navigate('/frugal-tlm')}
                  variant="outline"
                  className="w-full border-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan hover:text-brand-dark"
                >
                  Scan Resources
                </Button>
              </div>

              {/* Simulation Arena Card */}
              <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-brand-purple/50 transition-all group">
                <div className="w-12 h-12 bg-brand-purple/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-brand-purple" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Simulation Arena</h3>
                <p className="text-slate-400 mb-6">
                  Practice handling difficult parents and students with AI role-play scenarios.
                </p>
                <Button
                  onClick={() => navigate('/simulation')}
                  variant="outline"
                  className="w-full border-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white"
                >
                  Start Role-Play
                </Button>
              </div>

              {/* AI Assessment Card */}
              <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-green-500/50 transition-all group">
                <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Assessment</h3>
                <p className="text-slate-400 mb-6">Analyze student performance and generate personalized learning plans.</p>
                <Button
                  onClick={() => navigate('/assessment-ai')}
                  variant="outline"
                  className="w-full border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white"
                >
                  Analyze Data
                </Button>
              </div>

              {/* Engagement Analysis Card */}
              <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-brand-cyan/50 transition-all group">
                <div className="h-12 w-12 rounded-lg bg-brand-cyan/20 flex items-center justify-center mb-6 text-brand-cyan group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Engagement Tracker</h3>
                <p className="text-slate-400 mb-6">Analyze class dynamics and get engagement boosters.</p>
                <Button
                  onClick={() => navigate('/engagement-analysis')}
                  variant="outline"
                  className="w-full border-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan hover:text-brand-dark"
                >
                  Check Pulse
                </Button>
              </div>

              {/* Implementation Copilot Card */}
              <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-pink-500/50 transition-all group">
                <div className="h-12 w-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Implementation Copilot</h3>
                <p className="text-slate-400 mb-6">Your personal coach for reflecting on teaching strategies.</p>
                <Button
                  onClick={() => navigate('/implementation-copilot')}
                  variant="outline"
                  className="w-full border-pink-500/20 text-pink-400 hover:bg-pink-500 hover:text-white"
                >
                  Start Reflection
                </Button>
              </div>

            </div>
            {/* Issue cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {issues.map((issue, i) => (
                <IssueCard
                  key={issue.title}
                  {...issue}
                  delay={i * 0.15}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 px-4">
          {/* Background glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground mb-8 text-lg"
            >
              Ready to deploy customized training based on current analytics?
            </motion.p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <CTAButton onClick={handleGenerate} />
              <button
                onClick={() => navigate('/heatmap')}
                className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 text-white font-orbitron tracking-widest transition-all"
              >
                View Geospatial Heatmap
              </button>
            </div>
          </div>
        </section>

        {/* Footer accent */}
        <footer className="py-8 border-t border-border/50">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              DIET Training Control Room • Powered by AI-Driven Analytics
            </p>
          </div>
        </footer>
      </div>
    </KnowledgeProvider>
  );
};

export default Index;
