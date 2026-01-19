import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Send, CheckCircle2, XCircle,
    Trophy, Loader2, Zap, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { QuizQuestion, QuizParticipant } from '@/types/courseTypes';

const LiveQuizStudentView = () => {
    const { sessionId } = useParams();
    const [userName, setUserName] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [sessionState, setSessionState] = useState<{
        step: 'lobby' | 'question' | 'leaderboard' | 'finished';
        currentQuestion?: QuizQuestion;
        questionIndex: number;
        totalQuestions: number;
        timeLeft: number;
    } | null>(null);

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);

    const channelRef = useRef<BroadcastChannel | null>(null);
    const participantIdRef = useRef(Math.random().toString(36).substr(2, 9));

    // Connect to broadcast channel
    useEffect(() => {
        const channel = new BroadcastChannel(`quiz_${sessionId}`);
        channelRef.current = channel;

        channel.onmessage = (event) => {
            const { type, payload } = event.data;

            switch (type) {
                case 'SESSION_UPDATE':
                    setSessionState(payload);
                    // Reset answer state when a new question arrives
                    if (payload.step === 'question' && payload.questionIndex !== sessionState?.questionIndex) {
                        setSelectedAnswer(null);
                        setHasAnswered(false);
                        setIsCorrect(null);
                    }
                    break;
                case 'FORCE_DISCONNECT':
                    setIsJoined(false);
                    toast.error('Session closed by instructor');
                    break;
            }
        };

        return () => {
            channel.close();
        };
    }, [sessionId, sessionState?.questionIndex]);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName.trim()) return;

        setIsJoined(true);
        // Notify instructor
        channelRef.current?.postMessage({
            type: 'PARTICIPANT_JOINED',
            payload: {
                id: participantIdRef.current,
                name: userName,
                avatar: '👨‍🎓',
                score: 0,
                status: 'joined'
            }
        });
    };

    const handleAnswer = (idx: number) => {
        if (hasAnswered || !sessionState?.currentQuestion || sessionState.step !== 'question') return;

        setSelectedAnswer(idx);
        setHasAnswered(true);

        const correct = idx === sessionState.currentQuestion.correctIndex;
        setIsCorrect(correct);

        // Calculate speed bonus (very basic simulation of response time)
        const responseTime = (15 - sessionState.timeLeft) * 1000;
        const points = correct ? Math.round(1000 - (responseTime / 20)) : 0;

        if (correct) {
            setScore(prev => prev + points);
        }

        // Notify instructor
        channelRef.current?.postMessage({
            type: 'PARTICIPANT_ANSWERED',
            payload: {
                id: participantIdRef.current,
                correct,
                responseTime,
                points
            }
        });

        toast.success(correct ? 'Excellent!' : 'Nice try!');
    };

    if (!isJoined) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-brand-cyan/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Star className="w-10 h-10 text-brand-cyan fill-brand-cyan/20" />
                        </div>
                        <h1 className="text-4xl font-black">Join Live Class</h1>
                        <p className="text-slate-400">Enter your name to participate in the interactive quiz.</p>
                    </div>

                    <form onSubmit={handleJoin} className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <Input
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Your Name"
                                className="pl-12 py-6 bg-slate-900 border-white/10 text-xl focus:ring-brand-cyan"
                                autoFocus
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full py-8 text-xl font-bold bg-brand-cyan text-brand-dark hover:bg-cyan-400"
                        >
                            Join Session
                        </Button>
                    </form>

                    <p className="text-xs text-slate-500 uppercase tracking-widest">Powered by ShikshaLokam DIET</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col p-6 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-cyan flex items-center justify-center text-brand-dark font-black">
                        {userName[0].toUpperCase()}
                    </div>
                    <span className="font-bold">{userName}</span>
                </div>
                <div className="px-4 py-1.5 bg-slate-900 rounded-full border border-white/10 text-brand-cyan font-bold">
                    {score} pts
                </div>
            </div>

            <main className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    {!sessionState || sessionState.step === 'lobby' ? (
                        <motion.div
                            key="waiting"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center space-y-6"
                        >
                            <Loader2 className="w-16 h-16 text-brand-cyan animate-spin mx-auto" />
                            <h2 className="text-2xl font-bold text-slate-300">Wait for instructor to start...</h2>
                            <p className="text-slate-500 italic">You're in! Watch the big screen.</p>
                        </motion.div>
                    ) : sessionState.step === 'question' ? (
                        <motion.div
                            key="question"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-slate-500">
                                <span>Question {sessionState.questionIndex + 1} / {sessionState.totalQuestions}</span>
                                <span className={sessionState.timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-brand-cyan'}>
                                    0:{sessionState.timeLeft.toString().padStart(2, '0')}
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold leading-tight">
                                {sessionState.currentQuestion?.question}
                            </h2>

                            <div className="grid grid-cols-1 gap-4">
                                {sessionState.currentQuestion?.options.map((option, idx) => {
                                    const isSelected = selectedAnswer === idx;
                                    return (
                                        <motion.button
                                            key={idx}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAnswer(idx)}
                                            disabled={hasAnswered}
                                            className={`
                        relative p-6 rounded-2xl border-2 text-left font-bold transition-all
                        flex items-center gap-4
                        ${hasAnswered
                                                    ? isSelected
                                                        ? isCorrect ? 'border-green-500 bg-green-500/20' : 'border-red-500 bg-red-500/20'
                                                        : 'border-white/5 bg-slate-900/50 opacity-50'
                                                    : 'border-white/10 bg-slate-900 active:border-brand-cyan'
                                                }
                      `}
                                        >
                                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${idx === 0 ? 'bg-blue-500/20 text-blue-400' :
                                                    idx === 1 ? 'bg-orange-500/20 text-orange-400' :
                                                        idx === 2 ? 'bg-green-500/20 text-green-400' :
                                                            'bg-purple-500/20 text-purple-400'
                                                }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span className="flex-1">{option}</span>
                                            {hasAnswered && isSelected && (
                                                isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {hasAnswered && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-4 bg-slate-900/50 rounded-2xl border border-white/5"
                                >
                                    <p className="text-slate-400 text-sm mb-1 uppercase tracking-widest font-bold">Answer Submitted</p>
                                    <p className="text-white font-medium">Watch the leaderboard!</p>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="leaderboard"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8"
                        >
                            <Trophy className="w-20 h-20 text-yellow-500 mx-auto" />
                            <div>
                                <h2 className="text-3xl font-black">How did you do?</h2>
                                <p className="text-slate-400 mt-2 text-lg">Check the instructor's screen for your rank!</p>
                            </div>

                            <div className="flex justify-center gap-8 pt-8">
                                <div className="flex flex-col items-center">
                                    <Star className="w-8 h-8 text-brand-cyan mb-2" />
                                    <span className="text-slate-500 text-xs uppercase font-bold">Current Rank</span>
                                    <span className="text-2xl font-black text-white">#--</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Zap className="w-8 h-8 text-orange-500 mb-2" />
                                    <span className="text-slate-500 text-xs uppercase font-bold">Total Pts</span>
                                    <span className="text-2xl font-black text-white">{score}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <footer className="mt-auto py-4 text-center">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Interactive Classroom Mode</p>
            </footer>
        </div>
    );
};

export default LiveQuizStudentView;
