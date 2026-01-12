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
        <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden font-sans selection:bg-cyan-500/30">
            {/* Urgent/Live Mode Aesthetic */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-cyan-500 animate-pulse" />

            <header className="p-4 flex items-center gap-4 z-10">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-white/10 text-white">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                    <h1 className="font-bold text-xl uppercase tracking-widest text-red-500">Live Pulse</h1>
                </div>
            </header>

            <main className="flex-1 max-w-lg mx-auto w-full p-6 flex flex-col justify-center relative z-10">

                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-black text-white">What's happening?</h2>
                                <p className="text-slate-400">Tap a quick situation or type your own.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {QUICK_ACTIONS.map(action => (
                                    <button
                                        key={action}
                                        onClick={() => {
                                            setInput(action);
                                            handleAnalyze(action);
                                        }}
                                        className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-left font-medium text-lg flex items-center justify-between group"
                                    >
                                        {action}
                                        <Activity className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Or type specifics..."
                                    className="w-full bg-black border-b-2 border-slate-700 p-4 text-xl focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                                />
                                <Button
                                    className="absolute right-0 bottom-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold uppercase tracking-wider"
                                    onClick={() => handleAnalyze()}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Analyzing..." : "Fix It"}
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6 text-center"
                        >
                            <div className="w-20 h-20 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center border-2 border-cyan-500 mb-6">
                                <Zap className="w-10 h-10 text-cyan-400" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest">Immediate Intervention</h3>
                                <h2 className="text-4xl md:text-5xl font-black leading-tight text-white drop-shadow-lg">
                                    "{result.action}"
                                </h2>
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 mx-auto max-w-sm">
                                <p className="text-slate-400 text-sm font-mono uppercase mb-2">Why this works</p>
                                <p className="text-lg text-slate-200">{result.reason}</p>
                            </div>

                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => setResult(null)}
                                className="mt-8 border-slate-700 hover:bg-white hover:text-black transition-colors rounded-full"
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
