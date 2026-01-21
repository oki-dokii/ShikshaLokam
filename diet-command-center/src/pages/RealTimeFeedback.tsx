import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateInstantFeedback } from "@/lib/gemini";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_ACTIONS = [
    "Students look bored",
    "Too much noise",
    "They don't understand",
    "I'm losing control",
    "Energy is flat"
];

const RealTimeFeedback = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ action: string, reason: string } | null>(null);

    const handleAnalyze = async (text: string = input) => {
        if (!text.trim()) return;
        setIsLoading(true);
        setResult(null);

        const data = await generateInstantFeedback(text);
        setResult(data);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="p-6 flex items-center gap-4 border-b border-border">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className="flex items-center gap-2">
                    <Activity className="w-6 h-6 text-primary" />
                    <h1 className="font-bold text-xl text-foreground">Live Pulse</h1>
                </div>
            </header>

            <main className="flex-1 max-w-lg mx-auto w-full p-6 flex flex-col justify-center">

                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-bold text-foreground">What's happening?</h2>
                                <p className="text-muted-foreground">Tap a quick situation or type your own.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {QUICK_ACTIONS.map(action => (
                                    <button
                                        key={action}
                                        onClick={() => {
                                            setInput(action);
                                            handleAnalyze(action);
                                        }}
                                        className="p-4 rounded-lg bg-card border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left font-medium text-base flex items-center justify-between group"
                                    >
                                        <span className="text-foreground">{action}</span>
                                        <Activity className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Or type specifics..."
                                    className="w-full bg-background border-2 border-border rounded-lg p-4 text-base focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                                />
                                <Button
                                    className="absolute right-2 top-2"
                                    onClick={() => handleAnalyze()}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Analyzing..." : "Get Help"}
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6 text-center"
                        >
                            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary mb-6">
                                <Zap className="w-10 h-10 text-primary" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Immediate Intervention</h3>
                                <h2 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
                                    "{result.action}"
                                </h2>
                            </div>

                            <div className="bg-card p-6 rounded-xl border border-border mx-auto max-w-sm">
                                <p className="text-muted-foreground text-sm font-medium uppercase mb-2">Why this works</p>
                                <p className="text-base text-foreground">{result.reason}</p>
                            </div>

                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => setResult(null)}
                                className="mt-8"
                            >
                                New Pulse Check
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
};

export default RealTimeFeedback;
