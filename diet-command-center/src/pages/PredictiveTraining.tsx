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
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

            {/* Header */}
            <header className="flex items-center gap-4 mb-8 relative z-10">
                <Button variant="ghost" onClick={() => navigate('/heatmap')} className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-brand-cyan" />
                        Just-in-Time Accuracy Engine
                    </h1>
                    <p className="text-sm text-slate-400">Predictive Training Needs & Risk Prevention</p>
                </div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto relative z-10">

                {/* Input Section */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Input Classroom Signals
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Attendance Trend</label>
                                <Input
                                    placeholder="e.g., Dropping by 15% this month"
                                    value={metrics.attendance}
                                    onChange={(e) => setMetrics({ ...metrics, attendance: e.target.value })}
                                    className="bg-slate-950 border-white/10 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Test Score Trajectory</label>
                                <Input
                                    placeholder="e.g., Math scores stagnant, Language improving"
                                    value={metrics.scores}
                                    onChange={(e) => setMetrics({ ...metrics, scores: e.target.value })}
                                    className="bg-slate-950 border-white/10 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Engagement Observation</label>
                                <Input
                                    placeholder="e.g., Students seem distracted in afternoon"
                                    value={metrics.engagement}
                                    onChange={(e) => setMetrics({ ...metrics, engagement: e.target.value })}
                                    className="bg-slate-950 border-white/10 text-white"
                                />
                            </div>

                            <Button
                                onClick={handlePredict}
                                disabled={isLoading}
                                className="w-full h-12 mt-4 bg-gradient-to-r from-brand-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-white border-0"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">Analyzing Patterns...</span>
                                ) : (
                                    <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Predict Optimal Training</span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Output Section */}
                <div className="flex flex-col justify-center">
                    {prediction ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            {/* Prediction Card */}
                            <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-brand-cyan/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-4 opacity-50">
                                    <Sparkles className="w-24 h-24 text-brand-cyan blur-2xl" />
                                </div>

                                <span className="inline-block px-3 py-1 bg-brand-cyan/20 text-cyan-400 text-xs font-bold rounded-full mb-4 border border-brand-cyan/30">
                                    RECOMMENDED INTERVENTION
                                </span>

                                <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                                    {prediction.recommendedTopic}
                                </h2>

                                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                    {prediction.rationale}
                                </p>

                                <Button
                                    onClick={handleGenerateModule}
                                    className="w-full bg-white text-brand-dark hover:bg-slate-200 font-bold h-14 text-lg shadow-lg hover:shadow-cyan-500/20 transition-all"
                                >
                                    Generate This Module Now <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>

                            {/* Risk / Preventive Card */}
                            {prediction.riskAssessment && (
                                <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-6 flex items-start gap-4">
                                    <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/30">
                                        <ShieldAlert className="w-8 h-8 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-red-400 font-bold text-lg mb-1">Preventive Risk Alert</h3>
                                        <p className="text-white font-medium mb-2">{prediction.riskAssessment}</p>
                                        <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold block mb-1">Suggested Interactive Action</span>
                                            <p className="text-sm text-slate-200">{prediction.preventiveAction}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    ) : (
                        <div className="text-center text-slate-500 border-2 border-dashed border-white/5 rounded-2xl p-12">
                            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-medium">Ready to Analyze</h3>
                            <p className="max-w-xs mx-auto mt-2">Enter your classroom data to get AI-driven predictions for the most impactful training module.</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default PredictiveTraining;
