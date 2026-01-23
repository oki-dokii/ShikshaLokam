import { useState } from "react";
import { ArrowLeft, Sparkles, TrendingUp, AlertTriangle, Activity, ArrowRight, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { predictTrainingNeed } from "@/lib/gemini";
import { toast } from "sonner";

const PredictiveTraining = () => {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({
        attendance: "",
        scores: "",
        engagement: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [prediction, setPrediction] = useState<any | null>(null);

    const handlePredict = async () => {
        if (!metrics.attendance || !metrics.scores) {
            toast.error("Please fill in the metrics first.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await predictTrainingNeed(metrics);
            setPrediction(result);
            toast.success("Prediction Complete!");
        } catch (error) {
            console.error(error);
            toast.error("Prediction failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateModule = () => {
        if (prediction?.recommendedTopic) {
            // Deep link to Generator with pre-filled topic and Cluster A (default/mock) context
            // In a real app, we'd select the relevant cluster.
            navigate('/module-generator', {
                state: {
                    prefilledTopic: prediction.recommendedTopic,
                    clusterId: "cluster-a" // Defaulting to Cluster A for demo continuity
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-[0.03] pointer-events-none" />

            {/* Background Decorative Blurs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
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
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/70">Intelligence Radar</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-outfit font-bold text-foreground tracking-tight">
                        Training Demand Predictor
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">

                {/* LEFT: Input Configuration */}
                <div className="lg:col-span-5 space-y-8 px-6 lg:px-0">
                    <div className="glass-card p-8 border-border/10 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-outfit font-bold text-foreground">Classroom Signals</h2>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pattern Input</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Attendance Trend</label>
                                <Input
                                    placeholder="e.g., Dropping by 15% this month"
                                    value={metrics.attendance}
                                    onChange={(e) => setMetrics({ ...metrics, attendance: e.target.value })}
                                    className="bg-muted/30 border-border/80 text-foreground h-12 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Test Score Trajectory</label>
                                <Input
                                    placeholder="e.g., Math stagnant, Language up"
                                    value={metrics.scores}
                                    onChange={(e) => setMetrics({ ...metrics, scores: e.target.value })}
                                    className="bg-muted/30 border-border/80 text-foreground h-12 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Engagement Observation</label>
                                <Input
                                    placeholder="e.g., Students seem distracted"
                                    value={metrics.engagement}
                                    onChange={(e) => setMetrics({ ...metrics, engagement: e.target.value })}
                                    className="bg-muted/30 border-border/80 text-foreground h-12 focus:ring-primary/20"
                                />
                            </div>

                            <Button
                                onClick={handlePredict}
                                disabled={isLoading}
                                className="w-full h-14 mt-4 shadow-xl shadow-primary/20 font-bold transition-all hover:scale-[1.01] active:scale-[0.99] gap-2 bg-primary text-primary-foreground"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Analyzing Patterns...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>Predict Optimal Training</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Output */}
                <div className="lg:col-span-7 px-6 lg:px-0 flex flex-col justify-start min-h-[500px]">
                    {prediction ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Prediction Card */}
                            <div className="glass-card p-8 border-primary/30 relative overflow-hidden shadow-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                                    <TrendingUp className="w-32 h-32 text-primary" />
                                </div>

                                <div className="flex items-center gap-2 mb-6">
                                    <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                                        Recommended Intervention
                                    </span>
                                </div>

                                <h2 className="text-3xl font-outfit font-bold text-foreground mb-4 leading-tight">
                                    {prediction.recommendedTopic}
                                </h2>

                                <p className="text-muted-foreground text-lg mb-8 leading-relaxed font-medium">
                                    {prediction.rationale}
                                </p>

                                <Button
                                    onClick={handleGenerateModule}
                                    className="w-full bg-primary text-white hover:bg-primary/90 font-bold h-16 text-lg shadow-xl shadow-primary/20 transition-all gap-3"
                                >
                                    Generate This Module Now <ArrowRight className="w-6 h-6" />
                                </Button>
                            </div>

                            {/* Risk / Preventive Card */}
                            {prediction.riskAssessment && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-[2rem] p-8 flex items-start gap-6 backdrop-blur-md"
                                >
                                    <div className="bg-red-500/20 p-4 rounded-2xl border border-red-500/30 text-red-500 shadow-lg shadow-red-500/10">
                                        <ShieldAlert className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-red-500 font-bold text-xl font-outfit">Preventive Risk Alert</h3>
                                        <p className="text-foreground/90 font-semibold text-lg leading-snug">{prediction.riskAssessment}</p>
                                        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-red-500/20 shadow-xl mt-4">
                                            <span className="text-[10px] text-red-500 uppercase font-black tracking-widest block mb-2 opacity-80">Suggested Correction</span>
                                            <p className="text-foreground font-bold leading-relaxed">{prediction.preventiveAction}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-primary/5 rounded-[2.5rem] p-12 text-center">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                                <TrendingUp className="w-12 h-12 text-primary/40" />
                            </div>
                            <h3 className="text-2xl font-outfit font-bold text-foreground mb-4">Ready to Analyze</h3>
                            <p className="text-muted-foreground max-w-sm leading-relaxed mb-4">
                                Enter classroom signals to get AI-driven predictions for the most impactful training module for your teachers.
                            </p>
                            <div className="flex gap-4 mt-4">
                                <div className="p-5 glass-card border-primary/20 shadow-2xl">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-1">Signal Types</p>
                                    <p className="text-lg font-black text-foreground">Attendance, Scores, Behavior</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default PredictiveTraining;
