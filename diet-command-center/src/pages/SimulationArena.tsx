import React, { useState, useRef, useEffect, Component, ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Send, Bot, User, RefreshCw, Sparkles, UserCircle, BrainCircuit, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { startSimulation, continueSimulation } from "@/lib/gemini";
import { motion, AnimatePresence } from "framer-motion";

// 1. Error Boundary Component
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("SimulationArena Crash:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-destructive/10 text-foreground min-h-screen flex flex-col items-center justify-center font-inter">
                    <AlertCircle className="w-16 h-16 text-destructive mb-6" />
                    <h1 className="text-3xl font-outfit font-bold mb-4 text-foreground">Simulation Interrupted</h1>
                    <div className="glass-card p-6 max-w-2xl w-full border-destructive/20">
                        <code className="text-destructive block whitespace-pre-wrap font-mono text-sm">
                            {this.state.error?.toString()}
                        </code>
                    </div>
                    <Button onClick={() => window.location.reload()} className="mt-8 px-8 py-6 rounded-2xl">
                        Restart Arena
                    </Button>
                </div>
            );
        }
        return this.props.children;
    }
}

// 2. Main Component
const SimulationArenaContent = () => {
    const navigate = useNavigate();
    const [scenario, setScenario] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ role: 'bot' | 'user', text: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [personaContext, setPersonaContext] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleStart = async (selectedScenario: string) => {
        setIsLoading(true);
        setScenario(selectedScenario);
        setMessages([]);
        try {
            const { text, personaPrompt } = await startSimulation(selectedScenario);
            setPersonaContext(personaPrompt);
            setMessages([{ role: 'bot', text }]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const reply = await continueSimulation(messages, personaContext, userMsg);
            setMessages(prev => [...prev, { role: 'bot', text: reply }]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-inter selection:bg-primary/20 overflow-hidden">
            {/* Background Decorative Blurs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            <header className="relative z-10 px-6 py-8 flex items-center gap-6 max-w-7xl mx-auto">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/')}
                    className="rounded-full hover:bg-primary/10 text-muted-foreground transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <BrainCircuit className="w-4 h-4 text-secondary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-secondary/70">Training Module</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-outfit font-bold text-foreground tracking-tight">
                        Behavioral Simulation Arena
                    </h1>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-6 pb-20 mt-4">
                <AnimatePresence mode="wait">
                    {!scenario ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-12"
                        >
                            <div className="text-center space-y-3">
                                <h2 className="text-3xl md:text-4xl font-outfit font-black text-foreground">Choose Your Practice Arena</h2>
                                <p className="text-muted-foreground max-w-lg mx-auto">
                                    Master classroom management and stakeholder engagement in a risk-free AI-driven simulation.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        id: 'parent',
                                        title: 'The Concerned Parent',
                                        desc: 'Navigate a challenging conversation with an anxious or unhappy guardian.',
                                        icon: UserCircle,
                                        color: 'from-amber-500/10 to-transparent border-amber-500/20 text-amber-600'
                                    },
                                    {
                                        id: 'student',
                                        title: 'Restless Classroom',
                                        desc: 'Address disruptive behavior while keeping the lesson on track.',
                                        icon: User,
                                        color: 'from-primary/10 to-transparent border-primary/20 text-primary'
                                    },
                                    {
                                        id: 'colleague',
                                        title: 'Peer Conflict',
                                        desc: 'Discuss sensitive curriculum matters with a resistant senior colleague.',
                                        icon: Users,
                                        color: 'from-secondary/10 to-transparent border-secondary/20 text-secondary'
                                    }
                                ].map((s) => (
                                    <motion.button
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        key={s.id}
                                        onClick={() => handleStart(s.id)}
                                        className={`glass-card p-8 border hover:border-foreground/20 text-left group overflow-hidden relative shadow-lg shadow-black/5 bg-gradient-to-br ${s.color}`}
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center mb-6 shadow-inner">
                                            <s.icon className={`w-7 h-7 ${s.color.split(' ').pop()}`} />
                                        </div>
                                        <h3 className="font-outfit font-bold text-xl mb-3 text-foreground">{s.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed italic pr-4">{s.desc}</p>
                                        <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground/50 group-hover:text-foreground transition-colors">
                                            <span>Enter Arena</span>
                                            <ArrowLeft className="w-3 h-3 rotate-180" />
                                        </div>
                                        <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12">
                                            <s.icon className="w-16 h-16" />
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card border-white/20 dark:border-white/5 rounded-[32px] overflow-hidden flex flex-col shadow-2xl h-[750px] relative"
                        >
                            {/* Chat Header */}
                            <div className="px-8 py-6 border-b border-white/50 bg-white/20 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Bot className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-outfit font-bold text-foreground">Simulation: {scenario.charAt(0).toUpperCase() + scenario.slice(1)}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Live System</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setScenario(null)}
                                    className="rounded-full hover:bg-destructive/5 text-destructive/70 hover:text-destructive gap-2 text-xs font-bold"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    Exit Session
                                </Button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8 scrollbar-thin scrollbar-thumb-primary/10">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${msg.role === 'user' ? 'bg-secondary text-white' : 'bg-primary text-white'
                                                    }`}>
                                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                                </div>
                                                <div className={`p-5 rounded-3xl shadow-sm leading-relaxed ${msg.role === 'user'
                                                    ? 'bg-gradient-to-br from-primary to-secondary text-white rounded-tr-none'
                                                    : 'glass-card bg-white dark:bg-white/10 border-white/50 dark:border-white/5 text-foreground rounded-tl-none shadow-md'
                                                    }`}>
                                                    <p className="text-[15px]">{msg.text}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-4 max-w-[85%]">
                                            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center animate-pulse">
                                                <Bot className="w-4 h-4" />
                                            </div>
                                            <div className="glass-card bg-white/80 border-white/50 p-5 rounded-3xl rounded-tl-none flex gap-1.5 items-center">
                                                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                                                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce delay-150" />
                                                <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce delay-300" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Input */}
                            <div className="px-8 py-8 border-t border-white/50 bg-white/20">
                                <div className="max-w-4xl mx-auto flex gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Shape your response here..."
                                            className="w-full h-16 bg-white dark:bg-white/5 border-2 border-border/50 rounded-2xl px-8 pr-16 text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-xl shadow-black/5 placeholder:text-muted-foreground/50"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2">
                                            <Sparkles className="w-5 h-5 text-primary/30" />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={handleSend}
                                        disabled={isLoading || !input.trim()}
                                        className="h-16 w-16 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center p-0"
                                    >
                                        <Send className="w-6 h-6" />
                                    </Button>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Practice behavioral empathy in a safe space</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

// 3. Wrap Export
const SimulationArena = () => (
    <ErrorBoundary>
        <SimulationArenaContent />
    </ErrorBoundary>
);

export default SimulationArena;
