import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, Lightbulb, CheckCircle, Loader2, Sparkles, Target, Users, MessageCircle } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { trainingModules, categoryColors, categoryIcons } from '../data/modulesData';
import { summarizeModule } from '../lib/gemini';
import type { ModuleSummary } from '../lib/gemini';
import type { TrainingModule } from '../data/modulesData';

export const ModuleDetailPage = () => {
    const { moduleId } = useParams();
    const navigate = useNavigate();
    const [module, setModule] = useState<TrainingModule | null>(null);
    const [summary, setSummary] = useState<ModuleSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const foundModule = trainingModules.find(m => m.id === moduleId);
        if (foundModule) {
            setModule(foundModule);
            loadAISummary(foundModule);
        } else {
            setError('Module not found');
            setLoading(false);
        }
    }, [moduleId]);

    const loadAISummary = async (mod: TrainingModule) => {
        setLoading(true);
        try {
            const result = await summarizeModule(mod.title, mod.description);
            setSummary(result);
        } catch (err) {
            console.error('Failed to load AI summary:', err);
            // Use fallback summary
            setSummary({
                title: mod.title,
                overview: mod.description,
                keyLearnings: [
                    'Understanding core concepts of ' + mod.category,
                    'Practical implementation strategies',
                    'Assessment and feedback methods',
                    'Continuous improvement techniques'
                ],
                practicalSteps: [
                    'Step 1: Review the module overview carefully',
                    'Step 2: Identify 2-3 key concepts relevant to your classroom',
                    'Step 3: Plan one activity to try this week'
                ],
                estimatedTime: mod.duration || '30 minutes',
                targetAudience: 'All teachers'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!module) {
        return (
            <MainLayout>
                <div className="text-center py-20">
                    <p className="text-slate-400">{error || 'Loading...'}</p>
                    <button onClick={() => navigate('/modules')} className="mt-4 text-brand-cyan hover:underline">
                        Back to Modules
                    </button>
                </div>
            </MainLayout>
        );
    }

    const style = categoryColors[module.category];
    const Icon = categoryIcons[module.category];

    return (
        <MainLayout>
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate('/modules')}
                    className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md ${style.bg} ${style.text} text-xs font-semibold mb-2`}>
                        <Icon className="w-3 h-3" />
                        {module.category}
                    </div>
                    <h2 className="text-xl font-orbitron font-bold text-white">
                        {summary?.title || module.title}
                    </h2>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-brand-cyan animate-spin mb-4" />
                    <p className="text-slate-400">AI is preparing your personalized learning content...</p>
                </div>
            ) : summary ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overview Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`glass-panel rounded-xl p-6 ${style.glow}`}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className={`w-5 h-5 ${style.text}`} />
                                <h3 className="font-orbitron font-bold text-white">Overview</h3>
                                <span className="ml-auto text-xs text-slate-500 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> AI Generated
                                </span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{summary.overview}</p>
                        </motion.div>

                        {/* Key Learnings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-panel rounded-xl p-6"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="w-5 h-5 text-amber-400" />
                                <h3 className="font-orbitron font-bold text-white">What You'll Learn</h3>
                            </div>
                            <div className="space-y-3">
                                {summary.keyLearnings.map((learning, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="p-1 rounded-full bg-amber-500/20 mt-0.5">
                                            <CheckCircle className="w-3 h-3 text-amber-400" />
                                        </div>
                                        <p className="text-slate-300 text-sm">{learning}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Practical Steps */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-panel rounded-xl p-6"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Target className="w-5 h-5 text-brand-cyan" />
                                <h3 className="font-orbitron font-bold text-white">Action Steps</h3>
                            </div>
                            <div className="space-y-4">
                                {summary.practicalSteps.map((step, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
                                            <span className={`font-orbitron font-bold text-sm ${style.text}`}>{index + 1}</span>
                                        </div>
                                        <p className="text-slate-300 text-sm pt-1">{step}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel rounded-xl p-5"
                        >
                            <h4 className="font-orbitron font-bold text-white mb-4">Quick Info</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-brand-cyan/20">
                                        <Clock className="w-4 h-4 text-brand-cyan" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Duration</p>
                                        <p className="text-sm text-white font-medium">{summary.estimatedTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-brand-purple/20">
                                        <Users className="w-4 h-4 text-brand-purple" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Target Audience</p>
                                        <p className="text-sm text-white font-medium">{summary.targetAudience}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${style.bg}`}>
                                        <BookOpen className={`w-4 h-4 ${style.text}`} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Category</p>
                                        <p className="text-sm text-white font-medium">{module.category}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* AI Assistant Tip */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-panel rounded-xl p-5 border-brand-cyan/30"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <MessageCircle className="w-4 h-4 text-brand-cyan" />
                                <h4 className="font-orbitron font-bold text-white">AI Learning Tip</h4>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Focus on one action step at a time. Try implementing just the first step
                                in your next class, then observe how students respond before moving forward.
                            </p>
                        </motion.div>

                        {/* Language Badge for Regional Modules */}
                        {module.language === 'Kannada' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-panel rounded-xl p-5 border-pink-500/30"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 text-xs bg-pink-500/20 text-pink-400 rounded font-bold">ಕನ್ನಡ</span>
                                    <span className="text-white font-orbitron font-bold">Regional Content</span>
                                </div>
                                <p className="text-xs text-slate-400">
                                    This module was originally in Kannada. The summary above has been translated to English by AI.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            ) : null}
        </MainLayout>
    );
};
