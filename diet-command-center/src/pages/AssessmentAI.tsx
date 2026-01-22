import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, BrainCircuit, CheckCircle, AlertTriangle, Lightbulb, Sparkles, GraduationCap, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeStudentPerformance } from "@/lib/gemini";
import { motion, AnimatePresence } from "framer-motion";

const AssessmentAI = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [subject, setSubject] = useState("Math");
    const [grade, setGrade] = useState("Grade 5");
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<{ strengths: string[], gaps: string[], actions: string[] } | null>(null);

    const handleAnalyze = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        try {
            const result = await analyzeStudentPerformance(input, subject, grade);
            setReport(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-inter selection:bg-primary/20 overflow-hidden">
            {/* Background Accents */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
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
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/70">Pedagogical Tool</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-outfit font-bold text-foreground tracking-tight">
                        AI-Assisted Assessment
                    </h1>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Input Section */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-8 border-primary/10 shadow-xl shadow-primary/5"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <ClipboardCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-outfit font-bold text-foreground">Student Observation</h2>
                                    <p className="text-muted-foreground text-sm">Capture details for personalized insights.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Subject</label>
                                    <select
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full bg-white/50 border border-border/50 rounded-xl p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option>Math</option>
                                        <option>Science</option>
                                        <option>English</option>
                                        <option>Social Studies</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Grade Level</label>
                                    <select
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        className="w-full bg-white/50 border border-border/50 rounded-xl p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        {[3, 4, 5, 6, 7, 8].map(g => (
                                            <option key={g}>Grade {g}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Performance Details</label>
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="e.g., Raju struggles with fractions but is very good at multiplication. He often gets confused when adding denominators..."
                                    className="w-full h-72 bg-white/50 border border-border/50 rounded-2xl p-5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-inner font-inter leading-relaxed"
                                />
                            </div>

                            <Button
                                onClick={handleAnalyze}
                                disabled={isLoading || !input.trim()}
                                className="w-full mt-8 py-7 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] gap-3"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Analyzing Patterns...</span>
                                    </>
                                ) : (
                                    <>
                                        <BrainCircuit className="w-5 h-5" />
                                        <span>Generate Assessment Report</span>
                                    </>
                                )}
                            </Button>
                        </motion.div>

                        <div className="flex items-center gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10 text-sm text-primary/80 leading-relaxed shadow-sm">
                            <Lightbulb className="w-6 h-6 shrink-0 text-amber-500" />
                            <p><strong>Tip:</strong> Provide specific examples of student work or common errors for a more targeted intervention plan.</p>
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="lg:col-span-12 xl:col-span-7">
                        <AnimatePresence mode="wait">
                            {!report && !isLoading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 glass-card border-dashed border-2 border-muted/50"
                                >
                                    <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-6">
                                        <BookOpen className="w-10 h-10 text-muted-foreground/50" />
                                    </div>
                                    <h3 className="text-xl font-outfit font-bold text-foreground mb-2">Awaiting Analysis</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                        Once your observations are processed, a comprehensive report with strengths, gaps, and growth actions will appear here.
                                    </p>
                                </motion.div>
                            ) : isLoading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full min-h-[600px] flex flex-col items-center justify-center space-y-6"
                                >
                                    <div className="relative">
                                        <div className="w-24 h-24 border-4 border-primary/10 rounded-full" />
                                        <div className="absolute inset-0 w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                        <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-outfit font-bold text-foreground">AI is processing learning patterns</p>
                                        <p className="text-muted-foreground animate-pulse text-sm">Mapping cognitive strengths and gaps...</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Report Header */}
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Analysis Complete</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-xs text-primary font-bold hover:bg-primary/5 rounded-full px-4">
                                            Export PDF
                                        </Button>
                                    </div>

                                    {/* Strengths Card */}
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        className="glass-card p-8 border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.03] to-transparent relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                                            <CheckCircle className="w-32 h-32 text-emerald-500" />
                                        </div>
                                        <h3 className="text-emerald-600 font-outfit font-bold text-lg mb-6 flex items-center gap-3">
                                            <CheckCircle className="w-6 h-6" /> Identified Strengths
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {report.strengths.map((s, i) => (
                                                <div key={i} className="flex gap-4 p-4 bg-white/40 border border-emerald-500/10 rounded-2xl group hover:border-emerald-500/30 transition-all">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                                                    <p className="text-foreground/80 text-sm leading-relaxed">{s}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Gaps Card */}
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        className="glass-card p-8 border-amber-500/20 bg-gradient-to-br from-amber-500/[0.03] to-transparent relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                                            <AlertTriangle className="w-32 h-32 text-amber-500" />
                                        </div>
                                        <h3 className="text-amber-600 font-outfit font-bold text-lg mb-6 flex items-center gap-3">
                                            <AlertTriangle className="w-6 h-6" /> Learning Gaps
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {report.gaps.map((g, i) => (
                                                <div key={i} className="flex gap-4 p-4 bg-white/40 border border-amber-500/10 rounded-2xl group hover:border-amber-500/30 transition-all">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                                                    <p className="text-foreground/80 text-sm leading-relaxed">{g}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Actions Card */}
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        className="glass-card p-8 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                                            <Lightbulb className="w-32 h-32 text-primary" />
                                        </div>
                                        <h3 className="text-primary font-outfit font-bold text-lg mb-6 flex items-center gap-3">
                                            <Lightbulb className="w-6 h-6 text-amber-500" /> Pedagogical Interventions
                                        </h3>
                                        <div className="space-y-4">
                                            {report.actions.map((a, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="p-5 bg-white/60 border border-primary/10 rounded-2xl relative shadow-sm group hover:shadow-md transition-all"
                                                >
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-primary/20 rounded-r-full group-hover:bg-primary transition-colors" />
                                                    <p className="text-foreground leading-relaxed pl-4">{a}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    <Button
                                        variant="outline"
                                        className="w-full h-16 rounded-2xl border-primary/20 hover:bg-primary/5 text-primary font-bold text-lg transition-all"
                                        onClick={() => {
                                            setReport(null);
                                            setInput("");
                                        }}
                                    >
                                        Start New Analysis
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AssessmentAI;
