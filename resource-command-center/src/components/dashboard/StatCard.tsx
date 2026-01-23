import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  glowColor: "cyan" | "purple" | "orange";
  delay?: number;
}

const glowStyles = {
  cyan: {
    icon: "text-neon-cyan",
    glow: "bg-neon-cyan/20",
  },
  purple: {
    icon: "text-neon-purple",
    glow: "bg-neon-purple/20",
  },
  orange: {
    icon: "text-neon-orange",
    glow: "bg-neon-orange/20",
  },
};

export const StatCard = ({ title, value, icon: Icon, glowColor, delay = 0 }: StatCardProps) => {
  const styles = glowStyles[glowColor];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="holographic-card p-4 rounded-xl relative group"
    >
      <div className={`absolute inset-0 ${styles.glow} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 rounded-xl`} />
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${styles.glow}`}>
          <Icon className={`w-6 h-6 ${styles.icon}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-orbitron text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};
