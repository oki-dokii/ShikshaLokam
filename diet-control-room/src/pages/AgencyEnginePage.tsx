import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, HelpCircle } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { ChallengeStack } from '../components/agency/ChallengeStack';
import { ResultsSummary } from '../components/agency/ResultsSummary';
import type { Challenge } from '../data/challengeData';

type ViewState = 'intro' | 'swiping' | 'results';

export const AgencyEnginePage = () => {
    const navigate = useNavigate();
    const [viewState, setViewState] = useState<ViewState>('intro');
    const [selectedChallenges, setSelectedChallenges] = useState<Challenge[]>([]);

    const handleStart = () => {
        setViewState('swiping');
    };

    const handleComplete = (selected: Challenge[]) => {
        setSelectedChallenges(selected);
        setViewState('results');
    };

    const handleReset = () => {
        setSelectedChallenges([]);
        setViewState('intro');
    };

    return (
        <MainLayout>
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-xl font-orbitron font-bold text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-brand-orange" />
                        AGENCY <span className="text-brand-cyan">ENGINE</span>
                    </h2>
                    <p className="text-sm text-slate-500">Tell us what challenges you face</p>
                </div>
            </div>

            {/* View States */}
            {viewState === 'intro' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto text-center py-12"
                >
                    <div className="text-6xl mb-6">🎯</div>
                    <h3 className="text-2xl font-orbitron font-bold text-white mb-4">
                        Shape Your Training
                    </h3>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Swipe through classroom challenges to tell us what you're facing.
                        We'll use AI to recommend personalized training modules just for you.
                    </p>

                    <div className="glass-panel rounded-xl p-4 mb-8 text-left">
                        <div className="flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-brand-cyan mt-0.5" />
                            <div className="text-sm">
                                <p className="text-white font-medium mb-1">How it works:</p>
                                <ul className="text-slate-400 space-y-1">
                                    <li>• Swipe <span className="text-emerald-400">right</span> for challenges you face</li>
                                    <li>• Swipe <span className="text-red-400">left</span> to skip ones you don't</li>
                                    <li>• Get personalized training recommendations</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleStart}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-purple text-white font-orbitron font-bold text-lg shadow-[0_0_30px_-5px_#00f3ff] hover:shadow-[0_0_40px_-5px_#00f3ff] transition-shadow"
                    >
                        Start Swiping
                    </motion.button>
                </motion.div>
            )}

            {viewState === 'swiping' && (
                <ChallengeStack onComplete={handleComplete} />
            )}

            {viewState === 'results' && (
                <ResultsSummary
                    selectedChallenges={selectedChallenges}
                    onReset={handleReset}
                />
            )}
        </MainLayout>
    );
};
