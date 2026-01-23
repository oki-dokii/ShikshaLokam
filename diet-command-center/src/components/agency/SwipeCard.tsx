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
                className="absolute -left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white border-4 border-red-500 shadow-2xl z-20"
                style={{ opacity: leftGlow }}
            >
                <X className="w-8 h-8 text-red-600" />
            </motion.div>

            {/* Right - Select */}
            <motion.div
                className="absolute -right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white border-4 border-emerald-500 shadow-2xl z-20"
                style={{ opacity: rightGlow }}
            >
                <Check className="w-8 h-8 text-emerald-600" />
            </motion.div>

            {/* Up - Urgent */}
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 -top-6 p-4 rounded-full bg-white border-4 border-pink-500 shadow-2xl z-20"
                style={{ opacity: upGlow }}
            >
                <Flame className="w-8 h-8 text-pink-600" />
            </motion.div>

            {/* Card Content */}
            <div className="bg-white border border-border/80 rounded-[2.5rem] p-8 min-h-[400px] flex flex-col relative overflow-hidden shadow-2xl shadow-primary/5">
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-full h-2 ${categoryStyle.bg}`} />
                <div className={`absolute -right-20 -top-20 w-64 h-64 ${categoryStyle.bg} opacity-[0.03] rounded-full blur-3xl`} />

                {/* Category Badge */}
                <div className={`relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl ${categoryStyle.bg} ${categoryStyle.text} text-[10px] font-black uppercase tracking-[0.15em] w-fit mb-8 border border-current/10 shadow-sm`}>
                    <IconComponent className="w-3.5 h-3.5" />
                    {categoryStyle.label}
                </div>

                {/* Challenge Text */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-2">
                    <h3 className="text-3xl font-outfit font-bold text-center text-foreground leading-[1.1] tracking-tight">
                        "{challenge.text}"
                    </h3>
                </div>

                {/* Swipe Hint */}
                <div className="relative z-10 mt-8 pt-6 border-t border-border/60">
                    <div className="flex justify-between items-center px-2">
                        <div className="flex flex-col items-center gap-1 opacity-60">
                            <div className="w-8 h-8 rounded-full border border-red-200 bg-red-50 flex items-center justify-center">
                                <X className="w-4 h-4 text-red-500" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Skip</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 rounded-full border-2 border-pink-200 bg-pink-50 flex items-center justify-center shadow-sm">
                                <Flame className="w-5 h-5 text-pink-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-pink-600">Urgent</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-60">
                            <div className="w-8 h-8 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center">
                                <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Select</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
