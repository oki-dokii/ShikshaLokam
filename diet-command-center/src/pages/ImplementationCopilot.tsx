import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Send, Bot, User, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateReflectionChat } from "@/lib/gemini";
import { motion, AnimatePresence } from "framer-motion";

const TOPICS = [
    "Active Learning Strategies",
    "Handling Difficult Parents",
    "Using TLM Effectively",
    "Formative Assessment Techniques",
    "Classroom Management"
];

const ImplementationCopilot = () => {
    const navigate = useNavigate();
    const [selectedTopic, setSelectedTopic] = useState("");
    const [messages, setMessages] = useState<{ role: 'bot' | 'user', text: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const startChat = async (topic: string) => {
        setSelectedTopic(topic);
        setIsLoading(true);
        // Initial bot message
        setMessages([{ role: 'bot', text: `Hi teacher! I see you recently explored "${topic}". How are you planning to use it in your class tomorrow?` }]);
        setIsLoading(false);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, text: m.text }));
            const reply = await generateReflectionChat([...history, { role: 'user', text: userMsg }], { topic: selectedTopic });

            setMessages(prev => [...prev, { role: 'bot', text: reply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble thinking right now. Taking a quick nap... zzz." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

            {/* Header */}
            <header className="p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="font-orbitron font-bold text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-brand-purple" />
                        Implementation Copilot
                    </h1>
                    <p className="text-xs text-slate-400">Your personal implementation coach</p>
                </div>
            </header>

            <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4 z-10">
                {!selectedTopic ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex flex-col justify-center items-center text-center space-y-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-brand-purple/20 blur-xl rounded-full" />
                            <Bot className="w-20 h-20 text-brand-purple relative z-10" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Ready to reflect?</h2>
                            <p className="text-slate-400">Pick a topic you recently learned about to start a coaching session.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {TOPICS.map(topic => (
                                <Button
                                    key={topic}
                                    variant="outline"
                                    className="h-auto py-4 border-white/10 hover:bg-brand-purple/20 hover:text-brand-purple hover:border-brand-purple/50 transition-all text-left justify-start"
                                    onClick={() => startChat(topic)}
                                >
                                    {topic}
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4 scrollbar-hide">
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-brand-purple/20'}`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-brand-purple" />}
                                        </div>
                                        <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-slate-800 text-white rounded-tr-sm'
                                                : 'bg-brand-purple/10 border border-brand-purple/20 text-slate-200 rounded-tl-sm'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-brand-purple/20 flex items-center justify-center shrink-0">
                                            <Bot className="w-4 h-4 text-brand-purple" />
                                        </div>
                                        <div className="bg-brand-purple/10 border border-brand-purple/20 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                                            <div className="w-2 h-2 bg-brand-purple rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <div className="w-2 h-2 bg-brand-purple rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <div className="w-2 h-2 bg-brand-purple rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div ref={scrollRef} />
                        </div>

                        <div className="mt-4 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your reply..."
                                className="w-full bg-slate-900 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                                disabled={isLoading}
                            />
                            <Button
                                size="icon"
                                className="absolute right-2 top-2 rounded-full bg-brand-purple hover:bg-purple-600 text-white w-10 h-10"
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default ImplementationCopilot;
