import { motion } from 'framer-motion';
import { ChevronRight, Users, BookOpen, Brain, Activity } from 'lucide-react';

interface ClusterCardProps {
    title: string;
    subtitle: string;
    color: 'cyan' | 'purple' | 'orange';
    icon: 'users' | 'science' | 'language';
    stats: { label: string; value: string }[];
    onClick: () => void;
}

const colorMap = {
    cyan: {
        border: 'border-brand-cyan/30',
        bg: 'bg-brand-cyan/5',
        text: 'text-brand-cyan',
        glow: 'group-hover:shadow-[0_0_30px_-5px_#00f3ff]',
        gradient: 'from-brand-cyan/20 to-transparent'
    },
    purple: {
        border: 'border-brand-purple/30',
        bg: 'bg-brand-purple/5',
        text: 'text-brand-purple',
        glow: 'group-hover:shadow-[0_0_30px_-5px_#bc13fe]',
        gradient: 'from-brand-purple/20 to-transparent'
    },
    orange: {
        border: 'border-brand-orange/30',
        bg: 'bg-brand-orange/5',
        text: 'text-brand-orange',
        glow: 'group-hover:shadow-[0_0_30px_-5px_#ff9100]',
        gradient: 'from-brand-orange/20 to-transparent'
    }
};

const iconMap = {
    users: Users,
    science: Brain,
    language: BookOpen
};

export const ClusterCard: React.FC<ClusterCardProps> = ({ title, subtitle, color, icon, stats, onClick }) => {
    const styles = colorMap[color];
    const Icon = iconMap[icon];

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className={`group relative p-6 rounded-xl border ${styles.border} ${styles.bg} backdrop-blur-sm cursor-pointer overflow-hidden transition-all duration-300 ${styles.glow}`}
        >
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            {/* Content */}
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-lg border ${styles.border} bg-slate-900/50`}>
                        <Icon className={`w-8 h-8 ${styles.text}`} />
                    </div>
                    <Activity className={`w-5 h-5 ${styles.text} opacity-50`} />
                </div>

                <h3 className="text-2xl font-orbitron font-bold text-white mb-1 group-hover:tracking-wider transition-all">{title}</h3>
                <p className="text-slate-400 text-sm mb-6">{subtitle}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-slate-900/40 p-2 rounded border border-white/5">
                            <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                            <div className="text-lg font-rajdhani font-bold text-white">{stat.value}</div>
                        </div>
                    ))}
                </div>

                <div className={`flex items-center gap-2 text-sm font-medium ${styles.text} opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0`}>
                    <span>ACCESS DATA STREAM</span>
                    <ChevronRight className="w-4 h-4" />
                </div>
            </div>
        </motion.div>
    );
};
