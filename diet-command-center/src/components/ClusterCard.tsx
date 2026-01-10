import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ClusterCardProps {
  title: string;
  subtitle: string;
  image: string;
  glowColor: "cyan" | "purple" | "orange";
  delay?: number;
  onClick?: () => void;
}

const glowStyles = {
  cyan: {
    border: "border-neon-cyan/30",
    shadow: "hover:shadow-[0_0_60px_-10px_hsl(185_100%_50%/0.6)]",
    glow: "bg-neon-cyan/20",
    text: "text-neon-cyan",
    bar: "bg-gradient-to-r from-neon-cyan to-neon-blue",
  },
  purple: {
    border: "border-neon-purple/30",
    shadow: "hover:shadow-[0_0_60px_-10px_hsl(270_100%_65%/0.6)]",
    glow: "bg-neon-purple/20",
    text: "text-neon-purple",
    bar: "bg-gradient-to-r from-neon-purple to-neon-magenta",
  },
  orange: {
    border: "border-neon-orange/30",
    shadow: "hover:shadow-[0_0_60px_-10px_hsl(25_100%_55%/0.6)]",
    glow: "bg-neon-orange/20",
    text: "text-neon-orange",
    bar: "bg-gradient-to-r from-neon-orange to-accent",
  },
};

export const ClusterCard = ({
  title,
  subtitle,
  image,
  glowColor,
  delay = 0,
  onClick,
}: ClusterCardProps) => {
  const styles = glowStyles[glowColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      whileHover={{ 
        y: -15, 
        scale: 1.02,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      onClick={onClick}
      className={`
        relative cursor-pointer group
        holographic-card p-1
        ${styles.border} ${styles.shadow}
        transition-all duration-500
      `}
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      {/* Glow effect behind card */}
      <div className={`absolute inset-0 ${styles.glow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
      
      {/* Card content */}
      <div className="relative bg-card/80 backdrop-blur-xl rounded-xl overflow-hidden">
        {/* Top accent bar */}
        <div className={`h-1 w-full ${styles.bar}`} />
        
        {/* Header */}
        <div className="p-4 pb-2">
          <h3 className={`text-lg font-orbitron font-bold ${styles.text}`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        </div>

        {/* Image container */}
        <div className="relative px-4 pb-4">
          <div className="relative rounded-lg overflow-hidden bg-background/50">
            <img 
              src={image} 
              alt={title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="px-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${styles.bar} animate-pulse`} />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Active</span>
          </div>
          <motion.div 
            className={`text-xs ${styles.text} font-semibold uppercase tracking-wider`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Click to Explore
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
