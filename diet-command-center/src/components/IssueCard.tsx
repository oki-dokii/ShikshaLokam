import { motion } from "framer-motion";
import { AlertTriangle, Activity, BookOpen } from "lucide-react";
import { ReactNode } from "react";

interface IssueCardProps {
  title: string;
  metric?: string;
  icon: "alert" | "activity" | "book";
  glowColor: "cyan" | "purple" | "orange";
  delay?: number;
}

const icons = {
  alert: AlertTriangle,
  activity: Activity,
  book: BookOpen,
};

const colorStyles = {
  cyan: {
    border: "border-neon-cyan/40",
    bg: "bg-neon-cyan/10",
    text: "text-neon-cyan",
    glow: "shadow-[0_0_30px_-5px_hsl(185_100%_50%/0.4)]",
  },
  purple: {
    border: "border-neon-purple/40",
    bg: "bg-neon-purple/10",
    text: "text-neon-purple",
    glow: "shadow-[0_0_30px_-5px_hsl(270_100%_65%/0.4)]",
  },
  orange: {
    border: "border-neon-orange/40",
    bg: "bg-neon-orange/10",
    text: "text-neon-orange",
    glow: "shadow-[0_0_30px_-5px_hsl(25_100%_55%/0.4)]",
  },
};

export const IssueCard = ({
  title,
  metric,
  icon,
  glowColor,
  delay = 0,
}: IssueCardProps) => {
  const Icon = icons[icon];
  const styles = colorStyles[glowColor];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`
        relative glass-panel p-5
        ${styles.border} ${styles.glow}
        hover:${styles.bg}
        transition-all duration-300 cursor-pointer
      `}
    >
      {/* Pulsing indicator */}
      <motion.div
        className={`absolute top-3 right-3 w-3 h-3 rounded-full ${styles.bg} ${styles.border}`}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${styles.bg} ${styles.border}`}>
          <Icon className={`w-6 h-6 ${styles.text}`} />
        </div>
        
        <div className="flex-1">
          <h4 className="font-rajdhani font-semibold text-foreground text-lg leading-tight">
            {title}
          </h4>
          {metric && (
            <p className={`text-2xl font-orbitron font-bold ${styles.text} mt-1`}>
              {metric}
            </p>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground uppercase tracking-wider">Priority: High</span>
          <span className={`${styles.text} font-semibold`}>View Details →</span>
        </div>
      </div>
    </motion.div>
  );
};
