import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2, BookOpen, CheckCircle, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CLUSTERS } from "@/data/mockData";
import { generateTrainingModule } from "@/lib/gemini";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ReflectionCopilot } from "@/components/reflection/ReflectionCopilot";

const ModuleGenerator = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Initialize clusterId from location state directly to avoid flash of "Select Value" content
    const [clusterId, setClusterId] = useState<string | null>(() => location.state?.clusterId || null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedModule, setGeneratedModule] = useState<any | null>(null);
    const [showReflection, setShowReflection] = useState(false);
    const [localChallenge, setLocalChallenge] = useState("");
    const [resourceMode, setResourceMode] = useState("Optimized");
    const [pedagogyStyle, setPedagogyStyle] = useState("Standard");

    const cluster = CLUSTERS.find(c => c.id === clusterId);

    const runGeneration = async (topic: string) => {
        if (!cluster) return;
        setIsGenerating(true);
        console.log("Generating for topic:", topic);
        try {
            // Pass resourceMode and pedagogyStyle to the API call
            const moduleData = await generateTrainingModule(topic, cluster, localChallenge, resourceMode, pedagogyStyle);
            setGeneratedModule(moduleData);
            toast.success(`Generated using ${pedagogyStyle} approach!`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate module. AI Service busy.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateClick = () => {
        if (cluster) {
            runGeneration(cluster.primaryIssue);
        }
    };

    useEffect(() => {
        // Auto-trigger if prefilled topic is provided
        if (location.state?.prefilledTopic && location.state?.clusterId) {
            const timer = setTimeout(() => {
                runGeneration(location.state.prefilledTopic);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [location]);

    if (!cluster) {
        return <div className="p-8 text-white">Select a cluster from the dashboard first.</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

            {/* Header */}
            <header className="flex items-center gap-4 mb-8 relative z-10">
                <Button variant="ghost" onClick={() => navigate('/heatmap')} className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Map
                </Button>
                <div>
                    <h1 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-brand-cyan" />
                        AI Training Generator
                    </h1>
                    <p className="text-sm text-slate-400">Contextualized Content Engine</p>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">

                {/* LEFT: Context Card */}
                <div className="space-y-6">
                    <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-bold mb-4 text-cyan-400">Target Audience Profile</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Cluster</span>
                                <span className="font-mono text-white">{cluster.name}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Primary Issue</span>
                                <span className="font-bold text-red-400">{cluster.primaryIssue}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Language Context</span>
                                <span className="text-white">{cluster.language}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-slate-400">Infrastructure</span>
                                <span className="text-white">{cluster.infrastructure}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5">
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                            Connectivity & Resources
                        </label>
                        <select
                            value={resourceMode}
                            onChange={(e) => setResourceMode(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-400 outline-none mb-4"
                        >
                            <option value="Optimized">Optimized (Default)</option>
                            <option value="Low Bandwidth">Low Bandwidth (Text/Images)</option>
                            <option value="Offline / No Internet">Offline / No Internet (Printables)</option>
                            <option value="Digital Classroom">Digital Classroom (Smartboard)</option>
                        </select>

                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                            Pedagogy Style
                        </label>
                        <select
                            value={pedagogyStyle}
                            onChange={(e) => setPedagogyStyle(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:border-purple-400 outline-none mb-4"
                        >
                            <option value="Standard">Standard (Direct Instruction)</option>
                            <option value="Creative / Innovation">Creative / Innovation</option>
                            <option value="Game-Based Learning">Game-Based Learning</option>
                            <option value="Socratic / Inquiry">Socratic / Inquiry</option>
                        </select>

                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                            Address Specific Local Challenge (Optional)
                        </label>
                        <Textarea
                            placeholder="e.g., 'Harvest season is causing low attendance' or 'Flood warning upcoming'"
                            value={localChallenge}
                            onChange={(e) => setLocalChallenge(e.target.value)}
                            className="bg-slate-900 border-white/10 focus:border-brand-cyan text-slate-200 placeholder:text-slate-600 resize-none h-20"
                        />
                    </div>

                    {!generatedModule && (
                        <div className="mt-8">
                            <Button
                                onClick={handleGenerateClick}
                                disabled={isGenerating}
                                className="w-full h-16 text-lg bg-brand-cyan text-brand-dark hover:bg-cyan-400 font-bold relative overflow-hidden"
                            >
                                {isGenerating ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Analyzing Data & Generating Curriculum...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-6 h-6" />
                                        Generate "{cluster.primaryIssue}" Module
                                    </div>
                                )}
                            </Button>
                            <p className="text-center text-xs text-slate-500 mt-2">
                                Uses Gemini 1.5 Pro to synthesize 15-min micro-learning.
                            </p>
                        </div>
                    )}
                </div>

                {/* RIGHT: Generated Content */}
                <div className="min-h-[500px]">
                    {generatedModule ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            <div className="bg-brand-cyan/20 p-6 border-b border-white/10">
                                <span className="inline-block px-2 py-1 bg-brand-cyan text-brand-dark text-xs rounded mb-2 font-bold">MICRO-LEARNING MODULE</span>
                                {generatedModule.isMock && (
                                    <span className="inline-block px-2 py-1 bg-yellow-500 text-black text-xs rounded mb-2 ml-2 font-bold">SIMULATED (API ERROR)</span>
                                )}
                                <h1 className="text-3xl font-bold text-white mb-2">{generatedModule.title}</h1>
                                <div className="flex items-center gap-4 text-slate-300 font-bold font-mono">
                                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-brand-cyan" /> {generatedModule.duration}</span>
                                    <span>|</span>
                                    <span>Target: {cluster.name}</span>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">

                                <div >
                                    <h3 className="font-bold text-cyan-400 uppercase tracking-wider text-xs mb-2">Learning Objective</h3>
                                    <p className="text-lg font-medium text-slate-200">{generatedModule.objective}</p>
                                </div>

                                <div className="space-y-6">
                                    {generatedModule.content.map((section: any, idx: number) => (
                                        <div key={idx} className="bg-slate-950/50 p-6 rounded-xl border border-white/10">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-cyan/20 flex items-center justify-center text-cyan-400 font-bold shrink-0 border border-brand-cyan/30">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white mb-2 capitalize">{section.title} <span className="text-slate-400 font-normal text-sm">({section.type})</span></h4>
                                                    <div className="prose text-slate-300 text-sm">
                                                        {Array.isArray(section.questions) ? (
                                                            <ul className="list-disc pl-4 marker:text-brand-cyan">
                                                                {section.questions.map((q: string, i: number) => <li key={i}>{q}</li>)}
                                                            </ul>
                                                        ) : (
                                                            <p>{section.body}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-white/10">
                                    <Button className="flex-1 bg-brand-cyan text-brand-dark hover:bg-cyan-400 font-bold">
                                        <Share2 className="w-4 h-4 mr-2" /> Publish to DIET App
                                    </Button>
                                    <Button variant="outline" className="border-white/20 text-slate-300 hover:text-white hover:bg-slate-800">
                                        <Download className="w-4 h-4 mr-2" /> PDF
                                    </Button>
                                </div>

                                <div className="mt-8 bg-brand-cyan/5 border border-brand-cyan/20 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-brand-cyan text-brand-dark p-2 rounded-lg">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">Post-Lesson Reflection</h4>
                                            <p className="text-xs text-slate-400">Lock in your learning with a quick chat.</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setShowReflection(true)}
                                        className="bg-brand-cyan text-brand-dark hover:bg-cyan-400 font-bold"
                                    >
                                        Launch Coach
                                    </Button>
                                </div>

                            </div>

                        </motion.div>
                    ) : (
                        !isGenerating && (
                            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-12 text-center text-slate-500">
                                <Sparkles className="w-16 h-16 mb-4 opacity-20" />
                                <h3 className="text-xl font-medium mb-2">Ready to Generate</h3>
                                <p>AI will analyze the cluster's specific challenges (e.g., "{cluster.primaryIssue}") to create a custom curriculum.</p>
                            </div>
                        )
                    )}
                </div>

            </main >

            {generatedModule && (
                <ReflectionCopilot
                    isOpen={showReflection}
                    onClose={() => setShowReflection(false)}
                    moduleContext={{
                        topic: generatedModule.title,
                        clusterId: clusterId || ""
                    }}
                />
            )}
        </div >
    );
};

export default ModuleGenerator;
