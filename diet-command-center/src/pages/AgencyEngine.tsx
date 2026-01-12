import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyzeDemand } from "@/lib/gemini";
import { toast } from "sonner";
import { CLUSTERS } from "@/data/mockData";

const CHALLENGES = [
    { id: 1, text: "Students leave for harvest season", category: "attendance" },
    { id: 2, text: "No electricity for digital aids", category: "infrastructure" },
    { id: 3, text: "Multi-grade (Grades 1-5 in one room)", category: "management" },
    { id: 4, text: "Parents don't attend meetings", category: "community" },
    { id: 5, text: "Lack of Science Lab equipment", category: "resources" },
    { id: 6, text: "Students struggling with English fluency", category: "learning" },
];

const AgencyEngine = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Card Stack Logic
    const currentCard = CHALLENGES[currentIndex];
    const isFinished = currentIndex >= CHALLENGES.length;

    const handleSwipe = (direction: "left" | "right") => {
        if (direction === "right") {
            setSelectedChallenges(prev => [...prev, currentCard.text]);
            toast.info("Added to your challenges", { duration: 1000, icon: "👍" });
        } else {
            toast.info("Skipped", { duration: 1000, icon: "👎" });
        }
        setCurrentIndex(prev => prev + 1);
    };

    const runAnalysis = async () => {
        if (selectedChallenges.length === 0) {
            toast.error("You didn't select any challenges! Try again.");
            setCurrentIndex(0);
            return;
        }

        setIsAnalyzing(true);
        try {
            const data = await analyzeDemand(selectedChallenges);
            setResult(data);
        } catch (e) {
            toast.error("Analysis Failed");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerate = () => {
        if (result?.recommendedModule) {
            navigate('/module-generator', {
                state: {
                    prefilledTopic: result.recommendedModule,
                    clusterId: CLUSTERS[0].id
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

            {/* Header */}
            <header className="p-4 flex items-center gap-4 relative z-20">
                <Button variant="ghost" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="font-orbitron font-bold text-lg flex items-center gap-2 text-pink-500">
                        <Flame className="w-5 h-5" />
                        The Agency Engine
                    </h1>
                    <p className="text-xs text-slate-400">Demand-Driven Training</p>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">

                {!isFinished && !result && (
                    <div className="max-w-md w-full text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">What holds you back?</h2>
                        <p className="text-slate-400">Swipe Right if you face this issue. Swipe Left if you don't.</p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {!isFinished ? (
                        <motion.div
                            key={currentCard.id}
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 1.1, opacity: 0, x: 200 }} // Simple exit animation
                            className="bg-slate-900 border border-white/10 w-full max-w-sm aspect-[3/4] rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl relative"
                        >
                            <span className="bg-white/5 text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                                {currentCard.category}
                            </span>
                            <h3 className="text-3xl font-bold text-center leading-tight mb-8">
                                {currentCard.text}
                            </h3>

                            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-12">
                                <Button
                                    size="lg"
                                    className="rounded-full w-16 h-16 bg-slate-800 hover:bg-red-500/20 text-red-500 border-2 border-red-500/50 hover:border-red-500 transition-all"
                                    onClick={() => handleSwipe("left")}
                                >
                                    <X className="w-8 h-8" />
                                </Button>
                                <Button
                                    size="lg"
                                    className="rounded-full w-16 h-16 bg-slate-800 hover:bg-green-500/20 text-green-500 border-2 border-green-500/50 hover:border-green-500 transition-all"
                                    onClick={() => handleSwipe("right")}
                                >
                                    <Check className="w-8 h-8" />
                                </Button>
                            </div>
                        </motion.div>
                    ) : !result ? (
                        <div className="text-center space-y-6">
                            <h2 className="text-2xl font-bold">All Done!</h2>
                            <p className="text-slate-400">You identified {selectedChallenges.length} specific challenges.</p>
                            <Button
                                onClick={runAnalysis}
                                disabled={isAnalyzing}
                                className="bg-pink-500 hover:bg-pink-600 text-white font-bold h-14 px-8 rounded-full text-lg shadow-lg shadow-pink-500/20"
                            >
                                {isAnalyzing ? "Analyzing Demand..." : "Find My Training Solution"}
                            </Button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 p-8 rounded-3xl max-w-lg w-full relative"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <Flame className="w-24 h-24 text-pink-500" />
                            </div>
                            <h3 className="text-pink-400 font-mono text-xs uppercase tracking-widest mb-2">Demand Profile Match</h3>
                            <h2 className="text-3xl font-bold text-white mb-4">
                                {result.recommendedModule}
                            </h2>
                            <p className="text-slate-300 text-lg mb-8 italic">
                                "{result.demandProfile}"
                            </p>

                            <div className="bg-black/30 p-4 rounded-xl mb-6">
                                <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Addressing your needs:</h4>
                                <ul className="text-sm text-slate-300 space-y-1">
                                    {selectedChallenges.map((c, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-green-500 mt-0.5" /> {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                onClick={handleGenerate}
                                className="w-full bg-white text-pink-600 hover:bg-pink-50 font-bold h-14 text-lg"
                            >
                                Generate Module Now <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
};

export default AgencyEngine;
