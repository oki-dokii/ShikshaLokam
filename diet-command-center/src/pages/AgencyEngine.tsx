import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, X, Check, ChevronUp, Sparkles } from "lucide-react";
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
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-[0.03] pointer-events-none" />

            {/* Background Decorative Blurs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="relative z-20 px-6 py-6 flex items-center gap-6 max-w-7xl mx-auto w-full">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/')}
                    className="rounded-full hover:bg-pink-50 text-muted-foreground transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Flame className="w-4 h-4 text-pink-500" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-pink-600/70">Demand Intelligence</span>
                    </div>
                    <h1 className="text-xl md:text-2xl font-outfit font-bold text-foreground flex items-center gap-2 tracking-tight">
                        The Agency Engine
                    </h1>
                </div>

                {/* Progress indicator during swiping */}
                {step === 'swiping' && (
                    <div className="text-right hidden md:block">
                        <div className="flex items-center gap-3 mb-1 justify-end">
                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Pulse Gauge</span>
                            <span className="text-sm font-bold text-pink-600">
                                {currentIndex}/{CHALLENGES.length}
                            </span>
                        </div>
                        <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden border border-border/20">
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
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-outfit font-bold text-foreground mb-3 tracking-tight">What holds you back?</h2>
                                <p className="text-muted-foreground font-medium flex items-center justify-center gap-3 text-sm">
                                    <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">Right → Face this</span>
                                    <span className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 rounded-md border border-red-100">Left ← Skip</span>
                                    <span className="flex items-center gap-1.5 px-2 py-1 bg-pink-50 text-pink-600 rounded-md border border-pink-100">Up ↑ Urgent</span>
                                </p>
                            </div>

                            {/* Card Stack */}
                            <div className="relative w-full h-[420px] mb-4">
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
                            <div className="flex justify-center gap-8 mt-12 relative z-20">
                                <Button
                                    size="lg"
                                    className="rounded-full w-16 h-16 bg-white hover:bg-red-50 text-red-500 border-2 border-border/80 hover:border-red-500 shadow-xl shadow-red-500/5 transition-all group active:scale-95"
                                    onClick={() => handleQuickSwipe('left')}
                                >
                                    <X className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                </Button>
                                <Button
                                    size="lg"
                                    className="rounded-full w-16 h-16 bg-white hover:bg-pink-50 text-pink-500 border-2 border-border/80 hover:border-pink-500 shadow-xl shadow-pink-500/5 transition-all group active:scale-95"
                                    onClick={() => handleQuickSwipe('up')}
                                >
                                    <ChevronUp className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                </Button>
                                <Button
                                    size="lg"
                                    className="rounded-full w-16 h-16 bg-white hover:bg-emerald-50 text-emerald-500 border-2 border-border/80 hover:border-emerald-500 shadow-xl shadow-emerald-500/5 transition-all group active:scale-95"
                                    onClick={() => handleQuickSwipe('right')}
                                >
                                    <Check className="w-8 h-8 group-hover:scale-110 transition-transform" />
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
                            className="text-center space-y-8"
                        >
                            <div className="w-24 h-24 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-pink-500/20 shadow-inner">
                                <Flame className="w-12 h-12 text-pink-500" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-outfit font-bold text-foreground mb-3">Profile Mapped</h2>
                                <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto leading-relaxed">
                                    You have identified <span className="text-pink-600 font-black">
                                        {swipeRecords.filter(r => r.swipe_direction !== 'left').length}
                                    </span> core challenges,
                                    {swipeRecords.filter(r => r.swipe_direction === 'up').length > 0 && (
                                        <> including <span className="text-pink-500 font-black">
                                            {swipeRecords.filter(r => r.swipe_direction === 'up').length}
                                        </span> urgent priorities.</>
                                    )}
                                </p>
                            </div>
                            <Button
                                onClick={runAnalysis}
                                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold h-16 px-12 rounded-2xl text-xl shadow-2xl shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
                            >
                                <Sparkles className="w-6 h-6" />
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
                            className="text-center p-12 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-border/40 shadow-2xl"
                        >
                            <div className="w-24 h-24 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin mx-auto mb-8 shadow-inner" />
                            <h2 className="text-2xl font-outfit font-bold text-foreground mb-3">Synthesizing Demand...</h2>
                            <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-xs mx-auto">
                                AI is mapping your specific challenges to an optimal pedagogical intervention.
                            </p>
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
