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
        if (score >= 8) return "text-secondary";
        if (score >= 5) return "text-accent";
        return "text-destructive";
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <header className="flex items-center gap-4 mb-8 max-w-6xl mx-auto">
                <Button variant="ghost" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Activity className="w-6 h-6 text-primary" />
                        Learner Engagement Tracker
                    </h1>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Input Section */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">Session Reflection</h2>
                        <p className="text-muted-foreground text-sm">Describe today's class dynamics. Was it quiet? chaotic? interactive?</p>
                    </div>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., I taught about gravity. Students listened quietly but didn't ask many questions. A few backbenchers were distracted..."
                        className="w-full h-64 bg-background border border-border rounded-xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />

                    <Button
                        onClick={handleAnalyze}
                        disabled={isLoading || !input.trim()}
                        className="w-full py-6 text-base"
                    >
                        {isLoading ? "Analyzing Dynamics..." : "Analyze Engagement"}
                    </Button>
                </div>

                {/* Output Section */}
                <div className="space-y-6">
                    {!report && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl p-12">
                            <BarChart2 className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-base">Engagement Metrics will appear here</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                            <p className="text-primary">Measuring classroom vibe...</p>
                        </div>
                    )}

                    {report && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            {/* Score Card */}
                            <div className="bg-card border-2 border-border rounded-xl p-8 flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium mb-1">Engagement Score</p>
                                    <h2 className={`text-6xl font-bold ${getScoreColor(report.score)}`}>
                                        {report.score}<span className="text-2xl text-muted-foreground">/10</span>
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-muted-foreground text-sm font-medium mb-1">Dominant Pattern</p>
                                    <p className="text-xl text-foreground font-semibold flex items-center justify-end gap-2">
                                        <Users className="w-5 h-5 text-primary" />
                                        {report.pattern}
                                    </p>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="bg-primary/5 border-2 border-primary/30 rounded-xl p-6">
                                <h3 className="text-foreground font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-primary" />
                                    Engagement Boosters
                                </h3>
                                <div className="space-y-3">
                                    {report.recommendations.map((rec, i) => (
                                        <div key={i} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                                            <Lightbulb className="w-6 h-6 text-accent shrink-0 mt-1" />
                                            <div>
                                                <p className="text-foreground font-semibold">{rec.title}</p>
                                                <p className="text-muted-foreground text-sm">{rec.description}</p>
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
