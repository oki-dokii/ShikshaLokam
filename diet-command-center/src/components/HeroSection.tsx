import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Animated particles/stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Status badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-neon-cyan/30 mb-8"
            animate={{ boxShadow: ["0 0 20px hsl(185 100% 50% / 0.2)", "0 0 30px hsl(185 100% 50% / 0.4)", "0 0 20px hsl(185 100% 50% / 0.2)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-sm text-neon-cyan font-semibold uppercase tracking-widest">
              System Online
            </span>
          </motion.div>

          {/* Main title */}
          <h1 className="font-orbitron text-4xl sm:text-5xl md:text-7xl font-black mb-6">
            <span className="block text-foreground">DIET Training</span>
            <motion.span 
              className="block neon-text-cyan"
              animate={{ 
                textShadow: [
                  "0 0 20px hsl(185 100% 50% / 0.5)",
                  "0 0 40px hsl(185 100% 50% / 0.8)",
                  "0 0 20px hsl(185 100% 50% / 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Control Room
            </motion.span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground font-rajdhani max-w-2xl mx-auto mb-8">
            Real-Time Solutions for Real Teacher Needs
          </p>

          {/* Stats bar */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {[
              { label: "Districts Connected", value: "124" },
              { label: "Teachers Monitored", value: "48.2K" },
              { label: "Issues Resolved", value: "1.2K" },
            ].map((stat, i) => (
              <div key={stat.label} className="text-center">
                <motion.p 
                  className="text-3xl md:text-4xl font-orbitron font-bold text-neon-cyan"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
