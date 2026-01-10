import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, School, Users, GraduationCap, TrendingUp } from "lucide-react";
import { clusterInfo } from "@/data/clusterData";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { ResourceChart } from "@/components/dashboard/ResourceChart";
import { LanguageChart } from "@/components/dashboard/LanguageChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { IssuesTrendChart } from "@/components/dashboard/IssuesTrendChart";
import { Button } from "@/components/ui/button";
import { WoOPanel } from "@/components/dashboard/WoOPanel";

const glowStyles = {
  cyan: "neon-text-cyan",
  purple: "neon-text-purple",
  orange: "neon-text-orange",
};

const ClusterDashboard = () => {
  const { clusterId } = useParams<{ clusterId: string }>();
  const navigate = useNavigate();

  const cluster = clusterInfo[clusterId as keyof typeof clusterInfo];

  if (!cluster) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-orbitron text-2xl text-foreground mb-4">Cluster Not Found</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Control Room
            </Button>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full bg-neon-${cluster.glowColor} animate-pulse`} />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Live Data</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Title section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold text-foreground mb-2">
            <span className={glowStyles[cluster.glowColor]}>{cluster.title}</span>
            <span className="text-muted-foreground text-xl md:text-2xl ml-4">
              {cluster.subtitle}
            </span>
          </h1>
          <p className="text-muted-foreground max-w-3xl">{cluster.description}</p>
        </motion.div>

        {/* WoO Triggers */}
        <WoOPanel clusterId={cluster.id} glowColor={cluster.glowColor} />

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Schools"
            value={cluster.stats.schools}
            icon={School}
            glowColor={cluster.glowColor}
            delay={0}
          />
          <StatCard
            title="Teachers"
            value={cluster.stats.teachers}
            icon={Users}
            glowColor={cluster.glowColor}
            delay={0.1}
          />
          <StatCard
            title="Students"
            value={cluster.stats.students.toLocaleString()}
            icon={GraduationCap}
            glowColor={cluster.glowColor}
            delay={0.2}
          />
          <StatCard
            title="Avg Attendance"
            value={`${cluster.stats.avgAttendance}%`}
            icon={TrendingUp}
            glowColor={cluster.glowColor}
            delay={0.3}
          />
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AttendanceChart clusterId={cluster.id as "a" | "b" | "c"} glowColor={cluster.glowColor} />
          <ResourceChart clusterId={cluster.id as "a" | "b" | "c"} glowColor={cluster.glowColor} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LanguageChart clusterId={cluster.id as "a" | "b" | "c"} glowColor={cluster.glowColor} />
          <IssuesTrendChart glowColor={cluster.glowColor} />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-border/50 mt-12">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            DIET Training Control Room • {cluster.title} Analytics Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClusterDashboard;
