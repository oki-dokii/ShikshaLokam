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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto space-y-8"
        >
            {/* Main Result Card */}
            <div className="clean-card p-10 border-pink-500/20 bg-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                    <Flame className="w-32 h-32 text-pink-500" />
                </div>

                <div className="flex items-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-pink-500/10 text-pink-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-pink-500/10">
                        Synthesized Training Demand
                    </span>
                </div>

                <h2 className="text-4xl font-outfit font-bold text-foreground mb-4 leading-tight tracking-tight">
                    {recommendedModule}
                </h2>
                <p className="text-muted-foreground text-xl mb-10 italic font-medium leading-relaxed">
                    "{demandProfile}"
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 text-center">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3 border border-emerald-200">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="text-3xl font-bold text-foreground mb-1">{selectedRecords.length}</div>
                        <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Mapped</div>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 text-center">
                        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3 border border-pink-200">
                            <Flame className="w-6 h-6 text-pink-600" />
                        </div>
                        <div className="text-3xl font-bold text-foreground mb-1">{urgentRecords.length}</div>
                        <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Urgent</div>
                    </div>
                    <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 text-center">
                        <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-3 border border-cyan-200">
                            <BarChart3 className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div className="text-3xl font-bold text-foreground mb-1">{swipeRecords.length}</div>
                        <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Total Analyzed</div>
                    </div>
                </div>
            </div>

            {/* Selected Challenges List */}
            {selectedRecords.length > 0 && (
                <div className="clean-card p-8 border-border/80 bg-white">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Check className="w-3 h-3 text-emerald-500" />
                        Signal Input Summary
                    </h4>
                    <div className="space-y-3">
                        {selectedRecords.map((record, i) => (
                            <div
                                key={i}
                                className={`flex items-start gap-4 p-4 rounded-[1.5rem] transition-colors ${record.swipe_direction === 'up'
                                    ? 'bg-pink-50 border border-pink-100'
                                    : 'bg-muted/30 border border-border/50'
                                    }`}
                            >
                                {record.swipe_direction === 'up' ? (
                                    <div className="mt-1 flex-shrink-0">
                                        <Flame className="w-5 h-5 text-pink-500" />
                                    </div>
                                ) : (
                                    <div className="mt-1 flex-shrink-0">
                                        <Check className="w-5 h-5 text-emerald-500" />
                                    </div>
                                )}
                                <span className="text-foreground font-medium text-base">{record.challenge_text}</span>
                                {record.swipe_direction === 'up' && (
                                    <span className="ml-auto flex-shrink-0 text-[9px] bg-pink-500 text-white px-2 py-0.5 rounded-md font-black tracking-widest uppercase">
                                        Urgent
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
                <Button
                    onClick={onRestart}
                    variant="outline"
                    className="flex-1 h-16 rounded-2xl border-border hover:bg-muted text-muted-foreground font-bold transition-all"
                >
                    Start Over
                </Button>
                <Button
                    onClick={onGenerateModule}
                    className="flex-1 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 font-bold shadow-xl shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
                >
                    Generate Intervention <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </motion.div>
    );
};
