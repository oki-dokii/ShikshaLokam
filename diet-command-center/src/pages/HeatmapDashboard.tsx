import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Layers, Users, TrendingUp, Info, X, Zap, Target, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Initial Mock Data
const initialDistrictData = [
    { id: "d1", name: "North District", engagement: 78, clarity: 85, teacherReflections: 12, path: "M50,50 L150,50 L150,150 L50,150 Z" },
    { id: "d2", name: "East Cluster", engagement: 65, clarity: 72, teacherReflections: 8, path: "M160,50 L260,50 L260,150 L160,150 Z" },
    { id: "d3", name: "South Zone", engagement: 88, clarity: 90, teacherReflections: 24, path: "M50,160 L150,160 L150,260 L50,260 Z" },
    { id: "d4", name: "West Banks", engagement: 45, clarity: 55, teacherReflections: 5, path: "M160,160 L260,160 L260,260 L160,260 Z" },
];

const HeatmapDashboard = () => {
    const navigate = useNavigate();
    const [metric, setMetric] = useState<"engagement" | "clarity">("engagement");
    const [districtData, setDistrictData] = useState(initialDistrictData);
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

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
            {/* Background Grids */}
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 border-b border-white/10 p-4 flex items-center justify-between backdrop-blur-md bg-slate-950/50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/')} className="text-slate-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-xl font-orbitron font-bold tracking-wider text-white">Geospatial Classroom Insights</h1>
                        <p className="text-xs text-slate-400">Real-time Engagement & Clarity Heatmap</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="flex items-center gap-2 mr-6 text-xs text-green-400 font-mono">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        LIVE DATA
                    </div>

                    <Button
                        variant={metric === "engagement" ? "default" : "outline"}
                        className={cn(metric === "engagement" ? "bg-cyan-600 hover:bg-cyan-500" : "border-slate-700 text-slate-400")}
                        onClick={() => setMetric("engagement")}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        Engagement
                    </Button>
                    <Button
                        variant={metric === "clarity" ? "default" : "outline"}
                        className={cn(metric === "clarity" ? "bg-purple-600 hover:bg-purple-500" : "border-slate-700 text-slate-400")}
                        onClick={() => setMetric("clarity")}
                    >
                        <Layers className="w-4 h-4 mr-2" />
                        Clarity
                    </Button>
                </div>
            </header>

            <main className="p-8 flex gap-8 relative z-10 h-[calc(100vh-80px)]">

                {/* LEFT: Map Visualization */}
                <div className="flex-1 bg-slate-900/40 border border-white/5 rounded-2xl p-8 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-4 left-4 z-20">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-cyan-400" />
                            District Heatmap ({metric})
                        </h2>
                        <p className="text-sm text-slate-500">Hover/Click regions for details</p>
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
                    className="w-96 bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex flex-col glass-morphism sticky top-0"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                        District Insights
                    </h3>

                    {selectedDistrict ? (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-2xl font-orbitron flex justify-between items-center">
                                    {selectedDistrict.name}
                                    <span className="text-xs font-mono text-slate-500">ID: {selectedDistrict.id.toUpperCase()}</span>
                                </h4>
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
                                    {selectedDistrict.engagement < 60 && (
                                        <li className="flex gap-2 text-red-300">
                                            • Low student participation detected in afternoon sessions.
                                        </li>
                                    )}
                                    {selectedDistrict.clarity > 80 && (
                                        <li className="flex gap-2 text-green-300">
                                            • High concept retention in recent science modules.
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
                                        Analysis of {selectedDistrict.teacherReflections} teacher reflections indicates a strong correlation between
                                        <strong> interactive science labs</strong> and the {selectedDistrict.clarity}% clarity score.
                                        Schools attempting the "Visual Mnemonics" hack reported a 15% boost in retention.
                                    </p>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30">High Confidence</span>
                                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30">Trend: Positive</span>
                                    </div>
                                </div>

                                {/* Specific Metrics */}
                                <div>
                                    <h4 className="font-semibold text-white mb-4">Sub-Region Performance</h4>
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="bg-slate-800/50 p-3 rounded-lg flex items-center justify-between border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                                                        S{i}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-200">School Block {Math.random().toString(36).substring(7).toUpperCase()}</div>
                                                        <div className="text-xs text-slate-500">Principal: Dr. A. Sharma</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-sm font-bold ${selectedDistrict.engagement > 60 ? 'text-green-400' : 'text-yellow-400'}`}>
                                                        {(selectedDistrict.engagement + (Math.random() * 10 - 5)).toFixed(1)}%
                                                    </div>
                                                    <div className="text-[10px] text-slate-500">Eng. Score</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Focus Areas */}
                                <div>
                                    <h4 className="font-semibold text-white mb-4">Recommended Focus Areas</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                                            <Target className="w-5 h-5 text-pink-400 mb-2" />
                                            <h5 className="text-sm font-medium text-slate-200 mb-1">Peer Learning</h5>
                                            <p className="text-xs text-slate-400">Encourage more group breakout sessions to boost afternoon engagement.</p>
                                        </div>
                                        <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                                            <BookOpen className="w-5 h-5 text-cyan-400 mb-2" />
                                            <h5 className="text-sm font-medium text-slate-200 mb-1">Visual Aids</h5>
                                            <p className="text-xs text-slate-400">Distribute the new "Science 3D" deck to Cluster B teachers.</p>
                                        </div>
                                    </div>
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
