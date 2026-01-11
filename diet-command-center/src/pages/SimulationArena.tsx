import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Send, Bot, User, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { startSimulation, continueSimulation } from "@/lib/gemini";
import { motion, AnimatePresence } from "framer-motion";

const SimulationArena = () => {
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
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

            <header className="flex items-center gap-4 mb-4 relative z-10">
                <Button variant="ghost" onClick={() => navigate('/heatmap')} className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-brand-purple" />
                        Behavioral Simulation Arena
                    </h1>
                </div>
            </header>

            <main className="max-w-4xl mx-auto h-[600px] bg-slate-900 border border-white/10 rounded-2xl relative z-10 flex flex-col overflow-hidden shadow-2xl">

                {!scenario ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-2">Choose Your Challenge</h2>
                            <p className="text-slate-400">Select a scenario to practice your soft skills.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            {[
                                { id: 'parent', title: 'Angry Parent', desc: 'Manage a conflict via empathy.', color: 'bg-red-500/20 text-red-400 border-red-500/50' },
                                { id: 'student', title: 'Disruptive Student', desc: 'Handle disruption positively.', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
                                { id: 'colleague', title: 'Resistant Colleague', desc: 'Persuade a senior peer.', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => handleStart(s.id)}
                                    className={`p-6 rounded-xl border ${s.color} hover:bg-white/5 transition-all text-left group`}
                                >
                                    <h3 className="font-bold text-lg mb-2 group-hover:underline">{s.title}</h3>
                                    <p className="text-sm opacity-80">{s.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Simulation</span>
                                <Button variant="ghost" size="sm" onClick={() => setScenario(null)} className="text-slate-400 hover:text-white text-xs">
                                    End Session
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
                                            ? 'bg-brand-purple text-white rounded-tr-none'
                                            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/10'
                                            }`}>
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-white/10 flex gap-1">
                                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75" />
                                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-950 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your response..."
                                    className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-brand-purple"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="bg-brand-purple hover:bg-purple-600 text-white rounded-xl px-6"
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

export default SimulationArena;
