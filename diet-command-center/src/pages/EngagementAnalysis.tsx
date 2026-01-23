import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart2, Activity, Zap, Users, Lightbulb, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeSessionEngagement } from "@/lib/gemini";
import { motion, AnimatePresence } from "framer-motion";

const EngagementAnalysis = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<{ score: number, pattern: string, recommendations: { title: string, description: string }[] } | null>(null);

    const handleAnalyze = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        try {
            const result = await analyzeSessionEngagement(input);
            setReport(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return "text-emerald-500";
        if (score >= 5) return "text-amber-500";
        return "text-destructive";
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-inter selection:bg-primary/20">
            {/* Background Accents */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            <header className="relative z-10 px-6 py-8 flex items-center gap-6 max-w-7xl mx-auto">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/')}
                    className="rounded-full hover:bg-primary/10 text-muted-foreground transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/70">Coaching Tool</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-outfit font-bold text-foreground tracking-tight">
                        Daily Session Reflection
                    </h1>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Input Area */}
                    <div className="lg:col-span-5 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-8 border-primary/10 shadow-xl shadow-primary/5"
                        >
                            <div className="mb-6">
                                <h2 className="text-xl font-outfit font-bold text-foreground mb-2">How was your class today?</h2>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Describe the dynamics, student reactions, and any challenges you faced. Our AI will analyze the "pulse" of your session.
                                </p>
                            </div>

                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="e.g., Today's science class started well, but students got restless during the experiment phase. They seemed confused about the instructions..."
                                className="w-full h-80 bg-muted/30 dark:bg-black/20 border border-border/50 rounded-2xl p-5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-inner font-inter leading-relaxed"
                            />

                            <Button
                                onClick={handleAnalyze}
                                disabled={isLoading || !input.trim()}
                                className="w-full mt-6 py-7 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Analyzing Session...</span>
                                    </div>
                                ) : "Generate Insights"}
                            </Button>
                        </motion.div>

                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 text-sm italic text-muted-foreground">
                            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                            <p>Tip: Mention specific behaviors or student names for more personalized suggestions.</p>
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {!report && !isLoading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 glass-card border-dashed border-2 border-muted"
                                >
                                    <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                                        <BarChart2 className="w-10 h-10 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-outfit font-bold text-foreground mb-2">Session Pulse Awaiting Data</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                        Your classroom insights and engagement boosters will appear here once you describe your session.
                                    </p>
                                </motion.div>
                            ) : isLoading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-6"
                                >
                                    <div className="relative">
                                        <div className="w-24 h-24 border-4 border-primary/10 rounded-full" />
                                        <div className="absolute inset-0 w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                        <Activity className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-outfit font-bold text-foreground">Processing Reflection</p>
                                        <p className="text-muted-foreground animate-pulse text-sm">Measuring classroom dynamics...</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="glass-card p-8 border-primary/10 shadow-lg">
                                            <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest mb-4">Engagement Pulse</p>
                                            <div className="flex items-baseline gap-2">
                                                <h2 className={`text-6xl font-outfit font-black ${getScoreColor(report.score)}`}>
                                                    {report.score}
                                                </h2>
                                                <span className="text-2xl text-muted-foreground font-bold">/10</span>
                                            </div>
                                            <div className="mt-4 w-full h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${report.score >= 8 ? 'bg-emerald-500' : report.score >= 5 ? 'bg-amber-500' : 'bg-destructive'}`}
                                                    style={{ width: `${report.score * 10}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="glass-card p-8 border-primary/10 shadow-lg">
                                            <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest mb-4">Classroom Vibe</p>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Users className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xl font-outfit font-bold text-foreground">{report.pattern}</p>
                                                    <p className="text-xs text-muted-foreground">Dominant session pattern</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recommendations */}
                                    <div className="glass-card p-8 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4">
                                            <Zap className="w-8 h-8 text-amber-500/20" />
                                        </div>
                                        <h3 className="text-xl font-outfit font-bold text-foreground mb-6 flex items-center gap-3">
                                            <Zap className="w-6 h-6 text-amber-500" />
                                            Actionable Engagement Boosters
                                        </h3>
                                        <div className="space-y-4">
                                            {report.recommendations.map((rec, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="group flex gap-5 p-5 bg-muted/20 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-2xl hover:bg-white/10 dark:hover:bg-white/10 transition-all hover:shadow-md"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                        <Lightbulb className="w-5 h-5 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-foreground font-bold mb-1">{rec.title}</p>
                                                        <p className="text-muted-foreground text-sm leading-relaxed">{rec.description}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full py-6 rounded-2xl border-primary/20 hover:bg-primary/5 text-primary"
                                        onClick={() => {
                                            setReport(null);
                                            setInput("");
                                        }}
                                    >
                                        Start New Reflection
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EngagementAnalysis;
