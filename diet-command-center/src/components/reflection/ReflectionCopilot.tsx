import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, User, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { generateReflectionChat } from "@/lib/gemini";
import { toast } from "sonner";

interface ReflectionCopilotProps {
    isOpen: boolean;
    onClose: () => void;
    moduleContext: {
        topic: string;
        clusterId: string;
    };
}

interface Message {
    role: 'user' | 'bot';
    text: string;
}

export const ReflectionCopilot = ({ isOpen, onClose, moduleContext }: ReflectionCopilotProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Initial Greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            handleInitialGreeting();
        }
    }, [isOpen]);

    const handleInitialGreeting = async () => {
        setIsTyping(true);
        // Add small delay for realism
        setTimeout(async () => {
            try {
                const greeting = await generateReflectionChat([], moduleContext);
                setMessages([{ role: 'bot', text: greeting }]);
            } catch (error) {
                setMessages([{ role: 'bot', text: "Hi! How do you plan to use this module in your class?" }]);
            } finally {
                setIsTyping(false);
            }
        }, 1000);
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = { role: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsTyping(true);

        try {
            const response = await generateReflectionChat([...messages, userMsg], moduleContext);
            setMessages(prev => [...prev, { role: 'bot', text: response }]);
        } catch (error) {
            toast.error("Network issue. Please try again.");
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40"
                    />

                    {/* Chat Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-slate-900 border-l border-white/10 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-950">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-cyan flex items-center justify-center text-slate-900 font-bold">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Implementation Coach</h3>
                                    <p className="text-xs text-brand-cyan">Post-Lesson Reflection</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl p-4 text-sm ${msg.role === 'user'
                                                ? 'bg-brand-cyan text-brand-dark rounded-br-none'
                                                : 'bg-slate-800 text-slate-200 border border-white/10 rounded-bl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 border border-white/10 p-3 rounded-2xl rounded-bl-none">
                                        <Loader2 className="w-4 h-4 animate-spin text-brand-cyan" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-slate-950">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type your reflection here..."
                                    className="bg-slate-900 border-white/20 text-white placeholder:text-slate-500 focus-visible:ring-brand-cyan"
                                />
                                <Button type="submit" size="icon" className="bg-brand-cyan text-brand-dark hover:bg-cyan-400 shrink-0">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
