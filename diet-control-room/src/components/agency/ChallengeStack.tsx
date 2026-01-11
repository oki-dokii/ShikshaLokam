import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X, RotateCcw } from 'lucide-react';
import { SwipeCard } from './SwipeCard';
import type { Challenge } from '../../data/challengeData';
import { challengeData } from '../../data/challengeData';

interface ChallengeStackProps {
    onComplete: (selected: Challenge[]) => void;
}

export const ChallengeStack: React.FC<ChallengeStackProps> = ({ onComplete }) => {
    const [cards, setCards] = useState<Challenge[]>([...challengeData]);
    const [selectedChallenges, setSelectedChallenges] = useState<Challenge[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const totalCards = challengeData.length;
    const progress = ((totalCards - cards.length) / totalCards) * 100;

    const handleSwipe = (direction: 'left' | 'right') => {
        const currentCard = cards[0];

        if (direction === 'right') {
            setSelectedChallenges(prev => [...prev, currentCard]);
        }

        const newCards = cards.slice(1);
        setCards(newCards);
        setCurrentIndex(prev => prev + 1);

        if (newCards.length === 0) {
            // Small delay before showing results
            setTimeout(() => {
                onComplete(direction === 'right' ? [...selectedChallenges, currentCard] : selectedChallenges);
            }, 300);
        }
    };

    const handleButtonSwipe = (direction: 'left' | 'right') => {
        handleSwipe(direction);
    };

    const handleReset = () => {
        setCards([...challengeData]);
        setSelectedChallenges([]);
        setCurrentIndex(0);
    };

    if (cards.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12"
            >
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-orbitron text-white mb-2">All Done!</h3>
                <p className="text-slate-400 mb-6">You selected {selectedChallenges.length} challenges</p>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Start Over
                </button>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            {/* Progress Bar */}
            <div className="w-full max-w-sm mb-8">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>{currentIndex + 1} of {totalCards}</span>
                    <span>{selectedChallenges.length} selected</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-brand-cyan to-brand-purple"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Card Stack */}
            <div className="relative h-[360px] w-full max-w-sm flex items-center justify-center">
                <AnimatePresence>
                    {cards.slice(0, 2).map((challenge, index) => (
                        <SwipeCard
                            key={challenge.id}
                            challenge={challenge}
                            onSwipe={handleSwipe}
                            isTop={index === 0}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-6 mt-8">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleButtonSwipe('left')}
                    className="p-4 rounded-full bg-red-500/10 border-2 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500 transition-colors"
                >
                    <X className="w-6 h-6" />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleButtonSwipe('right')}
                    className="p-4 rounded-full bg-emerald-500/10 border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500 transition-colors"
                >
                    <Check className="w-6 h-6" />
                </motion.button>
            </div>
        </div>
    );
};
