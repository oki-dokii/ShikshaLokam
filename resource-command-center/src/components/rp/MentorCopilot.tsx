import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Mic,
    Square,
    Play,
    Bot,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Send,
    Sparkles,
    Trophy,
    Target,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateObservationReport } from '@/lib/rpAnalytics';

interface MentorCopilotProps {
    onClose: () => void;
}

export const MentorCopilot = ({ onClose }: MentorCopilotProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [status, setStatus] = useState<'idle' | 'recording' | 'analyzing' | 'done'>('idle');
    const [report, setReport] = useState<any>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startRecording = () => {
        setIsRecording(true);
        setStatus('recording');
        setRecordingTime(0);
    };

    const stopRecording = async () => {
        setIsRecording(false);
        setStatus('analyzing');

        // Simulate complex AI analysis delay
        setTimeout(async () => {
            const result = await generateObservationReport("Sample classroom transcript...");
            setReport(result);
            setStatus('done');
        }, 2500);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-slate-900 border border-white/10 w-full max-w-4xl h-[80vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center">
                            <Mic className="w-6 h-6 text-brand-blue" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Mentor Copilot</h3>
                            <p className="text-xs text-slate-400 font-orbitron tracking-widest">AI CLASSROOM MONITOR</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                <div className="flex-1 overflow-hidden flex">
                    {/* Left Panel: Controls */}
                    <div className="w-80 border-r border-white/10 p-8 flex flex-col items-center justify-center bg-slate-800/20">
                        <div className="relative mb-8">
                            <AnimatePresence>
                                {isRecording && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1.2, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="absolute inset-0 bg-red-500/20 rounded-full"
                                    />
                                )}
                            </AnimatePresence>
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={status === 'analyzing'}
                                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-brand-blue hover:scale-110 active:scale-95 text-brand-dark'
                                    }`}
                            >
                                {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-10 h-10" />}
                            </button>
                        </div>

                        <div className="text-center">
                            <h4 className="text-2xl font-mono font-bold text-white mb-1">{formatTime(recordingTime)}</h4>
                            <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">
                                {status === 'idle' ? 'Ready to observe' : status === 'recording' ? 'Listening...' : status === 'analyzing' ? 'Processing...' : 'Session Analysis Complete'}
                            </p>
                        </div>

                        {status === 'analyzing' && (
                            <div className="mt-8 flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                                <p className="text-xs text-brand-blue font-bold italic">Unpacking pedagogical patterns...</p>
                            </div>
                        )}

                        {status === 'done' && (
                            <Button
                                variant="outline"
                                className="mt-8 border-brand-blue/20 text-brand-blue hover:bg-brand-blue/10"
                                onClick={() => { setStatus('idle'); setReport(null); }}
                            >
                                Observe Next Teacher
                            </Button>
                        )}
                    </div>

                    {/* Right Panel: Output */}
                    <div className="flex-1 bg-black/20">
                        <ScrollArea className="h-full">
                            <div className="p-8">
                                {status === 'idle' && (
                                    <div className="h-full flex flex-col items-center justify-center text-center mt-20">
                                        <Bot className="w-16 h-16 text-slate-700 mb-4" />
                                        <h5 className="text-xl font-bold text-slate-500">Awaiting Classroom Input</h5>
                                        <p className="max-w-xs text-slate-600 mt-2">
                                            Tap the mic to start live observation. AI will automatically structure your verbal notes and teaching audio into a formal report.
                                        </p>
                                    </div>
                                )}

                                {status === 'recording' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 animate-pulse">
                                            <div className="w-2 h-2 rounded-full bg-brand-blue" />
                                            <div className="h-4 bg-slate-800 rounded-full flex-1" />
                                        </div>
                                        <div className="flex items-center gap-4 animate-pulse delay-75">
                                            <div className="w-2 h-2 rounded-full bg-slate-700" />
                                            <div className="h-4 bg-slate-800 rounded-full w-3/4" />
                                        </div>
                                        <div className="p-6 bg-slate-800/30 rounded-2xl italic text-slate-400 text-sm">
                                            "Live Transcribing: ...Teacher started the session with a recap of yesterday. Students in the front are active. Good use of local language examples today..."
                                        </div>
                                    </div>
                                )}

                                {report && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-2xl font-bold text-white flex items-center gap-2">
                                                <FileText className="w-6 h-6 text-brand-blue" /> Pedagogical Review
                                            </h4>
                                            <div className="text-right">
                                                <p className="text-3xl font-bold text-brand-blue">{report.pedagogicalScore}%</p>
                                                <p className="text-xs text-slate-500 uppercase font-bold">Overall Score</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-5 bg-green-500/5 border border-green-500/10 rounded-2xl">
                                                <h5 className="text-green-500 font-bold flex items-center gap-2 mb-4 uppercase text-xs tracking-widest">
                                                    <Trophy className="w-4 h-4" /> Strengths Identified
                                                </h5>
                                                <ul className="space-y-3">
                                                    {report.strengths.map((s: string, i: number) => (
                                                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                            {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="p-5 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                                                <h5 className="text-orange-500 font-bold flex items-center gap-2 mb-4 uppercase text-xs tracking-widest">
                                                    <Target className="w-4 h-4" /> Areas for Growth
                                                </h5>
                                                <ul className="space-y-3">
                                                    {report.improvements.map((s: string, i: number) => (
                                                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                                            <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                                            {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl">
                                            <h5 className="text-brand-blue font-bold flex items-center gap-2 mb-4 uppercase text-xs tracking-widest">
                                                <Sparkles className="w-4 h-4" /> AI Recommended Next Steps
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {report.recommendedResources.map((res: string, i: number) => (
                                                    <Badge key={i} className="bg-brand-blue/20 text-brand-blue border-none p-2 px-3 text-xs">
                                                        {res}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Button className="w-full mt-6 bg-brand-blue text-brand-dark hover:bg-cyan-400 font-bold">
                                                Send Report & Action Plan to Teacher
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
