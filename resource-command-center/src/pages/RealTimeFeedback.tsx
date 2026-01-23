import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Activity, AlertCircle, Sparkles, Send, CheckCircle2 } from "lucide-react";
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

        try {
            const data = await generateInstantFeedback(text);
            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-inter selection:bg-destructive/20 overflow-hidden">
            {/* Background Red/Urgency Pulse */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-destructive via-amber-500 to-primary animate-pulse z-50" />
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-destructive/5 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <header className="relative z-10 px-6 py-8 flex items-center gap-6 max-w-5xl mx-auto">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/')}
                    className="rounded-full hover:bg-destructive/10 text-muted-foreground transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-destructive animate-pulse" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-destructive/70">Urgent Support</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-outfit font-bold text-foreground tracking-tight">
                        Live Pulse Advisor
                    </h1>
                </div>
            </header>

            <main className="relative z-10 flex-1 max-w-2xl mx-auto w-full px-6 pb-20 flex flex-col justify-center min-h-[70vh]">

                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="input-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-10"
                        >
                            <div className="text-center space-y-3">
                                <h2 className="text-3xl md:text-4xl font-outfit font-black text-foreground leading-tight">
                                    Quick, what's wrong?
                                </h2>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    Tap a common classroom hurdle or describe the situation for an instant fix.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {QUICK_ACTIONS.map((action, i) => (
                                    <motion.div
                                        key={action}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setInput(action);
                                                handleAnalyze(action);
                                            }}
                                            className="w-full h-auto p-5 justify-between bg-white/50 border-border/50 hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive group rounded-2xl transition-all shadow-sm"
                                        >
                                            <span className="text-lg font-bold">{action}</span>
                                            <Zap className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all text-amber-500" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="relative glass-card p-6 border-primary/10 shadow-xl shadow-primary/5">
                                <div className="flex gap-4 items-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold">Describe the situation</h3>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="e.g., Everyone is talking at once..."
                                        className="w-full bg-background border-2 border-border/50 rounded-2xl py-4 pl-6 pr-16 text-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                                    />
                                    <Button
                                        size="icon"
                                        className="absolute right-2 top-2 w-12 h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                        onClick={() => handleAnalyze()}
                                        disabled={isLoading || !input.trim()}
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result-view"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <div className="glass-card p-10 border-destructive/20 shadow-2xl relative overflow-hidden text-center">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Zap className="w-20 h-20 text-destructive" />
                                </div>

                                <div className="w-24 h-24 mx-auto bg-destructive/10 rounded-full flex items-center justify-center border-4 border-destructive/20 mb-8">
                                    <Zap className="w-12 h-12 text-destructive animate-pulse" />
                                </div>

                                <div className="space-y-4 mb-10">
                                    <h3 className="text-xs font-black text-destructive uppercase tracking-[0.3em]">Urgent Strategy</h3>
                                    <h2 className="text-4xl md:text-5xl font-outfit font-black leading-tight text-foreground">
                                        "{result.action}"
                                    </h2>
                                </div>

                                <div className="bg-muted p-8 rounded-3xl border border-border/50 mx-auto max-w-md relative group">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-background border border-border/50 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <AlertCircle className="w-3 h-3 text-amber-500" />
                                        The Logic
                                    </div>
                                    <p className="text-lg text-muted-foreground leading-relaxed italic">
                                        {result.reason}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setResult(null)}
                                    className="flex-1 w-full h-16 rounded-2xl border-border/50 hover:bg-muted text-lg font-bold transition-all"
                                >
                                    New Pulse Check
                                </Button>
                                <Button
                                    size="lg"
                                    onClick={() => {
                                        // Potential future action: Mark as solved
                                        setResult(null);
                                        navigate('/');
                                    }}
                                    className="flex-1 w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold shadow-lg shadow-emerald-500/20 gap-3"
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                    I've Got It
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>

            <footer className="relative z-10 px-6 py-10 text-center opacity-50">
                <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                    Evidence-Based Interventions • ShikshaLokam
                </p>
            </footer>
        </div>
    );
};

export default RealTimeFeedback;
