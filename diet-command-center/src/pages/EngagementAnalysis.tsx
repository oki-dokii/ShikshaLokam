import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart2, Activity, Zap, Users, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeEngagement } from "@/lib/gemini";
import { motion } from "framer-motion";

const EngagementAnalysis = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<{ score: number, pattern: string, recommendations: { title: string, description: string }[] } | null>(null);

    const handleAnalyze = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        try {
            const result = await analyzeEngagement(input);
            setReport(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return "text-green-400";
        if (score >= 5) return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

            <header className="flex items-center gap-4 mb-8 relative z-10">
                <Button variant="ghost" onClick={() => navigate('/')} className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                        <Activity className="w-6 h-6 text-brand-cyan" />
                        Learner Engagement Tracker
                    </h1>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">

                {/* Input Section */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Session Reflection</h2>
                        <p className="text-slate-400 text-sm">Describe today's class dynamics. Was it quiet? chaotic? interactive?</p>
                    </div>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., I taught about gravity. Students listened quietly but didn't ask many questions. A few backbenchers were distracted..."
                        className="w-full h-64 bg-slate-800 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-cyan resize-none"
                    />

                    <Button
                        onClick={handleAnalyze}
                        disabled={isLoading || !input.trim()}
                        className="w-full bg-brand-cyan hover:bg-cyan-600 text-slate-900 font-bold py-6 text-lg rounded-xl"
                    >
                        {isLoading ? "Analyzing Dynamics..." : "Analyze Engagement"}
                    </Button>
                </div>

                {/* Output Section */}
                <div className="space-y-6">
                    {!report && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/10 rounded-2xl p-12">
                            <BarChart2 className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-lg">Engagement Metrics will appear here</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-cyan"></div>
                            <p className="text-brand-cyan animate-pulse">Measuring classroom vibe...</p>
                        </div>
                    )}

                    {report && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            {/* Score Card */}
                            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 flex items-center justify-between relative overflow-hidden">
                                <div className="absolute inset-0 bg-brand-cyan/5" />
                                <div>
                                    <p className="text-slate-400 text-sm uppercase tracking-wider font-bold">Engagement Score</p>
                                    <h2 className={`text-6xl font-orbitron font-bold ${getScoreColor(report.score)}`}>
                                        {report.score}<span className="text-2xl text-slate-500">/10</span>
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-1">Dominant Pattern</p>
                                    <p className="text-xl text-white font-medium flex items-center justify-end gap-2">
                                        <Users className="w-5 h-5 text-brand-cyan" />
                                        {report.pattern}
                                    </p>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="bg-gradient-to-br from-brand-cyan/10 to-blue-500/10 border border-brand-cyan/20 rounded-2xl p-6">
                                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    Engagement Boosters
                                </h3>
                                <div className="space-y-3">
                                    {report.recommendations.map((rec, i) => (
                                        <div key={i} className="flex gap-4 p-4 bg-black/40 rounded-xl border border-white/5">
                                            <Lightbulb className="w-6 h-6 text-yellow-400 shrink-0 mt-1" />
                                            <div>
                                                <p className="text-slate-200 font-bold">{rec.title}</p>
                                                <p className="text-slate-400 text-sm">{rec.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default EngagementAnalysis;
