import React, { useState, useEffect, useRef } from 'react';
import { useKnowledge } from '@/context/KnowledgeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Video, X, Loader2, Sparkles, CheckCircle2, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { processKnowledgeSnippet, processVisualKnowledge } from '@/lib/gemini';
import { toast } from 'sonner';

// Type definition for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export const CaptureFab = () => {
    const { addInsight } = useKnowledge();
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'audio' | 'video' | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [result, setResult] = useState<null | { text: string; tags: string[] }>(null);

    // Audio Refs
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Video Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                }
                if (currentTranscript) {
                    setTranscript(prev => prev + " " + currentTranscript);
                }
            };

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error("Speech recognition error", event.error);
                setIsRecording(false);
            };

            recognition.onend = () => {
                if (mode === 'audio') {
                    setIsRecording(false);
                    if (transcript.length > 0) {
                        handleAudioProcessing(transcript);
                    }
                }
            };

            recognitionRef.current = recognition;
        }
    }, [transcript, mode]);

    // --- Audio Logic ---
    const startAudio = () => {
        setMode('audio');
        setTranscript("");
        setIsRecording(true);
        recognitionRef.current?.start();
    };

    const stopAudio = () => {
        recognitionRef.current?.stop();
        setIsRecording(false);
        // onend will handle processing
    };

    const handleAudioProcessing = async (text: string) => {
        setIsProcessing(true);
        try {
            const aiResult = await processKnowledgeSnippet(text);
            setResult({
                text: aiResult.refinedText,
                tags: aiResult.tags
            });
        } catch (error) {
            console.warn("Gemini API failed", error);
            setResult({ text, tags: generateTags(text) });
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Video Logic ---
    const startVideo = async () => {
        setMode('video');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access denied", err);
            toast.error("Camera access denied");
            setMode(null);
        }
    };

    const captureAndAnalyze = async () => {
        if (!videoRef.current) return;
        setIsProcessing(true);

        // Pause video to show "snapshot" state
        videoRef.current.pause();

        // Capture frame
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(videoRef.current, 0, 0);
        const base64Image = canvas.toDataURL("image/jpeg");

        // Stop media streams immediately
        stopVideoValues();

        try {
            const aiResult = await processVisualKnowledge(base64Image, transcript);
            setResult({
                text: aiResult.refinedText || "Visual analysis complete.",
                tags: aiResult.tags
            });
        } catch (error) {
            console.error(error);
            toast.error("AI Analysis failed - Checking network/key");

            // FALLBACK so user can still save
            setTimeout(() => {
                setResult({
                    text: transcript || "Visual capture (No Analysis available)",
                    tags: ["#VisualCapture", "#Classroom"]
                });
            }, 500);
        } finally {
            setIsProcessing(false);
        }
    };

    const stopVideoValues = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const generateTags = (text: string) => {
        const tags = ["#TacitKnowledge"];
        const lowerText = text.toLowerCase();
        if (lowerText.includes("student")) tags.push("#StudentCentric");
        return tags;
    };

    const saveInsight = () => {
        if (result) {
            addInsight(result.text, result.tags);
            toast.success("Insight saved to Knowledge Base!");
            reset();
        }
    };

    const reset = () => {
        stopVideoValues();
        setIsOpen(false);
        setMode(null);
        setResult(null);
        setIsRecording(false);
        setIsProcessing(false);
        setTranscript("");
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-neon-cyan text-brand-dark shadow-[0_0_20px_#00f3ff] hover:shadow-[0_0_30px_#00f3ff] transition-all"
            >
                <Mic className="w-6 h-6" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl"
                        >
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-slate-400 hover:text-white" onClick={reset}>
                                <X className="w-4 h-4" />
                            </Button>

                            <div className="text-center pt-4 mb-6">
                                <h2 className="font-orbitron font-bold text-xl text-white mb-2">Tacit Knowledge Capture</h2>
                                <p className="text-sm text-slate-400">Record your classroom hack (Voice or Visual)</p>
                            </div>

                            {/* State 1: Selection Mode */}
                            {!mode && !isProcessing && !result && (
                                <div className="flex gap-4 justify-center py-8">
                                    <button onClick={startAudio} className="flex flex-col items-center gap-2 group">
                                        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                                            <Mic className="w-8 h-8 text-red-500" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Voice</span>
                                    </button>
                                    <button onClick={startVideo} className="flex flex-col items-center gap-2 group">
                                        <div className="w-20 h-20 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center group-hover:bg-brand-cyan/20 transition-all">
                                            <Video className="w-8 h-8 text-brand-cyan" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Visual</span>
                                    </button>
                                </div>
                            )}

                            {/* State 2: Audio Recording */}
                            {mode === 'audio' && isRecording && (
                                <div className="py-8 flex flex-col items-center">
                                    <div className="relative mb-6">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="w-24 h-24 rounded-full bg-red-500/20 absolute inset-0"
                                        />
                                        <button onClick={stopAudio} className="w-24 h-24 rounded-full border-2 border-red-500 flex items-center justify-center relative z-10 bg-slate-900 hover:bg-slate-800 transition-colors">
                                            <MicOff className="w-8 h-8 text-red-500" />
                                        </button>
                                    </div>
                                    <div className="text-red-400 font-mono animate-pulse mb-4">LISTENING...</div>
                                    <div className="w-full bg-slate-800/50 p-4 rounded-lg min-h-[60px] text-center text-sm text-slate-300">
                                        {transcript || "Speak now..."}
                                    </div>
                                </div>
                            )}

                            {/* State 3: Video Preview */}
                            {mode === 'video' && (
                                <div className="py-4 flex flex-col items-center">
                                    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-4 border border-white/20 relative">
                                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                                        {/* Audio Overlay */}
                                        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                <span className="text-[10px] text-red-400 font-bold tracking-wider">MIC ACTIVE</span>
                                            </div>
                                            <p className="text-xs text-white line-clamp-2 min-h-[1.5em]">{transcript || "Describe what you see..."}</p>
                                        </div>
                                    </div>
                                    <Button onClick={captureAndAnalyze} className="bg-brand-cyan text-brand-dark hover:bg-cyan-400 w-full mb-2">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Capture & Analyze
                                    </Button>
                                    <p className="text-xs text-slate-500">Gemini will analyze image + voice.</p>
                                </div>
                            )}

                            {/* State 4: Processing */}
                            {isProcessing && (
                                <div className="py-12 flex flex-col items-center">
                                    <Loader2 className="w-12 h-12 text-brand-cyan animate-spin mb-6" />
                                    <div className="flex items-center gap-2 text-brand-cyan font-orbitron text-sm">
                                        <Sparkles className="w-4 h-4" />
                                        ANALYZING {mode === 'video' ? 'IMAGE' : 'AUDIO'}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Generating insights with Gemini...</p>
                                </div>
                            )}

                            {/* State 5: Result */}
                            {result && (
                                <div className="py-4">
                                    <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5 mb-4">
                                        <p className="text-slate-300 italic">"{result.text}"</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {result.tags.map(tag => (
                                            <span key={tag} className="text-xs px-2 py-1 rounded bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-green-400 text-sm justify-center mb-6">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Ready to Save</span>
                                    </div>
                                    <Button className="w-full bg-brand-cyan text-brand-dark hover:bg-cyan-400 font-bold" onClick={saveInsight}>
                                        Save Insight
                                    </Button>
                                </div>
                            )}

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
