import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface CTAButtonProps {
  onClick?: () => void;
}

export const CTAButton = ({ onClick }: CTAButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="
        relative group
        px-12 py-5
        font-orbitron font-bold text-lg uppercase tracking-widest
        bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-cyan
        text-primary-foreground
        rounded-xl
        overflow-hidden
        transition-all duration-300
      "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      style={{
        boxShadow: "0 0 40px hsl(185 100% 50% / 0.4), 0 0 80px hsl(185 100% 50% / 0.2)",
      }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-blue"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ opacity: 0.5 }}
      />

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle at center, hsl(185 100% 70% / 0.3), transparent 70%)",
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-3">
        <motion.span
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="w-5 h-5" />
        </motion.span>
        Generate Updated Training
      </span>

      {/* Border glow */}
      <div className="absolute inset-0 rounded-xl border-2 border-neon-cyan/50 group-hover:border-neon-cyan transition-colors duration-300" />
    </motion.button>
  );
};
