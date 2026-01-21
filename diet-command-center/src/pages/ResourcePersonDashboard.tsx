import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    Map as MapIcon,
    Users,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    ShieldAlert,
    GraduationCap,
    Mic,
    ClipboardCheck,
    Zap,
    LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MOCK_BLOCK_DATA, getHealthColor } from '@/lib/rpAnalytics';
import { MentorCopilot } from '@/components/rp/MentorCopilot';
import { SpaceScene } from '@/components/layout/SpaceScene';

type RPRole = 'BRP' | 'CRP' | 'ARP';

export default function ResourcePersonDashboard() {
    const [role, setRole] = useState<RPRole>('BRP');
    const [selectedCluster, setSelectedCluster] = useState(MOCK_BLOCK_DATA.clusters[0]);
    const [showMentorCopilot, setShowMentorCopilot] = useState(false);

    const handleGenerateReport = () => {
        const reportType = role === 'BRP' ? 'Cluster Health Report' : role === 'ARP' ? 'Academic Excellence Plan' : 'Mentorship Activity Log';

        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: `Generating ${reportType} for ${selectedCluster.name}...`,
                success: (data) => `${reportType} has been generated and sent to your DIET email.`,
                error: 'Failed to generate report. Please try again.',
            }
        );
    };

    return (
        <div className="min-h-screen mesh-bg relative overflow-x-hidden p-10 selection:bg-brand-blue/30">
            <SpaceScene />
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-14 gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center animate-glow shadow-lg shadow-brand-blue/20">
                                <LayoutDashboard className="w-7 h-7 text-brand-blue" />
                            </div>
                            <h1 className="text-4xl font-extrabold font-orbitron tracking-tighter text-white">RP <span className="text-brand-blue italic">ECOSYSTEM</span></h1>
                        </div>
                        <p className="text-slate-400 text-base font-medium ml-1">Managing {MOCK_BLOCK_DATA.name} • <span className="text-brand-blue/80">420+ Teachers Live</span></p>
                    </div>

                    <div className="flex bg-slate-900/60 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl">
                        {(['BRP', 'ARP', 'CRP'] as RPRole[]).map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${role === r ? 'bg-brand-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                {r} View
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Stats Bar */}
                    <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-10">
                        <motion.div
                            whileHover={{
                                y: -10,
                                scale: 1.02
                            }}
                            className="premium-glass p-8 border-brand-blue/10 relative overflow-hidden group spatial-card shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 blur-3xl group-hover:bg-brand-blue/20 transition-all pointer-events-none" />
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                {role === 'BRP' ? 'Block Health' : role === 'ARP' ? 'Academic Avg' : 'Cluster Health'}
                            </p>
                            <div className="flex items-end justify-between relative z-10">
                                <h3 className="text-5xl font-black font-orbitron text-white">{role === 'BRP' ? '72%' : role === 'ARP' ? '68%' : '78%'}</h3>
                                <Badge className={role === 'BRP' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 px-3 py-1' : 'bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1'}>
                                    {role === 'BRP' ? '+5% alert' : '+12% trend'}
                                </Badge>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ y: -5, scale: 1.02 }} className="premium-glass p-8 border-brand-emerald/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-emerald/10 blur-3xl group-hover:bg-brand-emerald/20 transition-all" />
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                {role === 'BRP' ? 'Total Schools' : role === 'ARP' ? 'Training Completion' : 'Schools Visited'}
                            </p>
                            <div className="flex items-end justify-between relative z-10">
                                <h3 className="text-5xl font-black font-orbitron text-white">{role === 'BRP' ? MOCK_BLOCK_DATA.totalSchools : role === 'ARP' ? '84%' : '12/15'}</h3>
                                <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-brand-emerald" />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ y: -5, scale: 1.02 }} className="premium-glass p-8 border-red-500/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl group-hover:bg-red-500/20 transition-all" />
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                {role === 'BRP' ? 'Critical Interventions' : role === 'ARP' ? 'Pedagogical Gaps' : 'Teacher Requests'}
                            </p>
                            <div className="flex items-end justify-between relative z-10">
                                <h3 className={`text-5xl font-black font-orbitron ${role === 'BRP' ? 'text-red-500' : 'text-orange-500'}`}>
                                    {role === 'BRP' ? MOCK_BLOCK_DATA.criticalInterventionsCount : role === 'ARP' ? '12' : '4'}
                                </h3>
                                <div className={`w-12 h-12 rounded-xl ${role === 'BRP' ? 'bg-red-500/10' : 'bg-orange-500/10'} flex items-center justify-center`}>
                                    <ShieldAlert className={`w-6 h-6 ${role === 'BRP' ? 'text-red-500' : 'text-orange-500'}`} />
                                </div>
                            </div>
                        </motion.div>

                        <div className="flex items-center justify-center p-2">
                            <Button
                                className="w-full h-16 premium-button bg-brand-blue text-white hover:bg-blue-400 font-black uppercase tracking-widest text-[11px] gap-3 shadow-[0_0_30px_-5px_hsla(217,91%,60%,0.4)]"
                                onClick={() => setShowMentorCopilot(true)}
                            >
                                <Mic className="w-6 h-6" /> Mentor Copilot
                            </Button>
                        </div>
                    </div>

                    {/* Left Column: Cluster List */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-center justify-between mb-4 px-4">
                            <h3 className="font-black text-[11px] uppercase tracking-[0.25em] text-slate-500">Clusters</h3>
                            <Filter className="w-5 h-5 text-slate-500 cursor-pointer hover:text-brand-blue transition-colors" />
                        </div>
                        {MOCK_BLOCK_DATA.clusters.map((cluster) => (
                            <motion.div
                                key={cluster.id}
                                whileHover={{
                                    scale: 1.05,
                                    x: 10,
                                    rotateY: -10,
                                    translateZ: 10
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                onClick={() => setSelectedCluster(cluster)}
                                className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group spatial-card ${selectedCluster.id === cluster.id
                                    ? 'bg-brand-blue/10 border-brand-blue/40 shadow-[0_15px_40px_rgba(59,130,246,0.2)]'
                                    : 'bg-black/20 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                {selectedCluster.id === cluster.id && (
                                    <motion.div layoutId="active-pill" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-blue rounded-full" />
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white tracking-tight">{cluster.name}</h4>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${getHealthColor(cluster.overallHealth)}`}>
                                        {cluster.overallHealth}%
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="text-[9px] py-0 border-white/5 text-slate-500 font-medium">
                                        {cluster.schools.length} Schools
                                    </Badge>
                                    {cluster.needsSupportCount > 0 && (
                                        <Badge className="bg-red-500/10 text-red-500 border-none text-[9px] py-0 font-bold">
                                            {cluster.needsSupportCount} ALERTS
                                        </Badge>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Column: Deep Dive */}
                    <div className="lg:col-span-3">
                        <div className="premium-glass bg-black/30 p-10 h-full relative overflow-hidden border-white/5 shadow-inner">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent" />
                            <div className="flex items-center justify-between mb-12 relative z-10">
                                <div>
                                    <h2 className="text-3xl font-black text-white flex items-center gap-4 tracking-tighter">
                                        <MapIcon className="w-8 h-8 text-brand-blue" />
                                        {selectedCluster.name} <span className="text-slate-800">|</span>
                                        <span className="text-brand-blue italic ml-1">
                                            {role === 'BRP' ? ' HEALTH INSIGHT' : role === 'ARP' ? ' ACADEMIC AUDIT' : ' SUPPORT PRIORITY'}
                                        </span>
                                    </h2>
                                    <p className="text-slate-500 mt-2 text-base font-medium">
                                        {role === 'BRP' ? 'Deep analysis of pedagogical and engagement trends' :
                                            role === 'ARP' ? 'Subject-specific training gaps and curriculum alignment' :
                                                'Priority teacher support requests and school visit logs'}
                                    </p>
                                </div>
                                <Button
                                    className="premium-button border-brand-blue/30 text-brand-blue hover:text-white hover:bg-brand-blue font-black uppercase tracking-widest text-[11px] h-14 px-6"
                                    onClick={handleGenerateReport}
                                >
                                    {role === 'BRP' ? 'Generate Report' : role === 'ARP' ? 'Academic Plan' : 'Cluster Log'}
                                </Button>
                            </div>

                            {/* Heatmap Simulation */}
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1 }
                                    }
                                }}
                                className="space-y-4 relative z-10"
                            >
                                {selectedCluster.schools.map((school) => (
                                    <motion.div
                                        key={school.id}
                                        variants={{
                                            hidden: { x: -20, opacity: 0 },
                                            visible: { x: 0, opacity: 1 }
                                        }}
                                        className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all flex items-center gap-6 group"
                                    >
                                        <div className={`w-1.5 h-12 rounded-full ${school.averageEngagement > 80 ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : school.averageEngagement > 60 ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'}`} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-bold text-white text-lg tracking-tight group-hover:text-brand-cyan transition-colors">{school.name}</h4>
                                                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-brand-cyan transition-colors" />
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                                <span className="flex items-center gap-1.5"><Users className="w-3 h-3 text-brand-cyan" /> {school.teacherCount} Teachers</span>
                                                <span className="flex items-center gap-1.5"><ClipboardCheck className="w-3 h-3 text-brand-purple" /> Last visited: {school.lastVisitDate}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-black font-orbitron text-white leading-none">{school.averageEngagement}%</p>
                                            <p className="text-[10px] text-brand-cyan uppercase font-black tracking-tighter mt-1 opacity-60">Engagement</p>
                                        </div>
                                        <div className="w-32">
                                            {school.atRiskCount > 0 ? (
                                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 text-center group-hover:bg-red-500/20 transition-all">
                                                    <p className="text-red-500 font-black text-lg leading-none">{school.atRiskCount}</p>
                                                    <p className="text-[8px] text-red-400 font-black uppercase tracking-tighter">At Risk</p>
                                                </div>
                                            ) : (
                                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-2.5 text-center group-hover:bg-green-500/20 transition-all">
                                                    <Zap className="w-4 h-4 text-green-500 mx-auto" />
                                                    <p className="text-[8px] text-green-400 font-black uppercase tracking-tighter mt-0.5">Stable</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="mt-12 p-10 bg-gradient-to-r from-brand-blue/20 to-brand-emerald/5 border-l-4 border-brand-blue rounded-r-3xl relative overflow-hidden group shadow-xl"
                            >
                                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/10 blur-[80px] pointer-events-none" />
                                <h5 className="font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-3 mb-4 text-brand-blue">
                                    <Zap className="w-5 h-5 animate-pulse" />
                                    {role === 'BRP' ? 'ADMINISTRATIVE STRATEGY' : role === 'ARP' ? 'ACADEMIC INSIGHT' : 'MENTOR SUGGESTION'}
                                </h5>
                                <p className="text-base text-slate-300 font-medium leading-[1.8] relative z-10">
                                    {role === 'BRP' ? (
                                        `${selectedCluster.name} has shown a 12% drop in 7th Grade Math participation. Recommend scheduling a pedagogical review at **${selectedCluster.schools.find(s => s.averageEngagement < 60)?.name || 'Needs Support schools'}** within the next 5 days.`
                                    ) : role === 'ARP' ? (
                                        `Teachers at ${selectedCluster.name} are requesting more micro-modules in 'Fraction Division' and 'Static Electricity'. Predictive Gap: 22% dip in quiz scores.`
                                    ) : (
                                        `CRP Tip: Target your next visit to **${selectedCluster.schools.find(s => s.averageEngagement < 60)?.name || 'Needs Support schools'}**. 3 teachers haven't recorded an observation in 14 days.`
                                    )}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showMentorCopilot && (
                    <MentorCopilot onClose={() => setShowMentorCopilot(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}
