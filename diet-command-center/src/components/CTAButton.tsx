import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CTAButtonProps {
  onClick?: () => void;
}

export const CTAButton = ({ onClick }: CTAButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="
        relative group
        px-8 py-4
        font-semibold text-base
        bg-primary text-primary-foreground
        rounded-lg
        shadow-md hover:shadow-lg
        transition-all duration-300
        hover:bg-primary/90
      "
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        Generate Updated Training
      </span>
    </motion.button>
  );
};
