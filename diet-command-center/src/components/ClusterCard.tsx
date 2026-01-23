import { motion } from "framer-motion";

interface ClusterCardProps {
  title: string;
  subtitle: string;
  image: string;
  glowColor: "cyan" | "purple" | "orange";
  delay?: number;
  onClick?: () => void;
}

const colorStyles = {
  cyan: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-600",
    accent: "bg-blue-500",
  },
  purple: {
    border: "border-green-200",
    bg: "bg-green-50",
    text: "text-green-600",
    accent: "bg-green-500",
  },
  orange: {
    border: "border-orange-200",
    bg: "bg-orange-50",
    text: "text-orange-600",
    accent: "bg-orange-500",
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
  const styles = colorStyles[glowColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`
        relative cursor-pointer group
        bg-card rounded-xl border-2 ${styles.border}
        shadow-sm hover:shadow-lg
        transition-all duration-300
        overflow-hidden
      `}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${styles.accent}`} />
      
      {/* Header */}
      <div className="p-5 pb-3">
        <h3 className={`text-lg font-semibold ${styles.text}`}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {subtitle}
        </p>
      </div>

      {/* Image container */}
      <div className="relative px-5 pb-4">
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>

      {/* Bottom status bar */}
      <div className={`px-5 pb-4 flex items-center justify-between ${styles.bg} border-t ${styles.border}`}>
        <div className="flex items-center gap-2 py-3">
          <div className={`w-2 h-2 rounded-full ${styles.accent}`} />
          <span className="text-xs text-muted-foreground font-medium">Active</span>
        </div>
        <span className={`text-xs ${styles.text} font-semibold`}>
          View Details →
        </span>
      </div>
    </motion.div>
  );
};
