import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, BrainCircuit, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeStudentPerformance } from "@/lib/gemini";
import { motion } from "framer-motion";

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
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

            {/* Header */}
            <header className="flex items-center gap-4 mb-8 relative z-10">
                <Button variant="ghost" onClick={() => navigate('/')} className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                        <BrainCircuit className="w-6 h-6 text-brand-purple" />
                        AI-Assisted Assessment
                    </h1>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">

                {/* Input Section */}
                <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Student Observation</h2>
                        <p className="text-slate-400 text-sm">Enter detailed notes about the student's performance.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-purple"
                        >
                            <option>Math</option>
                            <option>Science</option>
                            <option>English</option>
                            <option>Social Studies</option>
                        </select>
                        <select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-purple"
                        >
                            <option>Grade 3</option>
                            <option>Grade 4</option>
                            <option>Grade 5</option>
                            <option>Grade 6</option>
                            <option>Grade 7</option>
                            <option>Grade 8</option>
                        </select>
                    </div>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., Raju struggles with fractions but is very good at multiplication. He often gets confused when adding denominators..."
                        className="w-full h-64 bg-slate-800 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-purple resize-none"
                    />

                    <Button
                        onClick={handleAnalyze}
                        disabled={isLoading || !input.trim()}
                        className="w-full bg-brand-purple hover:bg-purple-600 text-white py-6 text-lg font-bold rounded-xl"
                    >
                        {isLoading ? "Analyzing..." : "Generate Assessment Report"}
                    </Button>
                </div>

                {/* Output Section */}
                <div className="space-y-6">
                    {!report && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/10 rounded-2xl p-12">
                            <BookOpen className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-lg">Assessment Report will appear here</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-purple"></div>
                            <p className="text-brand-purple animate-pulse">AI is analyzing learning patterns...</p>
                        </div>
                    )}

                    {report && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {/* Strengths */}
                            <div className="bg-slate-900 border border-green-500/30 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <CheckCircle className="w-24 h-24 text-green-500" />
                                </div>
                                <h3 className="text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" /> Identified Strengths
                                </h3>
                                <ul className="space-y-2 relative z-10">
                                    {report.strengths.map((s, i) => (
                                        <li key={i} className="flex gap-2 text-slate-300">
                                            <span className="text-green-500">•</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Gaps */}
                            <div className="bg-slate-900 border border-yellow-500/30 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <AlertTriangle className="w-24 h-24 text-yellow-500" />
                                </div>
                                <h3 className="text-yellow-400 font-bold text-lg mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" /> Learning Gaps
                                </h3>
                                <ul className="space-y-2 relative z-10">
                                    {report.gaps.map((g, i) => (
                                        <li key={i} className="flex gap-2 text-slate-300">
                                            <span className="text-yellow-500">•</span> {g}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="bg-gradient-to-br from-brand-purple/20 to-blue-500/20 border border-brand-purple/30 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Lightbulb className="w-24 h-24 text-white" />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-yellow-300" /> Recommended Actions
                                </h3>
                                <ul className="space-y-3 relative z-10">
                                    {report.actions.map((a, i) => (
                                        <li key={i} className="bg-black/20 p-3 rounded-lg text-slate-200 text-sm border-l-2 border-brand-purple">
                                            {a}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default AssessmentAI;
