import React, { useState, useRef, useEffect, Component, ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Send, Bot, User, RefreshCw } from "lucide-react";
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
                <div className="p-8 bg-red-900 text-white min-h-screen flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
                    <div className="bg-black p-4 rounded overflow-auto max-w-2xl w-full">
                        <code className="text-red-400 block whitespace-pre-wrap">
                            {this.state.error?.toString()}
                        </code>
                    </div>
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
    }, [messages]);

    const handleStart = async (selectedScenario: string) => {
        setIsLoading(true);
        setScenario(selectedScenario);
        setMessages([]);
        try {
            console.log("Starting simulation for:", selectedScenario);
            const { text, personaPrompt } = await startSimulation(selectedScenario);
            setPersonaContext(personaPrompt);
            setMessages([{ role: 'bot', text }]);
        } catch (error) {
            console.error(error);
            alert("Failed to start simulation. Check console.");
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
        <div className="min-h-screen bg-background p-8">
            <header className="flex items-center gap-4 mb-4 max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => navigate('/heatmap')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-primary" />
                        Behavioral Simulation Arena
                    </h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto h-[600px] bg-card border border-border rounded-xl flex flex-col overflow-hidden shadow-sm">

                {!scenario ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Challenge</h2>
                            <p className="text-muted-foreground">Select a scenario to practice your soft skills.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            {[
                                { id: 'parent', title: 'Angry Parent', desc: 'Manage a conflict via empathy.', color: 'bg-destructive/10 text-destructive border-destructive/30' },
                                { id: 'student', title: 'Disruptive Student', desc: 'Handle disruption positively.', color: 'bg-accent/10 text-accent border-accent/30' },
                                { id: 'colleague', title: 'Resistant Colleague', desc: 'Persuade a senior peer.', color: 'bg-primary/10 text-primary border-primary/30' }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => handleStart(s.id)}
                                    className={`p-6 rounded-xl border-2 ${s.color} hover:bg-opacity-20 transition-all text-left group`}
                                >
                                    <h3 className="font-bold text-lg mb-2 group-hover:underline">{s.title}</h3>
                                    <p className="text-sm opacity-80">{s.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-border">
                                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Live Simulation</span>
                                <Button variant="ghost" size="sm" onClick={() => setScenario(null)} className="text-xs">
                                    <RefreshCw className="w-3 h-3 mr-1" /> End Session
                                </Button>
                            </div>

                            <AnimatePresence>
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] p-4 rounded-2xl ${msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : 'bg-muted text-foreground rounded-tl-none border border-border'
                                            }`}>
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted p-4 rounded-2xl rounded-tl-none border border-border flex gap-1">
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-75" />
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-background border-t border-border">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your response..."
                                    className="flex-1 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="rounded-xl px-6"
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}

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
