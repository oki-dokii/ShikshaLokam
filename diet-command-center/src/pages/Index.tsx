import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Recycle, MessageSquare, BookOpen, Activity, LineChart, Flame, FileText, MessageCircle, Map } from "lucide-react";
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
import { DropoutRadar } from "@/components/dashboard/DropoutRadar";


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
        <section className="relative py-16 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <KnowledgeFeed />
          </div>
        </section>



        <section className="relative py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Our Solutions
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Comprehensive tools to support teachers and improve learning outcomes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Content Transformer Card */}
                  <div className="clean-card p-6 card-hover">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">Content Transformer</h3>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium">RAG</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      Convert manuals or NCERT books into micro-modules with AI visualizations and voice.
                    </p>
                    <Button
                      onClick={() => navigate('/content-transformer')}
                      className="w-full"
                    >
                      Transform Content
                    </Button>
                  </div>

                  {/* Teacher Support Bot */}
                  <div className="clean-card p-6 card-hover">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                      <MessageCircle className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">Teacher Support Bot</h3>
                      <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded font-medium">LIVE</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      24/7 AI mentor on Telegram for immediate classroom support.
                    </p>
                    <Button
                      onClick={() => window.open('https://t.me/DIETTeacherBot', '_blank')}
                      variant="secondary"
                      className="w-full"
                    >
                      Chat on Telegram
                    </Button>
                  </div>
                </div>
              </div>

              {/* Dropout Radar Widget */}
              <div className="lg:col-span-1">
                <DropoutRadar />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Frugal TLM Card */}
              <div className="clean-card p-6 card-hover">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Recycle className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Frugal TLM Recommender</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Turn classroom materials into teaching resources with AI.
                </p>
                <Button
                  onClick={() => navigate('/frugal-tlm')}
                  variant="outline"
                  className="w-full"
                >
                  Scan Resources
                </Button>
              </div>

              {/* Simulation Arena Card */}
              <div className="clean-card p-6 card-hover">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Simulation Arena</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Practice handling difficult conversations with AI role-play.
                </p>
                <Button
                  onClick={() => navigate('/simulation')}
                  variant="outline"
                  className="w-full"
                >
                  Start Practice
                </Button>
              </div>

              {/* AI Assessment Card */}
              <div className="clean-card p-6 card-hover">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">AI Assessment</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Analyze student performance and generate personalized plans.
                </p>
                <Button
                  onClick={() => navigate('/assessment-ai')}
                  variant="outline"
                  className="w-full"
                >
                  Analyze Data
                </Button>
              </div>

              {/* Engagement Analysis Card */}
              <div className="clean-card p-6 card-hover">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Engagement Tracker</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Analyze class dynamics and get engagement boosters.
                </p>
                <Button
                  onClick={() => navigate('/engagement-analysis')}
                  variant="outline"
                  className="w-full"
                >
                  Check Pulse
                </Button>
              </div>

              {/* Implementation Copilot Card */}
              <div className="clean-card p-6 card-hover">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Implementation Copilot</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Your personal coach for reflecting on teaching strategies.
                </p>
                <Button
                  onClick={() => navigate('/implementation-copilot')}
                  variant="outline"
                  className="w-full"
                >
                  Start Reflection
                </Button>
              </div>

              {/* Real-Time Feedback Card */}
              <div className="clean-card p-6 card-hover">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Live Pulse</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Immediate in-class interventions for urgent situations.
                </p>
                <Button
                  onClick={() => navigate('/real-time-feedback')}
                  variant="outline"
                  className="w-full"
                >
                  Get Help Now
                </Button>
              </div>

              {/* Predictive Training Card */}
              <div className="clean-card p-6 card-hover">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <LineChart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Predictive Training</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Forecast and prevent training gaps with predictive AI.
                </p>
                <Button
                  onClick={() => navigate('/predictive-training')}
                  variant="outline"
                  className="w-full"
                >
                  Forecast Needs
                </Button>
              </div>

              {/* Agency Engine Card */}
              <div className="clean-card p-6 card-hover">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Flame className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Agency Engine</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Tell us what you really need through interactive challenges.
                </p>
                <Button
                  onClick={() => navigate('/agency-engine')}
                  variant="outline"
                  className="w-full"
                >
                  Get Started
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
        <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Ready to Transform Your District?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground mb-8 text-lg"
            >
              Join thousands of educators using AI-powered insights to create better learning experiences.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton onClick={handleGenerate} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-muted-foreground mb-2">
              ShikshaLokam • Empowering Educators with AI-Driven Insights
            </p>
            <p className="text-sm text-muted-foreground/70">
              Supporting 124 districts and 48,200+ teachers across India
            </p>
          </div>
        </footer>
      </div>
    </KnowledgeProvider>
  );
};

export default Index;
