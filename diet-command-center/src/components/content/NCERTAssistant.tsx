import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, X, Sparkles, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateChatResponse } from '@/lib/gemini';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface NCERTAssistantProps {
    moduleTitle: string;
    context: string;
    onClose: () => void;
}

export const NCERTAssistant = ({ moduleTitle, context, onClose }: NCERTAssistantProps) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: `Hi! I'm your NCERT Assistant. I have the full context for "**${moduleTitle}**". How can I help you today?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const response = await generateChatResponse(userMsg, context, moduleTitle);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed top-0 right-0 w-80 h-full bg-slate-900 border-l border-white/10 shadow-2xl z-[100] flex flex-col"
        >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-brand-cyan" />
                    <h3 className="font-bold text-white text-sm">NCERT AI Assistant</h3>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400" onClick={onClose}>
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="p-3 bg-brand-cyan/5 border-b border-brand-cyan/10">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Currently Informed By</p>
                <p className="text-xs text-brand-cyan font-medium truncate">{moduleTitle}</p>
            </div>

            <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
                <div className="space-y-4">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-purple-500/20 text-purple-400' : 'bg-brand-cyan/20 text-brand-cyan'
                                }`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-purple-500 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-cyan/20 text-brand-cyan flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                            <div className="p-3 rounded-2xl bg-slate-800 text-slate-400 text-xs italic">
                                Analyzing NCERT context...
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-white/10 bg-slate-800/30">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask anything..."
                        className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan transition-all"
                    />
                    <Button size="icon" onClick={handleSend} disabled={!input.trim() || isLoading} className="bg-brand-cyan text-brand-dark hover:bg-cyan-400">
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
