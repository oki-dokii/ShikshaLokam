import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { Challenge } from '../../data/challengeData';
import { categoryColors } from '../../data/challengeData';

interface SwipeCardProps {
    challenge: Challenge;
    onSwipe: (direction: 'left' | 'right') => void;
    isTop: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ challenge, onSwipe, isTop }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

    // Background color based on swipe direction
    const rightGlow = useTransform(x, [0, 100, 200], [0, 0.5, 1]);
    const leftGlow = useTransform(x, [-200, -100, 0], [1, 0.5, 0]);

    const categoryStyle = categoryColors[challenge.category];
    const IconComponent = challenge.icon;

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100) {
            onSwipe('right');
        } else if (info.offset.x < -100) {
            onSwipe('left');
        }
    };

    return (
        <motion.div
            className={`absolute w-full max-w-sm cursor-grab active:cursor-grabbing ${isTop ? 'z-10' : 'z-0'}`}
            style={{ x, rotate, opacity }}
            drag={isTop ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={handleDragEnd}
            initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
            animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
            exit={{
                x: x.get() > 0 ? 300 : -300,
                opacity: 0,
                transition: { duration: 0.3 }
            }}
        >
            {/* Swipe Indicators */}
            <motion.div
                className="absolute -left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-red-500/20 border-2 border-red-500"
                style={{ opacity: leftGlow }}
            >
                <X className="w-6 h-6 text-red-500" />
            </motion.div>
            <motion.div
                className="absolute -right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-emerald-500/20 border-2 border-emerald-500"
                style={{ opacity: rightGlow }}
            >
                <Check className="w-6 h-6 text-emerald-500" />
            </motion.div>

            {/* Card Content */}
            <div className="glass-panel rounded-2xl p-6 min-h-[320px] flex flex-col relative overflow-hidden">
                {/* Gradient Background */}
                <div className={`absolute inset-0 ${categoryStyle.bg} opacity-30`} />

                {/* Category Badge */}
                <div className={`relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${categoryStyle.bg} ${categoryStyle.text} text-xs font-semibold uppercase tracking-wider w-fit mb-6`}>
                    <IconComponent className="w-3.5 h-3.5" />
                    {challenge.category}
                </div>

                {/* Challenge Content */}
                <div className="relative z-10 flex-1 flex flex-col">
                    <h3 className="text-xl font-orbitron font-bold text-white mb-4 leading-tight">
                        {challenge.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed flex-1">
                        {challenge.description}
                    </p>
                </div>

                {/* Swipe Hint */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <X className="w-3 h-3 text-red-400" /> Skip
                    </span>
                    <span className="text-slate-600">Swipe or use buttons</span>
                    <span className="flex items-center gap-1">
                        Select <Check className="w-3 h-3 text-emerald-400" />
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
