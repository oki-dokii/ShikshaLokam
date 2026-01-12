import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { Check, X, Flame } from 'lucide-react';
import type { Challenge } from '@/data/agencyChallenges';
import { categoryConfig } from '@/data/agencyChallenges';

interface SwipeCardProps {
    challenge: Challenge;
    onSwipe: (direction: 'left' | 'right' | 'up') => void;
    isTop: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ challenge, onSwipe, isTop }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Rotation based on horizontal drag
    const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

    // Glow indicators based on swipe direction
    const rightGlow = useTransform(x, [0, 100, 200], [0, 0.5, 1]);
    const leftGlow = useTransform(x, [-200, -100, 0], [1, 0.5, 0]);
    const upGlow = useTransform(y, [-200, -100, 0], [1, 0.5, 0]);

    const categoryStyle = categoryConfig[challenge.category];
    const IconComponent = challenge.icon;

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100;

        // Check for upward swipe first (urgent)
        if (info.offset.y < -threshold && Math.abs(info.offset.y) > Math.abs(info.offset.x)) {
            onSwipe('up');
        } else if (info.offset.x > threshold) {
            onSwipe('right');
        } else if (info.offset.x < -threshold) {
            onSwipe('left');
        }
    };

    return (
        <motion.div
            className={`absolute w-full max-w-sm cursor-grab active:cursor-grabbing ${isTop ? 'z-10' : 'z-0'}`}
            style={{ x, y, rotate, opacity }}
            drag={isTop}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.9}
            onDragEnd={handleDragEnd}
            initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
            animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
            exit={{
                x: x.get() > 50 ? 300 : x.get() < -50 ? -300 : 0,
                y: y.get() < -50 ? -300 : 0,
                opacity: 0,
                transition: { duration: 0.3 }
            }}
        >
            {/* Swipe Direction Indicators */}
            {/* Left - Skip */}
            <motion.div
                className="absolute -left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-red-500/20 border-2 border-red-500"
                style={{ opacity: leftGlow }}
            >
                <X className="w-6 h-6 text-red-500" />
            </motion.div>

            {/* Right - Select */}
            <motion.div
                className="absolute -right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-emerald-500/20 border-2 border-emerald-500"
                style={{ opacity: rightGlow }}
            >
                <Check className="w-6 h-6 text-emerald-500" />
            </motion.div>

            {/* Up - Urgent */}
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 -top-4 p-3 rounded-full bg-pink-500/20 border-2 border-pink-500"
                style={{ opacity: upGlow }}
            >
                <Flame className="w-6 h-6 text-pink-500" />
            </motion.div>

            {/* Card Content */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 min-h-[320px] flex flex-col relative overflow-hidden shadow-2xl">
                {/* Gradient Background */}
                <div className={`absolute inset-0 ${categoryStyle.bg} opacity-30`} />

                {/* Category Badge */}
                <div className={`relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${categoryStyle.bg} ${categoryStyle.text} text-xs font-semibold uppercase tracking-wider w-fit mb-6`}>
                    <IconComponent className="w-3.5 h-3.5" />
                    {categoryStyle.label}
                </div>

                {/* Challenge Text */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                    <h3 className="text-2xl font-bold text-center text-white leading-tight">
                        "{challenge.text}"
                    </h3>
                </div>

                {/* Swipe Hint */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <X className="w-3 h-3 text-red-400" /> Skip
                        </span>
                        <span className="flex items-center gap-1 text-pink-400">
                            <Flame className="w-3 h-3" /> Urgent ↑
                        </span>
                        <span className="flex items-center gap-1">
                            Select <Check className="w-3 h-3 text-emerald-400" />
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
