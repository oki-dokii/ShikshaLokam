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
        <div className="min-h-screen bg-background p-8">
            {/* Header */}
            <header className="flex items-center gap-4 mb-8 max-w-6xl mx-auto">
                <Button variant="ghost" onClick={() => navigate('/')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <BrainCircuit className="w-6 h-6 text-primary" />
                        AI-Assisted Assessment
                    </h1>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Input Section */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">Student Observation</h2>
                        <p className="text-muted-foreground text-sm">Enter detailed notes about the student's performance.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option>Math</option>
                            <option>Science</option>
                            <option>English</option>
                            <option>Social Studies</option>
                        </select>
                        <select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                        className="w-full h-64 bg-background border border-border rounded-xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />

                    <Button
                        onClick={handleAnalyze}
                        disabled={isLoading || !input.trim()}
                        className="w-full py-6 text-base"
                    >
                        {isLoading ? "Analyzing..." : "Generate Assessment Report"}
                    </Button>
                </div>

                {/* Output Section */}
                <div className="space-y-6">
                    {!report && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl p-12">
                            <BookOpen className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-base">Assessment Report will appear here</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                            <p className="text-primary">AI is analyzing learning patterns...</p>
                        </div>
                    )}

                    {report && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {/* Strengths */}
                            <div className="bg-card border-2 border-secondary/30 rounded-xl p-6">
                                <h3 className="text-secondary font-semibold text-lg mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" /> Identified Strengths
                                </h3>
                                <ul className="space-y-2">
                                    {report.strengths.map((s, i) => (
                                        <li key={i} className="flex gap-2 text-foreground">
                                            <span className="text-secondary">•</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Gaps */}
                            <div className="bg-card border-2 border-accent/30 rounded-xl p-6">
                                <h3 className="text-accent font-semibold text-lg mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" /> Learning Gaps
                                </h3>
                                <ul className="space-y-2">
                                    {report.gaps.map((g, i) => (
                                        <li key={i} className="flex gap-2 text-foreground">
                                            <span className="text-accent">•</span> {g}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="bg-primary/5 border-2 border-primary/30 rounded-xl p-6">
                                <h3 className="text-foreground font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-primary" /> Recommended Actions
                                </h3>
                                <ul className="space-y-3">
                                    {report.actions.map((a, i) => (
                                        <li key={i} className="bg-card p-3 rounded-lg text-foreground text-sm border-l-4 border-primary">
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
