import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Layers, Users, TrendingUp, Info, X, Zap, Target, BookOpen, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CLUSTERS } from "@/data/mockData";

const HeatmapDashboard = () => {
    const navigate = useNavigate();
    const [metric, setMetric] = useState<"engagement" | "clarity">("engagement");
    const [districtData, setDistrictData] = useState(CLUSTERS);
    const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
    const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);

    // Derived state for selected district
    const selectedDistrict = districtData.find(d => d.id === selectedDistrictId) || null;

    // Real-time Data Simulator
    useEffect(() => {
        const interval = setInterval(() => {
            setDistrictData(prevData => prevData.map(d => {
                // Random fluctuation +/- 3%
                const changeEngagement = Math.floor(Math.random() * 7) - 3;
                const changeClarity = Math.floor(Math.random() * 5) - 2;

                return {
                    ...d,
                    engagement: Math.min(100, Math.max(0, d.engagement + changeEngagement)),
                    clarity: Math.min(100, Math.max(0, d.clarity + changeClarity))
                };
            }));
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    // Helper to determine color based on score
    const getColor = (score: number) => {
        if (score >= 80) return "fill-green-500/60 stroke-green-400";
        if (score >= 60) return "fill-yellow-500/60 stroke-yellow-400";
        return "fill-red-500/60 stroke-red-400";
    };

    const getGlow = (score: number) => {
        if (score >= 80) return "drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]";
        if (score >= 60) return "drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]";
        return "drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]";
    };

    const handleDeepDive = () => {
        setIsDeepDiveOpen(true);
    };

    const handleGenerateTraining = () => {
        if (selectedDistrict) {
            // Navigate to generator with state
            navigate('/module-generator', { state: { clusterId: selectedDistrict.id } });
        }
    };

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Header */}
            <header className="border-b border-border p-4 flex items-center justify-between bg-card">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Geospatial Classroom Insights</h1>
                        <p className="text-xs text-muted-foreground">Real-time Engagement & Clarity Heatmap</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="flex items-center gap-2 mr-6 text-xs text-secondary font-mono">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                        </span>
                        LIVE DATA
                    </div>

                    <Button
                        variant={metric === "engagement" ? "default" : "outline"}
                        onClick={() => setMetric("engagement")}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        Engagement
                    </Button>
                    <Button
                        variant={metric === "clarity" ? "default" : "outline"}
                        onClick={() => setMetric("clarity")}
                    >
                        <Layers className="w-4 h-4 mr-2" />
                        Clarity
                    </Button>
                </div>
            </header>

            <main className="p-8 flex gap-8 h-[calc(100vh-80px)]">

                {/* LEFT: Map Visualization */}
                <div className="flex-1 bg-card border border-border rounded-xl p-8 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-4 left-4 z-20">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            District Heatmap ({metric})
                        </h2>
                        <p className="text-sm text-muted-foreground">Hover/Click regions for details</p>
                    </div>

                    <div className="flex-1 flex items-center justify-center relative">
                        <svg viewBox="0 0 320 320" className="w-full max-w-2xl text-white drop-shadow-2xl">
                            {districtData.map((d) => {
                                const score = d[metric];
                                const isSelected = selectedDistrict?.id === d.id;

                                return (
                                    <motion.path
                                        key={d.id}
                                        d={d.path}
                                        className={cn(
                                            "cursor-pointer transition-all duration-1000 stroke-[2px]", // Slower transition for smooth color changes
                                            getColor(score),
                                            getGlow(score),
                                            isSelected ? "stroke-white stroke-[3px] z-10 brightness-125" : "hover:brightness-110"
                                        )}
                                        // Make map elements pulse slightly with data updates
                                        animate={{
                                            opacity: 1,
                                            scale: isSelected ? 1.05 : 1,
                                        }}
                                        onClick={() => setSelectedDistrictId(d.id)}
                                        whileHover={{ scale: 1.02 }}
                                    />
                                );
                            })}

                            {/* Connecting Lines / Network Effect */}
                            <motion.line x1="100" y1="100" x2="210" y2="100" className="stroke-white/10 stroke-[1] stroke-dasharray-4" animate={{ strokeDashoffset: [0, 100] }} transition={{ repeat: Infinity, duration: 5, ease: "linear" }} />
                            <motion.line x1="100" y1="210" x2="210" y2="210" className="stroke-white/10 stroke-[1] stroke-dasharray-4" animate={{ strokeDashoffset: [0, -100] }} transition={{ repeat: Infinity, duration: 7, ease: "linear" }} />
                        </svg>

                        {/* Labels for Clusters */}
                        <div className="absolute inset-0 pointer-events-none">
                            {districtData.map((d) => (
                                <div key={d.id} style={{ left: `${(d.coordinates.x / 320) * 100}%`, top: `${(d.coordinates.y / 320) * 100}%` }} className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-mono text-white/50">
                                    {d.id.split('-')[1].toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div>



                    {/* Legend */}
                    <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur p-2 rounded-lg border border-white/10 flex gap-4 text-xs">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500/60 rounded border border-green-400" /> High (80%+)</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500/60 rounded border border-yellow-400" /> Medium (60-79%)</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500/60 rounded border border-red-400" /> Low (&lt;60%)</div>
                    </div>
                </div>

                {/* RIGHT: Stats Panel */}
                <motion.div
                    className="w-96 bg-card border border-border rounded-xl p-6 flex flex-col sticky top-0 shadow-sm"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <h3 className="text-xl font-bold mb-6 text-foreground">
                        District Insights
                    </h3>

                    {selectedDistrict ? (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-2xl font-orbitron flex justify-between items-center">
                                    {selectedDistrict.name}
                                </h4>
                                <div className="text-sm font-mono text-cyan-400 mb-2">{selectedDistrict.type}</div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <span className={`w-2 h-2 rounded-full ${selectedDistrict.engagement > 60 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                                    Live Monitoring Active
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 transition-colors duration-500">
                                    <div className="text-sm text-slate-400 mb-1">Engagement</div>
                                    <div className="text-2xl font-bold text-cyan-400 tabular-nums">
                                        {selectedDistrict.engagement}%
                                    </div>
                                    <div className="text-[10px] text-green-400 flex items-center mt-1">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        +2.4% vs last hr
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 transition-colors duration-500">
                                    <div className="text-sm text-slate-400 mb-1">Clarity</div>
                                    <div className="text-2xl font-bold text-purple-400 tabular-nums">
                                        {selectedDistrict.clarity}%
                                    </div>
                                    <div className="text-[10px] text-slate-500 flex items-center mt-1">
                                        Stable
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/30 p-4 rounded-xl border border-white/5">
                                <h5 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-orange-400" />
                                    Key Alerts
                                </h5>
                                <ul className="text-sm space-y-2 text-slate-300">
                                    {selectedDistrict.primaryIssue !== "None" && (
                                        <li className="flex gap-2 text-red-300 font-bold">
                                            • PRIORITY: {selectedDistrict.primaryIssue}
                                        </li>
                                    )}

                                    <li className="flex gap-2 text-slate-400">
                                        • {selectedDistrict.teacherReflections} updates from teachers today.
                                    </li>
                                </ul>
                            </div>

                            <Button
                                className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 border border-cyan-500/50 animate-shimmer bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]"
                                onClick={handleDeepDive}
                            >
                                Open Deep Dive Analysis
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center">
                            <TrendingUp className="w-12 h-12 mb-4 opacity-20" />
                            <p>Select a region on the map to view real-time metrics and teacher insights.</p>
                        </div>
                    )}
                </motion.div>
            </main>

            {/* DEEP DIVE SLIDE-OVER PANEL */}
            <AnimatePresence>
                {isDeepDiveOpen && selectedDistrict && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDeepDiveOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-xl bg-slate-900 border-l border-white/10 z-50 p-6 shadow-2xl overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-orbitron font-bold text-white mb-1">Deep Dive Analysis</h2>
                                    <p className="text-slate-400 text-sm">Detailed breakdown for {selectedDistrict.name}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsDeepDiveOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Analysis Content */}
                            <div className="space-y-6">

                                {/* AI Summary Card */}
                                <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 p-6 rounded-xl border border-indigo-500/20">
                                    <h3 className="font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                                        <Zap className="w-4 h-4" /> AI Correlated Insight
                                    </h3>
                                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                        {selectedDistrict.description}
                                        <br /><br />
                                        Correlation with <strong>{selectedDistrict.primaryIssue}</strong> is high.
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30">High Confidence</span>
                                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30">Trend: {selectedDistrict.engagement > 60 ? "Positive" : "Critical"}</span>
                                    </div>
                                </div>

                                {/* Specific Metrics */}
                                <div>
                                    <h4 className="font-semibold text-white mb-4">Sub-Region Performance</h4>
                                    <div className="space-y-3">
                                        {selectedDistrict.subRegions.map((sub) => (
                                            <div key={sub.id} className="bg-slate-800/50 p-3 rounded-lg flex items-center justify-between border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                                                        {sub.id}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-200">{sub.name}</div>
                                                        <div className="text-xs text-slate-500">Principal: {sub.principal}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-sm font-bold ${sub.engagement > 60 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                        {sub.engagement}%
                                                    </div>
                                                    <div className="text-[10px] text-slate-500">Eng. Score</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Area */}
                                <div className="pt-4 border-t border-white/10">
                                    <h4 className="font-semibold text-white mb-4">Recommended Actions</h4>

                                    <Button
                                        className="w-full h-14 text-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] mb-4"
                                        onClick={handleGenerateTraining}
                                    >
                                        <Sparkles className="w-5 h-5 mr-3" />
                                        Generate AI Training Module
                                    </Button>

                                    <p className="text-center text-xs text-slate-500">
                                        Creates a personalized micro-learning module considering "{selectedDistrict.primaryIssue}" and teacher feedback.
                                    </p>
                                </div>

                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HeatmapDashboard;
