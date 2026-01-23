import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, X, MessageSquare, Sparkles, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { askAIAssistant } from '@/lib/gemini';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'assistant';
    text: string;
}

export const AIVoiceAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-IN';

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                handleSend(transcript);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech Recognition Error", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }

        // Initialize Synthesis and Voice Selection
        if ('speechSynthesis' in window) {
            synthesisRef.current = new SpeechSynthesisUtterance();
            synthesisRef.current.onstart = () => setIsSpeaking(true);
            synthesisRef.current.onend = () => setIsSpeaking(false);

            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                // Strategy: 1. Google Voices (very high quality), 2. Natural sounding, 3. Specific preferred voices
                const voice =
                    availableVoices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
                    availableVoices.find(v => v.name.includes('Natural') && v.lang.startsWith('en')) ||
                    availableVoices.find(v => v.lang === 'en-GB' || v.lang === 'en-US') ||
                    availableVoices[0];

                if (voice && synthesisRef.current) {
                    synthesisRef.current.voice = voice;
                    console.log("Selected high quality voice:", voice.name);
                }
            };

            loadVoices();
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (text?: string) => {
        const query = text || inputValue;
        if (!query.trim()) return;

        const newMessages: Message[] = [...messages, { role: 'user', text: query }];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await askAIAssistant(query, messages.map(m => ({ role: m.role, text: m.text })));
            setMessages([...newMessages, { role: 'assistant', text: response }]);

            if (voiceEnabled) {
                speak(response);
            }
        } catch (error) {
            console.error("Assistant Error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const speak = (text: string) => {
        if (synthesisRef.current && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            synthesisRef.current.text = text;
            synthesisRef.current.rate = 0.9;
            synthesisRef.current.pitch = 1;
            window.speechSynthesis.speak(synthesisRef.current);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setIsListening(true);
            recognitionRef.current?.start();
        }
    };

    const toggleVoice = () => {
        setVoiceEnabled(!voiceEnabled);
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    return (
        <>
            {/* Floating Trigger */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-8 z-50 p-5 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center border border-white/20"
            >
                <Sparkles className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-white"></span>
                </span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-end p-4 md:p-8 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className="w-full max-w-lg h-[600px] bg-white border border-border rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden pointer-events-auto shadow-primary/10"
                        >
                            {/* Header */}
                            <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <Sparkles className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-outfit font-black tracking-tight">Shiksha AI</h2>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Always Listening</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={toggleVoice} className={cn("rounded-xl", voiceEnabled ? "text-primary" : "text-muted-foreground")}>
                                        {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-xl text-muted-foreground">
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Chat Area */}
                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
                            >
                                {messages.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                        <div className="w-20 h-20 bg-muted/50 rounded-[2rem] flex items-center justify-center mb-6">
                                            <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
                                        </div>
                                        <h3 className="text-xl font-bold font-outfit mb-2">How can I help you today?</h3>
                                        <p className="text-muted-foreground text-sm max-w-xs">
                                            Ask me about lesson plans, classroom challenges, or any teaching support you need.
                                        </p>
                                    </div>
                                )}

                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={cn(
                                            "flex w-full mb-2",
                                            msg.role === 'user' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "max-w-[85%] p-4 rounded-3xl",
                                            msg.role === 'user'
                                                ? "bg-primary text-white rounded-tr-none"
                                                : "bg-muted/50 text-foreground border border-border/50 rounded-tl-none"
                                        )}>
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        </div>
                                    </motion.div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted/50 p-4 rounded-3xl rounded-tl-none border border-border/50 flex items-center gap-3">
                                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                            <span className="text-xs font-bold text-muted-foreground italic">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer / Input */}
                            <div className="p-6 bg-white border-t">
                                <div className="flex items-end gap-3">
                                    <div className="flex-1 relative">
                                        <textarea
                                            rows={1}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                                            placeholder="Type your query..."
                                            className="w-full bg-muted/50 border border-border/50 rounded-[1.5rem] px-6 py-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none max-h-32"
                                        />
                                        <Button
                                            size="icon"
                                            onClick={() => handleSend()}
                                            disabled={!inputValue.trim()}
                                            className="absolute right-2 bottom-2 w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            size="icon"
                                            onClick={toggleListening}
                                            className={cn(
                                                "w-14 h-14 rounded-2xl transition-all duration-300",
                                                isListening
                                                    ? "bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/20"
                                                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                                            )}
                                        >
                                            {isListening ? (
                                                <div className="relative">
                                                    <MicOff className="w-6 h-6" />
                                                    <div className="absolute -inset-2 bg-white/20 rounded-full animate-ping" />
                                                </div>
                                            ) : <Mic className="w-6 h-6" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-center gap-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                        {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Ask me anything"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
