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
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#0A0F1E] border border-white/10 w-full max-w-5xl h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] relative"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/[0.02] to-transparent pointer-events-none" />

                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20 shadow-lg shadow-brand-blue/5">
                            <Mic className="w-7 h-7 text-brand-blue animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white font-orbitron tracking-tight">Mentor Copilot</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] text-slate-400 font-black tracking-[0.25em] uppercase">AI-Powered Classroom Intelligence v4.0</p>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-12 w-12 rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X className="w-6 h-6" />
                    </Button>
                </div>

                <div className="flex-1 overflow-hidden flex relative z-10">
                    {/* Left Panel: Controls */}
                    <div className="w-96 border-r border-white/5 p-10 flex flex-col items-center justify-between bg-black/20">
                        <div className="w-full space-y-8">
                            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Session Status</p>
                                <div className="flex items-center justify-center gap-3">
                                    <Badge className={`${status === 'recording' ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-400'} border-0 px-3 py-1 font-black uppercase text-[10px] tracking-widest`}>
                                        {status === 'recording' ? 'LIVE' : 'STANDBY'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex flex-col items-center">
                            <AnimatePresence>
                                {isRecording && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 2.5, opacity: 0 }}
                                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.6, ease: "easeOut" }}
                                                className="absolute w-24 h-24 border border-red-500/30 rounded-full"
                                            />
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={status === 'analyzing'}
                                className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-105 active:scale-95 z-20 ${isRecording
                                    ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]'
                                    : 'bg-brand-blue hover:bg-cyan-400 shadow-[0_0_50px_rgba(59,130,246,0.3)]'
                                    }`}
                            >
                                {isRecording
                                    ? <Square className="w-10 h-10 text-white fill-white" />
                                    : <Mic className="w-12 h-12 text-black" />}
                            </button>
                            <div className="mt-8 text-center space-y-2">
                                <h4 className="text-4xl font-black font-orbitron text-white tracking-widest leading-none">{formatTime(recordingTime)}</h4>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em]">
                                    {status === 'idle' ? 'Ready to observe' : status === 'recording' ? 'Listening...' : status === 'analyzing' ? 'Processing...' : 'Session Complete'}
                                </p>
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            {status === 'analyzing' && (
                                <div className="p-6 rounded-3xl bg-brand-blue/5 border border-brand-blue/10 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                                    <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                                    <p className="text-[10px] text-brand-blue font-black uppercase tracking-widest text-center">Decrypting classroom patterns...</p>
                                </div>
                            )}

                            {status === 'done' && (
                                <Button
                                    variant="outline"
                                    className="w-full h-14 border-white/10 text-white hover:bg-white/10 font-black uppercase tracking-widest text-xs rounded-2xl"
                                    onClick={() => { setStatus('idle'); setReport(null); }}
                                >
                                    Observe Next
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Output */}
                    <div className="flex-1 bg-[#050810]">
                        <ScrollArea className="h-full">
                            <div className="p-12">
                                {status === 'idle' && (
                                    <div className="h-[50vh] flex flex-col items-center justify-center text-center">
                                        <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8">
                                            <Bot className="w-12 h-12 text-slate-700" />
                                        </div>
                                        <h5 className="text-2xl font-black text-slate-400 font-orbitron uppercase tracking-tight">Active Observation Mode</h5>
                                        <p className="max-w-md text-slate-600 mt-4 leading-relaxed font-medium">
                                            Place the device in a central location. AI will structure audio streams into pedagogical insights, mapping them against NIPUN guidelines in real-time.
                                        </p>
                                    </div>
                                )}

                                {status === 'recording' && (
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-6">
                                            <div className="flex gap-1.5 h-6 items-end">
                                                {[...Array(6)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ height: [12, 24, 8, 20, 12] }}
                                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                                                        className="w-1.5 bg-brand-blue rounded-full"
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm font-black text-brand-blue uppercase tracking-widest">Real-time Stream Analysis</p>
                                        </div>
                                        <div className="p-8 rounded-[2rem] bg-indigo-500/[0.03] border border-indigo-500/10 italic text-slate-400 text-lg leading-relaxed font-medium shadow-inner">
                                            <span className="text-indigo-500 font-black not-italic mr-2">TRANSCRIPT:</span>
                                            "Teacher leads the class in a collective reading exercise. Emphasizes phonetic sounds of 'Ka' and 'Ma'. Student in Group B asks for clarification. Teacher uses local market analogy..."
                                        </div>
                                    </div>
                                )}

                                {report && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-12 pb-12"
                                    >
                                        <div className="flex items-center justify-between pb-8 border-b border-white/5">
                                            <h4 className="text-3xl font-black text-white font-orbitron tracking-tight flex items-center gap-4">
                                                <FileText className="w-8 h-8 text-brand-blue" /> Session Metrics
                                            </h4>
                                            <div className="text-right space-y-1">
                                                <p className="text-5xl font-black text-brand-blue font-orbitron">{report.pedagogicalScore}%</p>
                                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Composite Index</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="p-8 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[2rem] shadow-sm relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] -rotate-45 transform translate-x-16 -translate-y-16" />
                                                <h5 className="text-emerald-500 font-black flex items-center gap-3 mb-6 uppercase text-[10px] tracking-[0.25em]">
                                                    <Trophy className="w-5 h-5" /> Pedagogical Strengths
                                                </h5>
                                                <ul className="space-y-5">
                                                    {report.strengths.map((s: string, i: number) => (
                                                        <li key={i} className="text-sm text-slate-300 flex items-start gap-3 leading-relaxed font-medium">
                                                            <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 outline-none" />
                                                            </div>
                                                            {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="p-8 bg-orange-500/[0.03] border border-orange-500/10 rounded-[2rem] shadow-sm relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/[0.02] -rotate-45 transform translate-x-16 -translate-y-16" />
                                                <h5 className="text-orange-500 font-black flex items-center gap-3 mb-6 uppercase text-[10px] tracking-[0.25em]">
                                                    <Target className="w-5 h-5" /> Development Areas
                                                </h5>
                                                <ul className="space-y-5">
                                                    {report.improvements.map((s: string, i: number) => (
                                                        <li key={i} className="text-sm text-slate-300 flex items-start gap-3 leading-relaxed font-medium">
                                                            <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                                                <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                                                            </div>
                                                            {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="p-10 bg-brand-blue/[0.03] border border-brand-blue/10 rounded-[2.5rem] relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-brand-blue shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
                                            <h5 className="text-brand-blue font-black flex items-center gap-3 mb-8 uppercase text-[10px] tracking-[0.25em]">
                                                <Sparkles className="w-5 h-5" /> Curated Action Plan
                                            </h5>
                                            <div className="flex flex-wrap gap-3">
                                                {report.recommendedResources.map((res: string, i: number) => (
                                                    <Badge key={i} className="bg-white/5 text-slate-300 border border-white/5 p-3 px-5 text-xs rounded-xl font-bold hover:bg-white/10 transition-colors">
                                                        {res}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Button className="w-full mt-10 h-16 bg-brand-blue text-black hover:bg-cyan-400 font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-brand-blue/20">
                                                Sync to DIET Cluster Repository
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
