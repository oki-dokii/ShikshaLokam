import { motion } from "framer-motion";
import { AlertTriangle, Activity, BookOpen } from "lucide-react";

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
    border: "border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  purple: {
    border: "border-green-200",
    bg: "bg-green-50",
    text: "text-green-600",
    iconBg: "bg-green-100",
  },
  orange: {
    border: "border-orange-200",
    bg: "bg-orange-50",
    text: "text-orange-600",
    iconBg: "bg-orange-100",
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`
        relative bg-card rounded-lg border-2 ${styles.border}
        p-5 shadow-sm hover:shadow-md
        transition-all duration-300 cursor-pointer
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${styles.iconBg}`}>
          <Icon className={`w-6 h-6 ${styles.text}`} />
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-foreground text-base leading-tight">
            {title}
          </h4>
          {metric && (
            <p className={`text-2xl font-bold ${styles.text} mt-2`}>
              {metric}
            </p>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Priority: High</span>
          <span className={`${styles.text} font-semibold`}>View Details →</span>
        </div>
      </div>
    </motion.div>
  );
};
