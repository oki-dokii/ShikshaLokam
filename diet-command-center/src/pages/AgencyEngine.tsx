import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, X, Check, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analyzeDemand } from "@/lib/gemini";
import { toast } from "sonner";
import { CLUSTERS } from "@/data/mockData";
import { CHALLENGES } from "@/data/agencyChallenges";
import { TeacherProfileForm, SwipeCard, AggregationDashboard } from "@/components/agency";
import type { TeacherProfile, SwipeRecord } from "@/types/agency";

type Step = 'profile' | 'swiping' | 'analyzing' | 'results';

const AgencyEngine = () => {
    const navigate = useNavigate();

    // State
    const [step, setStep] = useState<Step>('profile');
    const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipeRecords, setSwipeRecords] = useState<SwipeRecord[]>([]);
    const [result, setResult] = useState<{ recommendedModule: string; demandProfile: string } | null>(null);

    // Current challenge
    const currentChallenge = CHALLENGES[currentIndex];
    const isFinished = currentIndex >= CHALLENGES.length;
    const progress = (currentIndex / CHALLENGES.length) * 100;

    // Handler: Profile completed
    const handleProfileComplete = (profile: TeacherProfile) => {
        setTeacherProfile(profile);
        setStep('swiping');
        toast.success("Great! Now swipe on your challenges", { icon: "👆" });
    };

    // Handler: Swipe action
    const handleSwipe = (direction: 'left' | 'right' | 'up') => {
        if (!currentChallenge || !teacherProfile) return;

        // Create swipe record
        const record: SwipeRecord = {
            challenge_id: currentChallenge.id,
            challenge_text: currentChallenge.text,
            swipe_direction: direction,
            urgency_level: direction === 'up' ? 'high' : direction === 'right' ? 'medium' : 'low',
            teacher_context: teacherProfile,
            timestamp: new Date().toISOString(),
        };

        setSwipeRecords(prev => [...prev, record]);

        // Show toast feedback
        if (direction === 'right') {
            toast.info("Added to your challenges", { duration: 800, icon: "👍" });
        } else if (direction === 'up') {
            toast.success("Marked as URGENT!", { duration: 800, icon: "🔥" });
        } else {
            toast.info("Skipped", { duration: 800, icon: "⏭️" });
        }

        // Move to next challenge
        setCurrentIndex(prev => prev + 1);
    };

    // Handler: Quick action buttons
    const handleQuickSwipe = (direction: 'left' | 'right' | 'up') => {
        handleSwipe(direction);
    };

    // Handler: Run analysis
    const runAnalysis = async () => {
        if (!teacherProfile) return;

        const selectedRecords = swipeRecords.filter(r => r.swipe_direction !== 'left');
        const urgentRecords = swipeRecords.filter(r => r.swipe_direction === 'up');

        if (selectedRecords.length === 0) {
            toast.error("You didn't select any challenges! Try again.");
            setCurrentIndex(0);
            setSwipeRecords([]);
            return;
        }

        setStep('analyzing');

        try {
            const data = await analyzeDemand({
                selectedChallenges: selectedRecords.map(r => r.challenge_text),
                urgentChallenges: urgentRecords.map(r => r.challenge_text),
                teacherContext: teacherProfile,
            });
            setResult(data);
            setStep('results');
        } catch (e) {
            toast.error("Analysis Failed. Please try again.");
            setStep('swiping');
        }
    };

    // Handler: Generate module
    const handleGenerateModule = () => {
        if (result?.recommendedModule) {
            navigate('/module-generator', {
                state: {
                    prefilledTopic: result.recommendedModule,
                    clusterId: CLUSTERS[0].id,
                }
            });
        }
    };

    // Handler: Restart
    const handleRestart = () => {
        setStep('profile');
        setTeacherProfile(null);
        setCurrentIndex(0);
        setSwipeRecords([]);
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

            {/* Header */}
            <header className="p-4 flex items-center gap-4 relative z-20">
                <Button variant="ghost" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="font-orbitron font-bold text-lg flex items-center gap-2 text-pink-500">
                        <Flame className="w-5 h-5" />
                        The Agency Engine
                    </h1>
                    <p className="text-xs text-slate-400">Demand-Driven Training</p>
                </div>

                {/* Progress indicator during swiping */}
                {step === 'swiping' && (
                    <div className="text-right">
                        <span className="text-sm text-slate-400">
                            {currentIndex}/{CHALLENGES.length}
                        </span>
                        <div className="w-24 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                <AnimatePresence mode="wait">

                    {/* Step 1: Profile Form */}
                    {step === 'profile' && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <TeacherProfileForm onComplete={handleProfileComplete} />
                        </motion.div>
                    )}

                    {/* Step 2: Swiping Cards */}
                    {step === 'swiping' && !isFinished && (
                        <motion.div
                            key="swiping"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-md"
                        >
                            {/* Instructions */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold mb-2">What holds you back?</h2>
                                <p className="text-slate-400 text-sm">
                                    Swipe <span className="text-emerald-400">RIGHT</span> if you face this •
                                    <span className="text-red-400"> LEFT</span> to skip •
                                    <span className="text-pink-400"> UP</span> if urgent
                                </p>
                            </div>

                            {/* Card Stack */}
                            <div className="relative w-full h-[380px]">
                                <AnimatePresence>
                                    {CHALLENGES.slice(currentIndex, currentIndex + 2).reverse().map((challenge, i, arr) => (
                                        <SwipeCard
                                            key={challenge.id}
                                            challenge={challenge}
                                            onSwipe={handleSwipe}
                                            isTop={i === arr.length - 1}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Quick Action Buttons */}
                            <div className="flex justify-center gap-6 mt-8">
                                <Button
                                    size="lg"
                                    className="rounded-full w-14 h-14 bg-slate-800 hover:bg-red-500/20 text-red-500 border-2 border-red-500/50 hover:border-red-500 transition-all"
                                    onClick={() => handleQuickSwipe('left')}
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                                <Button
                                    size="lg"
                                    className="rounded-full w-14 h-14 bg-slate-800 hover:bg-pink-500/20 text-pink-500 border-2 border-pink-500/50 hover:border-pink-500 transition-all"
                                    onClick={() => handleQuickSwipe('up')}
                                >
                                    <ChevronUp className="w-6 h-6" />
                                </Button>
                                <Button
                                    size="lg"
                                    className="rounded-full w-14 h-14 bg-slate-800 hover:bg-emerald-500/20 text-emerald-500 border-2 border-emerald-500/50 hover:border-emerald-500 transition-all"
                                    onClick={() => handleQuickSwipe('right')}
                                >
                                    <Check className="w-6 h-6" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2b: Swiping Complete */}
                    {step === 'swiping' && isFinished && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Flame className="w-10 h-10 text-pink-500" />
                            </div>
                            <h2 className="text-2xl font-bold">All Done!</h2>
                            <p className="text-slate-400">
                                You identified <span className="text-pink-400 font-bold">
                                    {swipeRecords.filter(r => r.swipe_direction !== 'left').length}
                                </span> challenges
                                {swipeRecords.filter(r => r.swipe_direction === 'up').length > 0 && (
                                    <>, including <span className="text-pink-500 font-bold">
                                        {swipeRecords.filter(r => r.swipe_direction === 'up').length}
                                    </span> urgent ones</>
                                )}
                            </p>
                            <Button
                                onClick={runAnalysis}
                                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold h-14 px-8 rounded-full text-lg shadow-lg shadow-pink-500/20"
                            >
                                Find My Training Solution
                            </Button>
                        </motion.div>
                    )}

                    {/* Step 3: Analyzing */}
                    {step === 'analyzing' && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-6" />
                            <h2 className="text-xl font-bold mb-2">Analyzing Your Needs...</h2>
                            <p className="text-slate-400 text-sm">AI is matching your demands to the best training</p>
                        </motion.div>
                    )}

                    {/* Step 4: Results */}
                    {step === 'results' && result && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <AggregationDashboard
                                swipeRecords={swipeRecords}
                                recommendedModule={result.recommendedModule}
                                demandProfile={result.demandProfile}
                                onGenerateModule={handleGenerateModule}
                                onRestart={handleRestart}
                            />
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
};

export default AgencyEngine;
