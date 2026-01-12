import { motion } from 'framer-motion';
import { Flame, TrendingUp, BarChart3, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SwipeRecord } from '@/types/agency';
import { categoryConfig } from '@/data/agencyChallenges';

interface AggregationDashboardProps {
    swipeRecords: SwipeRecord[];
    recommendedModule: string;
    demandProfile: string;
    onGenerateModule: () => void;
    onRestart: () => void;
}

export const AggregationDashboard: React.FC<AggregationDashboardProps> = ({
    swipeRecords,
    recommendedModule,
    demandProfile,
    onGenerateModule,
    onRestart,
}) => {
    // Calculate aggregations
    const selectedRecords = swipeRecords.filter(r => r.swipe_direction !== 'left');
    const urgentRecords = swipeRecords.filter(r => r.swipe_direction === 'up');

    // Category breakdown
    const categoryBreakdown = selectedRecords.reduce((acc, record) => {
        const challenge = record.challenge_text;
        // Extract category from the challenge (we'll need to match it)
        const existing = acc.find(c => c.text === challenge);
        if (existing) {
            existing.count++;
        } else {
            acc.push({ text: challenge, count: 1, isUrgent: record.swipe_direction === 'up' });
        }
        return acc;
    }, [] as { text: string; count: number; isUrgent: boolean }[]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto space-y-6"
        >
            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <Flame className="w-24 h-24 text-pink-500" />
                </div>

                <h3 className="text-pink-400 font-mono text-xs uppercase tracking-widest mb-2">
                    Demand Profile Match
                </h3>
                <h2 className="text-3xl font-bold text-white mb-4">
                    {recommendedModule}
                </h2>
                <p className="text-slate-300 text-lg mb-6 italic">
                    "{demandProfile}"
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-black/30 p-4 rounded-xl text-center">
                        <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{selectedRecords.length}</div>
                        <div className="text-xs text-slate-400">Challenges</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-xl text-center">
                        <Flame className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{urgentRecords.length}</div>
                        <div className="text-xs text-slate-400">Urgent</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-xl text-center">
                        <BarChart3 className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{swipeRecords.length}</div>
                        <div className="text-xs text-slate-400">Total Swiped</div>
                    </div>
                </div>
            </div>

            {/* Selected Challenges List */}
            {selectedRecords.length > 0 && (
                <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl">
                    <h4 className="text-sm text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        Your Selected Challenges
                    </h4>
                    <ul className="space-y-2">
                        {selectedRecords.map((record, i) => (
                            <li
                                key={i}
                                className={`flex items-start gap-3 p-3 rounded-lg ${record.swipe_direction === 'up'
                                        ? 'bg-pink-500/10 border border-pink-500/30'
                                        : 'bg-white/5'
                                    }`}
                            >
                                {record.swipe_direction === 'up' ? (
                                    <Flame className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                )}
                                <span className="text-slate-200">{record.challenge_text}</span>
                                {record.swipe_direction === 'up' && (
                                    <span className="ml-auto text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full">
                                        URGENT
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button
                    onClick={onRestart}
                    variant="outline"
                    className="flex-1 border-white/20 text-slate-300 hover:bg-white/10"
                >
                    Start Over
                </Button>
                <Button
                    onClick={onGenerateModule}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 font-bold"
                >
                    Generate Training Module <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
};
