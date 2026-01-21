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
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="p-4 border-b border-border bg-card sticky top-0 z-20 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="font-bold text-lg flex items-center gap-2 text-foreground">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Implementation Copilot
                    </h1>
                    <p className="text-xs text-muted-foreground">Your personal implementation coach</p>
                </div>
            </header>

            <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-4">
                {!selectedTopic ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex flex-col justify-center items-center text-center space-y-8"
                    >
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                            <Bot className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2 text-foreground">Ready to reflect?</h2>
                            <p className="text-muted-foreground">Pick a topic you recently learned about to start a coaching session.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {TOPICS.map(topic => (
                                <Button
                                    key={topic}
                                    variant="outline"
                                    className="h-auto py-4 text-left justify-start"
                                    onClick={() => startChat(topic)}
                                >
                                    {topic}
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-muted' : 'bg-primary/10'}`}>
                                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                                        </div>
                                        <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-muted text-foreground rounded-tr-sm'
                                                : 'bg-primary/5 border border-primary/20 text-foreground rounded-tl-sm'
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
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Bot className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
                                className="w-full bg-background border border-border rounded-full py-4 pl-6 pr-14 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                disabled={isLoading}
                            />
                            <Button
                                size="icon"
                                className="absolute right-2 top-2 rounded-full w-10 h-10"
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
