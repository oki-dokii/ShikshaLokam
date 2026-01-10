import { motion } from 'framer-motion';

export const Hero = () => {
    return (
        <div className="relative py-12 mb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h2 className="text-brand-cyan font-bold tracking-[0.3em] mb-4 text-sm">SYSTEM STATUS: OPTIMAL</h2>
                <h1 className="text-5xl md:text-7xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    DIET TRAINING<br />CONTROL ROOM
                </h1>
                <p className="text-slate-400 text-lg md:text-xl font-rajdhani max-w-2xl mx-auto border-l-2 border-brand-cyan pl-6 text-left">
                    Real-time AI monitoring of teacher needs across all training clusters.
                    Generating customized training programs based on live classroom telemetry.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <HeroStat label="Active Schools" value="1,248" delay={0.2} />
                <HeroStat label="Teachers Monitored" value="12,892" delay={0.3} />
                <HeroStat label="Student Impact" value="450k+" delay={0.4} />
            </div>
        </div>
    );
};

const HeroStat = ({ label, value, delay }: { label: string; value: string; delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        className="bg-slate-900/30 border border-white/10 p-6 rounded-lg backdrop-blur-sm text-center relative overflow-hidden group"
    >
        <div className="absolute inset-0 bg-brand-cyan/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        <div className="relative z-10">
            <div className="text-4xl font-rajdhani font-bold text-white mb-2">{value}</div>
            <div className="text-sm text-brand-cyan uppercase tracking-widest">{label}</div>
        </div>
    </motion.div>
);
