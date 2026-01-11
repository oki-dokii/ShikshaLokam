import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import type { Challenge } from '../../data/challengeData';
import { categoryColors } from '../../data/challengeData';

interface ResultsSummaryProps {
    selectedChallenges: Challenge[];
    onReset: () => void;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ selectedChallenges, onReset }) => {
    const navigate = useNavigate();
    // Group challenges by category
    const groupedChallenges = selectedChallenges.reduce((acc, challenge) => {
        if (!acc[challenge.category]) {
            acc[challenge.category] = [];
        }
        acc[challenge.category].push(challenge);
        return acc;
    }, {} as Record<string, Challenge[]>);

    const sortedCategories = Object.entries(groupedChallenges).sort((a, b) => b[1].length - a[1].length);

    // Mock AI recommendations based on top categories
    const getRecommendation = (category: string) => {
        const recommendations: Record<string, string> = {
            Engagement: 'Interactive Teaching Techniques & Gamification Strategies',
            Resources: 'Low-Cost Teaching Aids & DIY Learning Materials Workshop',
            Behavior: 'Positive Classroom Management & Student Motivation',
            Assessment: 'Formative Assessment Strategies & Quick Feedback Methods',
            Language: 'Multilingual Teaching Approaches & Code-Switching Techniques',
        };
        return recommendations[category] || 'General Pedagogical Skills';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-sm font-semibold mb-4"
                >
                    <Sparkles className="w-4 h-4" />
                    Analysis Complete
                </motion.div>
                <h2 className="text-2xl font-orbitron font-bold text-white mb-2">
                    Your Training Priorities
                </h2>
                <p className="text-slate-400">
                    Based on {selectedChallenges.length} challenges you selected
                </p>
            </div>

            {selectedChallenges.length === 0 ? (
                <div className="text-center py-12 glass-panel rounded-xl">
                    <p className="text-slate-400 mb-4">You didn't select any challenges.</p>
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/20 transition-colors mx-auto"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            ) : (
                <>
                    {/* Category Breakdown */}
                    <div className="space-y-4 mb-8">
                        {sortedCategories.map(([category, challenges], index) => {
                            const style = categoryColors[category as Challenge['category']];
                            const IconComponent = challenges[0].icon;

                            return (
                                <motion.div
                                    key={category}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className={`glass-panel rounded-xl p-5 ${style.glow}`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${style.bg}`}>
                                                <IconComponent className={`w-5 h-5 ${style.text}`} />
                                            </div>
                                            <div>
                                                <h3 className={`font-orbitron font-bold ${style.text}`}>{category}</h3>
                                                <p className="text-xs text-slate-500">{challenges.length} challenge{challenges.length > 1 ? 's' : ''} selected</p>
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-bold ${style.bg} ${style.text}`}>
                                            #{index + 1} Priority
                                        </div>
                                    </div>

                                    {/* Challenges List */}
                                    <div className="space-y-2 mb-4">
                                        {challenges.map(ch => (
                                            <div key={ch.id} className="text-sm text-slate-400 flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${style.bg.replace('/20', '')}`} />
                                                {ch.title}
                                            </div>
                                        ))}
                                    </div>

                                    {/* AI Recommendation */}
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-2">Recommended Training</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-white font-medium">
                                                {getRecommendation(category)}
                                            </span>
                                            <button
                                                onClick={() => navigate(`/modules?category=${category === 'Engagement' ? 'Pedagogy' : category === 'Resources' ? 'Resources' : category === 'Behavior' ? 'Pedagogy' : category === 'Assessment' ? 'Assessment' : 'Regional'}`)}
                                                className={`flex items-center gap-1 text-xs ${style.text} hover:underline`}
                                            >
                                                View Module <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onReset}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Start Over
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-semibold hover:opacity-90 transition-opacity">
                            <Sparkles className="w-4 h-4" />
                            Generate My Training Plan
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    );
};
