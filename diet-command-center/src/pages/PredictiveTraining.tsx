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
            navigate('/module-generator', {
                state: {
                    prefilledTopic: prediction.recommendedTopic,
                    clusterId: "cluster-a"
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            {/* Header */}
            <header className="flex items-center gap-4 mb-8 max-w-6xl mx-auto">
                <Button variant="ghost" onClick={() => navigate('/heatmap')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        Predictive Training Engine
                    </h1>
                    <p className="text-sm text-muted-foreground">Forecast training needs & prevent risks</p>
                </div>
            </header>

            <main className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">

                {/* Input Section */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            Input Classroom Signals
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-muted-foreground mb-1 block font-medium">Attendance Trend</label>
                                <Input
                                    placeholder="e.g., Dropping by 15% this month"
                                    value={metrics.attendance}
                                    onChange={(e) => setMetrics({ ...metrics, attendance: e.target.value })}
                                    className="bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground mb-1 block font-medium">Test Score Trajectory</label>
                                <Input
                                    placeholder="e.g., Math scores stagnant, Language improving"
                                    value={metrics.scores}
                                    onChange={(e) => setMetrics({ ...metrics, scores: e.target.value })}
                                    className="bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground mb-1 block font-medium">Engagement Observation</label>
                                <Input
                                    placeholder="e.g., Students seem distracted in afternoon"
                                    value={metrics.engagement}
                                    onChange={(e) => setMetrics({ ...metrics, engagement: e.target.value })}
                                    className="bg-background"
                                />
                            </div>

                            <Button
                                onClick={handlePredict}
                                disabled={isLoading}
                                className="w-full h-12 mt-4"
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
                            <div className="bg-card border-2 border-primary/30 rounded-xl p-8 shadow-sm">
                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4 border border-primary/30">
                                    RECOMMENDED INTERVENTION
                                </span>

                                <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                                    {prediction.recommendedTopic}
                                </h2>

                                <p className="text-muted-foreground text-base mb-8 leading-relaxed">
                                    {prediction.rationale}
                                </p>

                                <Button
                                    onClick={handleGenerateModule}
                                    className="w-full h-14 text-base"
                                >
                                    Generate This Module Now <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>

                            {/* Risk / Preventive Card */}
                            {prediction.riskAssessment && (
                                <div className="bg-destructive/5 border-2 border-destructive/30 rounded-xl p-6 flex items-start gap-4">
                                    <div className="bg-destructive/10 p-3 rounded-xl border border-destructive/30">
                                        <ShieldAlert className="w-8 h-8 text-destructive" />
                                    </div>
                                    <div>
                                        <h3 className="text-destructive font-semibold text-lg mb-1">Preventive Risk Alert</h3>
                                        <p className="text-foreground font-medium mb-2">{prediction.riskAssessment}</p>
                                        <div className="bg-card p-3 rounded-lg border border-border">
                                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium block mb-1">Suggested Action</span>
                                            <p className="text-sm text-foreground">{prediction.preventiveAction}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    ) : (
                        <div className="text-center text-muted-foreground border-2 border-dashed border-border rounded-xl p-12">
                            <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-semibold">Ready to Analyze</h3>
                            <p className="max-w-xs mx-auto mt-2 text-sm">Enter your classroom data to get AI-driven predictions for the most impactful training module.</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default PredictiveTraining;
