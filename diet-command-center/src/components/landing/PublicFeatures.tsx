import { motion } from "framer-motion";
import { Flame, MessageSquare, BookOpen, Activity, LineChart, FileText, Send, Recycle, MessageCircle, LayoutDashboard, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TiltCard } from "@/components/ui/tilt-card";

export const PublicFeatures = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: "Resource Evolution Suite",
            desc: "Transform static textbook content into interactive, bite-sized learning modules tailored for your classroom context using advanced AI.",
            icon: <FileText className="w-8 h-8 text-primary" />,
            color: "bg-primary/10 text-primary",
            borderColor: "border-primary/20",
        },
        {
            title: "Simulation Arena",
            desc: "Practice difficult conversations and classroom management scenarios in a safe, AI-guided roleplay environment before trying them in real life.",
            icon: <MessageSquare className="w-8 h-8 text-secondary" />,
            color: "bg-secondary/10 text-secondary",
            borderColor: "border-secondary/20",
        },
        {
            title: "AI Assessment Copilot",
            desc: "Instantly analyze student performance data to generate personalized learning paths and remedial strategies for every learner.",
            icon: <BookOpen className="w-8 h-8 text-accent" />,
            color: "bg-accent/10 text-accent",
            borderColor: "border-accent/20",
        },
        {
            title: "Live Pulse Advisor",
            desc: "Facing a classroom challenge right now? Get evidence-based, actionable interventions instantly to de-escalate and engage.",
            icon: <Activity className="w-8 h-8 text-destructive" />,
            color: "bg-destructive/10 text-destructive",
            borderColor: "border-destructive/20",
        },
        {
            title: "Agency Engine",
            desc: "Your voice matters. Swipe through pedagogical needs and influence the training curriculum directly based on your actual demands.",
            icon: <Flame className="w-8 h-8 text-pink-500" />,
            color: "bg-pink-100 text-pink-600",
            borderColor: "border-pink-200",
        },
        {
            title: "24/7 Teacher Bot",
            desc: "A constantly available companion on Telegram to answer specific subject queries, lesson planning help, and administrative support.",
            icon: <Send className="w-8 h-8 text-blue-500" />,
            color: "bg-blue-100 text-blue-600",
            borderColor: "border-blue-200",
        },
        {
            title: "Frugal Science Lab",
            desc: "No lab equipment? No problem. Turn household objects into powerful teaching learning materials with simple guides.",
            icon: <Recycle className="w-8 h-8 text-emerald-500" />,
            color: "bg-emerald-100 text-emerald-600",
            borderColor: "border-emerald-200",
        },
        {
            title: "Reflection Copilot",
            desc: "Reflect on your teaching day and build a personalized portfolio of your professional growth with AI assistance.",
            icon: <MessageCircle className="w-8 h-8 text-purple-500" />,
            color: "bg-purple-100 text-purple-600",
            borderColor: "border-purple-200",
        },
        {
            title: "RP Dashboard",
            desc: "A unified command center for Cluster and Block Resource Persons to monitor metrics, plan visits, and track compliance.",
            icon: <LayoutDashboard className="w-8 h-8 text-indigo-500" />,
            color: "bg-indigo-100 text-indigo-600",
            borderColor: "border-indigo-200",
        }
    ];

    return (
        <section className="py-24 px-4 relative overflow-hidden bg-background/50 border-y border-border/40">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-500/[0.02] -z-10" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
            <div className="absolute top-1/2 -left-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl opacity-50 overflow-hidden" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-6">
                        Capabilities that <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 dark:to-blue-400">Empower You</span>
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        A complete suite of intelligent tools designed designed to handle the "heavy lifting" so you can focus on what matters most: your students.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <TiltCard key={feature.title} className="h-full">
                            <div
                                className={`group relative bg-card p-8 rounded-3xl border ${feature.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col`}
                            >
                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />

                                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-inner`}>
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors flex items-center gap-2">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-4 text-sm font-medium flex-grow">
                                    {feature.desc}
                                </p>

                                <div className="pt-4 border-t border-border flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest group-hover:text-primary/70 transition-colors mt-auto">
                                    <Sparkles className="w-3 h-3" /> Professional Feature
                                </div>
                            </div>
                        </TiltCard>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Button onClick={() => navigate('/login')} size="lg" className="rounded-full px-8 py-6 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                        <Zap className="w-5 h-5 mr-2 fill-current" />
                        Get Started with ShikshaAssistant
                    </Button>
                </div>
            </div>
        </section>
    );
};
