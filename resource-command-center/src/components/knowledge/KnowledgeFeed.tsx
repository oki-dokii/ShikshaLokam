import React from 'react';
import { useKnowledge } from '@/context/KnowledgeContext';
import { motion } from 'framer-motion';
import { Tag, Clock, User, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const KnowledgeFeed = () => {
    const { insights } = useKnowledge();

    if (insights.length === 0) {
        return (
            <div className="text-center text-slate-500 py-12">
                No insights captured yet. Be the first to share!
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-orbitron text-2xl font-bold text-foreground">
                    Tacit Knowledge <span className="neon-text-purple">Feed</span>
                </h2>
                <div className="text-sm text-slate-400">
                    {insights.length} Insights Shared
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {insights.map((insight, index) => (
                    <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-900/50 border border-white/5 rounded-xl p-6 hover:border-brand-purple/50 transition-colors group relative overflow-hidden"
                    >
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-purple/20 transition-all" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <User className="w-3 h-3" />
                                    <span>{insight.author}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <p className="text-slate-200 mb-6 font-medium leading-relaxed">
                                "{insight.text}"
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {insight.tags.map(tag => (
                                    <div key={tag} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-[10px] text-brand-cyan border border-white/5">
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400 hover:text-white hover:bg-white/5">
                                    <Bookmark className="w-3 h-3 mr-2" />
                                    Save
                                </Button>
                                {insight.clusterId && (
                                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                                        Cluster {insight.clusterId.toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
