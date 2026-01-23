import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
      {/* Background image with subtle overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.03] dark:opacity-[0.05]"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Status badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-semibold">
              ShikshaLokam Teacher Assistant Active
            </span>
          </motion.div>

          {/* Main title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground tracking-tight">
            <span className="block">ShikshaLokam</span>
            <span className="block text-primary mt-2">
              Teacher Assistant
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed font-inter">
            Real-time, context-aware coaching for teachers. Get the "Just-in-Time" support you need to transform your classroom and ignite student potential.
          </p>

          {/* Stats bar */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {[
              { label: "Immediate Interventions", value: "Just-in-Time" },
              { label: "Built for Rural Connectivity", value: "Last-Mile" },
              { label: "Hands-Free Coaching", value: "Voice-Enabled" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <p className="text-2xl md:text-3xl font-black text-primary mb-1 tracking-tight uppercase">
                  {stat.value}
                </p>
                <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
