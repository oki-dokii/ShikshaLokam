import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Trophy, Timer, ChevronRight,
    X, BarChart3, Star, Zap, Crown, Copy, Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import type { CourseModule, QuizParticipant } from '@/types/courseTypes';

interface LiveQuizOverlayProps {
    module: CourseModule;
    onClose: () => void;
}

const LiveQuizOverlay = ({ module, onClose }: LiveQuizOverlayProps) => {
    const [step, setStep] = useState<'lobby' | 'question' | 'leaderboard'>('lobby');
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [participants, setParticipants] = useState<QuizParticipant[]>([]);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isAnswering, setIsAnswering] = useState(true);
    const [sessionId] = useState(() => Math.random().toString(36).substr(2, 6).toUpperCase());

    const channelRef = useRef<BroadcastChannel | null>(null);
    const currentQuestion = module.quiz[currentQuestionIdx];

    // Initialize BroadcastChannel
    useEffect(() => {
        const channel = new BroadcastChannel(`quiz_${sessionId}`);
        channelRef.current = channel;

        channel.onmessage = (event) => {
            const { type, payload } = event.data;

            if (type === 'PARTICIPANT_JOINED') {
                setParticipants(prev => {
                    if (prev.find(p => p.id === payload.id)) return prev;
                    return [...prev, payload];
                });
                toast.success(`${payload.name} joined the room!`);
            } else if (type === 'PARTICIPANT_ANSWERED') {
                setParticipants(prev => prev.map(p => {
                    if (p.id === payload.id) {
                        return {
                            ...p,
                            score: p.score + payload.points,
                            lastAnsweredCorrectly: payload.correct,
                            status: 'finished'
                        };
                    }
                    return p;
                }));
            }
        };

        return () => {
            channel.postMessage({ type: 'FORCE_DISCONNECT' });
            channel.close();
        };
    }, [sessionId]);

    // Broadcast session state updates
    useEffect(() => {
        channelRef.current?.postMessage({
            type: 'SESSION_UPDATE',
            payload: {
                step,
                currentQuestion,
                questionIndex: currentQuestionIdx,
                totalQuestions: module.quiz.length,
                timeLeft
            }
        });
    }, [step, currentQuestionIdx, timeLeft, currentQuestion]);

    // Simulation: Add random participants in lobby (Now manual trigger)
    const simulateStudent = () => {
        const names = ['Arjun', 'Meera', 'Rahul', 'Sita', 'Vikram', 'Ananya', 'Sameer', 'Priya', 'Karan', 'Sneha', 'Deepak', 'Anita'];
        const newParticipant: QuizParticipant = {
            id: Math.random().toString(36).substr(2, 9),
            name: names[participants.length % names.length],
            score: 0,
            lastAnsweredCorrectly: null,
            responseTime: 0,
            status: 'joined'
        };
        setParticipants(prev => [...prev, newParticipant]);
    };

    // Timer logic for questions
    useEffect(() => {
        if (step === 'question' && isAnswering && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && isAnswering) {
            handleTimeUp();
        }
    }, [step, isAnswering, timeLeft]);

    const handleStartQuiz = () => {
        setStep('question');
        setTimeLeft(15);
        setIsAnswering(true);
    };

    const handleTimeUp = () => {
        setIsAnswering(false);

        // Simulate scoring ONLY for participants who didn't answer yet
        setParticipants(prev => prev.map(p => {
            if (p.status === 'finished') return p; // Skip real student answers

            const isCorrect = Math.random() > 0.4;
            const speed = Math.random() * 10000;
            return {
                ...p,
                score: p.score + (isCorrect ? Math.round(1000 - (speed / 10)) : 0),
                lastAnsweredCorrectly: isCorrect,
                status: 'finished'
            };
        }));

        // Auto-move to leaderboard after 3 seconds
        setTimeout(() => {
            setStep('leaderboard');
        }, 3000);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIdx < module.quiz.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setStep('question');
            setTimeLeft(15);
            setIsAnswering(true);
        } else {
            // Final leaderboard
            setStep('leaderboard');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-brand-cyan/5 blur-[120px] pointer-events-none" />

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-brand-cyan" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">{module.title}</h2>
                        <p className="text-sm text-slate-400">Live Interactive Session</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-white/10">
                        <Users className="w-4 h-4 text-brand-cyan" />
                        <span className="font-bold">{participants.length} Joined</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>
            </div>

            <main className="w-full max-w-5xl mt-20 flex-1 flex flex-col justify-center py-10 relative">
                <AnimatePresence mode="wait">
                    {step === 'lobby' && (
                        <motion.div
                            key="lobby"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="text-center space-y-12"
                        >
                            <div className="space-y-4">
                                <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-purple-500">
                                    Join the Live Quiz
                                </h1>
                                <div className="flex flex-col items-center gap-4">
                                    <p className="text-2xl text-slate-400">Entry Code: <span className="text-white font-mono tracking-widest bg-white/5 px-4 py-1 rounded-lg border border-white/10">{sessionId}</span></p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            className="border-white/10 hover:bg-white/5 text-slate-400"
                                            onClick={() => {
                                                const url = `${window.location.origin}/quiz-join/${sessionId}`;
                                                navigator.clipboard.writeText(url);
                                                toast.success('Join link copied!');
                                            }}
                                        >
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy Join Link
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="border-white/10 hover:bg-white/5 text-slate-400"
                                            onClick={() => {
                                                window.open(`${window.location.origin}/quiz-join/${sessionId}`, '_blank');
                                            }}
                                        >
                                            <LinkIcon className="w-4 h-4 mr-2" />
                                            Open Student Tab
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="border-white/10 hover:bg-white/5 text-slate-400"
                                            onClick={simulateStudent}
                                        >
                                            <Users className="w-4 h-4 mr-2" />
                                            Simulate Student
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 md:grid-cols-6 gap-6 max-w-4xl mx-auto">
                                {participants.map((p, idx) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-3xl shadow-xl">
                                            {['👨‍🏫', '👩‍🎓', '👨‍🎓', '👩‍🔬', '👨‍🎨', '👩‍💻'][idx % 6]}
                                        </div>
                                        <span className="font-medium text-slate-300">{p.name}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <Button
                                onClick={handleStartQuiz}
                                size="lg"
                                className="px-12 py-8 text-2xl font-black bg-gradient-to-r from-brand-cyan to-purple-500 hover:scale-105 transition-transform"
                            >
                                Start Quiz
                            </Button>
                        </motion.div>
                    )}

                    {step === 'question' && (
                        <motion.div
                            key="question"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            {/* Progress & Timer */}
                            <div className="flex items-center gap-8">
                                <div className="flex-1">
                                    <div className="flex justify-between mb-2 text-sm font-medium">
                                        <span className="text-slate-400">Question {currentQuestionIdx + 1} of {module.quiz.length}</span>
                                        <span className="text-brand-cyan">{Math.round((currentQuestionIdx / module.quiz.length) * 100)}% Complete</span>
                                    </div>
                                    <Progress value={(currentQuestionIdx / module.quiz.length) * 100} className="h-2 bg-slate-800" />
                                </div>
                                <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl font-black transition-colors ${timeLeft < 5 ? 'border-red-500 text-red-500 animate-pulse' : 'border-brand-cyan text-brand-cyan'}`}>
                                    {timeLeft}
                                </div>
                            </div>

                            <h2 className="text-4xl font-bold leading-tight">
                                {currentQuestion.question}
                            </h2>

                            <div className="grid grid-cols-2 gap-6">
                                {currentQuestion.options.map((option, idx) => {
                                    const isCorrect = idx === currentQuestion.correctIndex;
                                    return (
                                        <motion.div
                                            key={idx}
                                            whileHover={isAnswering ? { scale: 1.02 } : {}}
                                            className={`
                        relative p-8 rounded-3xl border-2 text-2xl font-bold transition-all
                        flex items-center gap-6 justify-between
                        ${!isAnswering
                                                    ? isCorrect
                                                        ? 'border-green-500 bg-green-500/20 text-green-400'
                                                        : 'border-white/5 bg-slate-900/50 opacity-40'
                                                    : 'border-white/10 bg-slate-900 shadow-xl hover:border-brand-cyan'
                                                }
                      `}
                                        >
                                            <div className="flex items-center gap-6">
                                                <span className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${idx === 0 ? 'bg-blue-500/20 text-blue-400' :
                                                    idx === 1 ? 'bg-orange-500/20 text-orange-400' :
                                                        idx === 2 ? 'bg-green-500/20 text-green-400' :
                                                            'bg-purple-500/20 text-purple-400'
                                                    }`}>
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                {option}
                                            </div>

                                            {!isAnswering && isCorrect && (
                                                <Star className="w-8 h-8 fill-green-400" />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {!isAnswering && (
                                <div className="flex justify-center pt-8">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex flex-col items-center gap-4"
                                    >
                                        <p className="text-slate-400 text-center italic">Everyone has finished! Moving to leaderboard...</p>
                                        <div className="flex gap-4">
                                            {currentQuestion.explanation && (
                                                <div className="bg-brand-cyan/10 border border-brand-cyan/20 p-4 rounded-xl max-w-2xl text-center">
                                                    <span className="text-brand-cyan font-bold block mb-1">PRO-TIP 💡</span>
                                                    <span className="text-slate-300">{currentQuestion.explanation}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {step === 'leaderboard' && (
                        <motion.div
                            key="leaderboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex flex-col items-center space-y-8"
                        >
                            <div className="text-center space-y-2">
                                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                                <h2 className="text-4xl font-black">Top Performers</h2>
                                <p className="text-slate-400">Scores after Question {currentQuestionIdx + 1}</p>
                            </div>

                            <div className="w-full max-w-3xl space-y-3">
                                {participants
                                    .sort((a, b) => b.score - a.score)
                                    .map((p, idx) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className={`
                        flex items-center gap-6 p-4 rounded-2xl border
                        ${idx === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/50' : 'bg-slate-900 border-white/5'}
                      `}
                                        >
                                            <div className="w-10 text-center text-2xl font-black">
                                                {idx === 0 ? <Crown className="w-6 h-6 text-yellow-500 mx-auto" /> : idx + 1}
                                            </div>
                                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                                                {['🦁', '🐯', '🦒', '🐘', '🦊', '🐢'][idx % 6]}
                                            </div>
                                            <div className="flex-1 font-bold text-xl">{p.name}</div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-brand-cyan">{p.score}</div>
                                                    <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Points</div>
                                                </div>
                                                <div className={`w-2 h-12 rounded-full ${p.lastAnsweredCorrectly ? 'bg-green-500/20 border border-green-500/50' : 'bg-slate-800'}`} />
                                            </div>
                                        </motion.div>
                                    ))
                                    .slice(0, 5)
                                }
                            </div>

                            <Button
                                onClick={handleNextQuestion}
                                size="lg"
                                className="mt-8 px-12 py-6 bg-white text-slate-950 hover:bg-slate-200 font-bold "
                            >
                                {currentQuestionIdx < module.quiz.length - 1 ? 'Next Question' : 'Finish Class'}
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Footer Stats */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-12 text-slate-500 text-sm font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    Average Speed: 2.1s
                </div>
                <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Accuracy: 78%
                </div>
            </div>
        </div>
    );
};

export default LiveQuizOverlay;
