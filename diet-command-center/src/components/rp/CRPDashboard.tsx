import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Calendar,
    CheckCircle2,
    Clock,
    BookOpen,
    Users,
    WifiOff,
    ArrowRight,
    Navigation,
    Route,
    Map,
    X as XIcon,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { ClusterMetrics } from '@/types/courseTypes';
import { DropoutRadar } from '@/components/dashboard/DropoutRadar';

const OBSERVATION_DOMAINS = [
    { name: 'Classroom Mgmt', score: 78, trend: 'up' },
    { name: 'Student Voice', score: 62, trend: 'down' },
    { name: 'TLM Integrated', score: 85, trend: 'stable' },
    { name: 'Assessment', score: 54, trend: 'up' },
];

const PEER_GROUPS = [
    { id: 1, name: 'Math Circle - Block A', members: 8, nextSession: 'Tomorrow, 4 PM' },
    { id: 2, name: 'Science Lab Setup', members: 4, nextSession: 'Wed, 2 PM' },
];

export function CRPDashboard({ cluster }: { cluster: ClusterMetrics }) {
    const [visits, setVisits] = useState(cluster.schools.map((s, i) => ({
        id: i + 1,
        school: s.name,
        status: i === 0 ? 'urgent' : i === 1 ? 'pending' : 'completed',
        reason: i === 0 ? 'Attendance Drop' : i === 1 ? 'Academic Review' : 'Compliance Check',
        distance: `${Math.round(0.5 + Math.random() * 4)} km`,
        time: `${9 + i}:00 AM`
    })));
    const [isNavigating, setIsNavigating] = useState(false);
    const [selectedResource, setSelectedResource] = useState<string | null>(null);
    const [activeCircle, setActiveCircle] = useState<string | null>(null);
    const [navProgress, setNavProgress] = useState(0);

    // Update visits when cluster changes
    useEffect(() => {
        setVisits(cluster.schools.map((s, i) => ({
            id: i + 1,
            school: s.name,
            status: i === 0 ? 'urgent' : i === 1 ? 'pending' : 'completed',
            reason: i === 0 ? 'Attendance Drop' : i === 1 ? 'Academic Review' : 'Compliance Check',
            distance: `${Math.round(0.5 + Math.random() * 4)} km`,
            time: `${9 + i}:00 AM`
        })));
    }, [cluster]);

    const handleStartNavigation = () => {
        const nextVisit = visits.find(v => v.status !== 'completed');
        if (!nextVisit) {
            toast.success("Daily Itinerary Complete", {
                description: "All scheduled visits for today have been logged and synced."
            });
            return;
        }

        setIsNavigating(true);
        setNavProgress(0);
        const loadingToast = toast.loading(`Mapping optimized route to ${nextVisit.school}...`);

        setTimeout(() => {
            toast.dismiss(loadingToast);
            toast.success(`Navigation Active`, {
                description: `ETA to ${nextVisit.school}: 8 mins via Main Aurad Road (No Traffic).`,
                icon: <Navigation className="w-4 h-4 text-indigo-500" />
            });
        }, 1500);
    };

    const handlePocketKit = (item: string) => {
        const loading = toast.loading(`Synchronizing offline module: ${item}...`);
        setTimeout(() => {
            toast.dismiss(loading);
            setSelectedResource(item);
            toast.success(`${item} Ready`, {
                description: "This module is available offline for use in low-network zones.",
                icon: <WifiOff className="w-4 h-4 text-emerald-500" />
            });
        }, 1200);
    };

    const handlePeerCircle = (name: string) => {
        const loading = toast.loading(`Authenticating session for ${name}...`);
        setTimeout(() => {
            toast.dismiss(loading);
            setActiveCircle(name);
            toast.success('Joined Peer Circle', {
                description: 'You are now connected with 3 active members in this circle.',
            });
        }, 1500);
    };

    const toggleVisitStatus = (id: number) => {
        const visit = visits.find(v => v.id === id);
        if (visit?.status === 'completed') return;

        setVisits(prev => prev.map(v =>
            v.id === id ? { ...v, status: 'completed' } : v
        ));

        toast.success(`Observation Logged`, {
            description: `Pedagogical findings for ${visit?.school} have been synced securely.`
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Row: Visit Planner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-white/90 dark:bg-[#0A0F1E]/60 border-slate-200 dark:border-white/5 backdrop-blur-2xl shadow-xl dark:shadow-none relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-transparent pointer-events-none" />
                    <CardHeader className="relative z-10 border-b border-slate-100 dark:border-white/5 pb-4 bg-slate-50/50 dark:bg-white/[0.02]">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white font-orbitron tracking-wide text-xl">
                                    <div className="p-2.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-inner">
                                        <Route className="w-6 h-6" />
                                    </div>
                                    Smart Visit Planner
                                </CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">
                                    AI-optimized route based on urgency & proximity sensors
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="border-indigo-500/20 dark:border-white/10 text-indigo-600 dark:text-indigo-300 bg-indigo-500/5 px-3 py-1 font-black uppercase tracking-widest text-[9px]">
                                    <Map className="w-3 h-3 mr-1.5" /> Map View
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-8 px-8 relative z-10">
                        <AnimatePresence mode="wait">
                            {!isNavigating ? (
                                <motion.div
                                    key="visit-list"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    {visits.map((visit, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            key={visit.id}
                                            onClick={() => toggleVisitStatus(visit.id)}
                                            className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 hover:bg-white dark:hover:bg-indigo-500/[0.05] transition-all group/item cursor-pointer shadow-sm relative overflow-hidden"
                                        >
                                            <div className="absolute left-0 top-0 w-1 h-full bg-transparent group-hover/item:bg-indigo-500 transition-all shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl font-orbitron transition-all transform group-hover/item:scale-105 ${visit.status === 'urgent' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                                                    visit.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                                                        'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20'
                                                    }`}>
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-slate-800 dark:text-white group-hover/item:text-indigo-600 transition-colors tracking-tight">{visit.school}</h4>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <Badge variant="outline" className="bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[10px] h-6 rounded-lg border-slate-200/50 dark:border-white/10 font-bold px-2">{visit.distance}</Badge>
                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5" /> {visit.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-3">
                                                <Badge className={`px-3 py-1 text-[9px] uppercase tracking-[0.2em] font-black border-0 ${visit.status === 'urgent' ? 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 shadow-lg shadow-red-500/10' :
                                                    visit.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:bg-green-500/20 dark:text-green-400' :
                                                        'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'
                                                    }`}>
                                                    {visit.reason}
                                                </Badge>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${visit.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-slate-600'}`}>
                                                    <CheckCircle2 className={`w-5 h-5 ${visit.status === 'completed' ? 'animate-bounce' : ''}`} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <Button
                                        onClick={handleStartNavigation}
                                        className="w-full mt-6 h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-[0.2em] uppercase text-xs shadow-2xl shadow-indigo-600/30 transition-all rounded-2xl relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-shimmer pointer-events-none" />
                                        <Navigation className="w-4 h-4 mr-3" />
                                        Start Smart Navigation
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="navigation-active"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 aspect-video md:aspect-[21/9] border border-indigo-500/20 shadow-2xl"
                                >
                                    <img
                                        src="/navigation_map_mockup.png"
                                        alt="Navigation"
                                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40" />

                                    {/* HUD Elements */}
                                    <div className="absolute top-6 left-6 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 space-y-2 max-w-[200px]">
                                        <Badge className="bg-indigo-500 text-white border-0 text-[8px] uppercase tracking-widest font-black">Next Turn</Badge>
                                        <p className="text-sm font-black text-white leading-tight">Turn Right onto <br />Aurad Main Road</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">In 450 meters</p>
                                    </div>

                                    <div className="absolute bottom-6 left-6 right-6 p-6 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex flex-col items-center justify-center">
                                                <span className="text-xl font-black text-white font-orbitron">8</span>
                                                <span className="text-[8px] text-indigo-300 font-black uppercase tracking-widest">MINS</span>
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-white font-black text-lg tracking-tight">GHS Aurad Main</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                                    <MapPin className="w-3 h-3 text-indigo-500" /> 1.2 KM Remaining
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                onClick={() => {
                                                    const nextVisit = visits.find(v => v.status !== 'completed');
                                                    if (nextVisit) toggleVisitStatus(nextVisit.id);
                                                    setIsNavigating(false);
                                                }}
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-xl"
                                            >
                                                Arrived
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsNavigating(false)}
                                                className="border-white/10 bg-white/5 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] px-6 h-12 rounded-xl"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Simulated Pulse */}
                                    <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2">
                                        <div className="w-4 h-4 bg-indigo-500 rounded-full animate-ping opacity-75" />
                                        <div className="absolute inset-0 w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.8)]" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-white/90 dark:bg-[#0A0F1E]/60 border-slate-200 dark:border-white/5 backdrop-blur-xl shadow-xl">
                        <CardHeader className="pb-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white font-orbitron tracking-wide text-[10px] font-black uppercase tracking-[0.2em]">
                                <WifiOff className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Offline Pocket Kit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-3 px-6">
                            {['NIPUN Guidelines v2', 'Math TLM Demo Video', 'Remedial Handbook'].map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => handlePocketKit(item)}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/5 hover:border-emerald-500/40 hover:bg-white dark:hover:bg-emerald-500/[0.05] cursor-pointer group active:scale-[0.98] transition-all shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 shadow-inner group-hover:scale-110 transition-transform">
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-slate-800 dark:text-slate-300 font-bold group-hover:text-emerald-500 transition-colors tracking-tight">{item}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 group-hover:-rotate-45 transition-all" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-white/90 dark:bg-[#0A0F1E]/60 border-slate-200 dark:border-white/5 backdrop-blur-xl shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] to-transparent pointer-events-none" />
                        <CardHeader className="pb-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white font-orbitron tracking-wide text-[10px] font-black uppercase tracking-[0.2em]">
                                <Users className="w-4 h-4 text-orange-500 dark:text-orange-400" /> Peer Circles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 px-6">
                            <div className="space-y-4">
                                {PEER_GROUPS.map((group) => (
                                    <div
                                        key={group.id}
                                        onClick={() => handlePeerCircle(group.name)}
                                        className="p-4 bg-slate-50/50 dark:bg-white/[0.03] rounded-2xl border border-slate-200/50 dark:border-white/5 hover:border-orange-500/40 flex items-center justify-between cursor-pointer hover:bg-orange-500/[0.05] dark:hover:bg-orange-500/[0.05] transition-all group/circle shadow-sm"
                                    >
                                        <div className="space-y-1">
                                            <div className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover/circle:text-orange-500 transition-colors uppercase tracking-tight">{group.name}</div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><Clock className="w-3 h-3" /> {group.nextSession}</div>
                                        </div>
                                        <Badge className="bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 group-hover/circle:scale-110 transition-transform h-8 w-8 rounded-full p-0 flex items-center justify-center font-black border-0 shadow-lg shadow-orange-500/10">
                                            {group.members}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Row: Observation */}
            <Card className="bg-white/90 dark:bg-[#0A0F1E]/60 border-slate-200/60 dark:border-white/5 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.02] to-transparent pointer-events-none" />
                <CardHeader className="border-b border-slate-100 dark:border-white/5 pb-4 bg-slate-50/50 dark:bg-white/[0.02]">
                    <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white font-orbitron tracking-wide text-[10px] font-black uppercase tracking-[0.25em]">
                        <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shadow-glow" /> Live Observation Metrics
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-10 pb-8 px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {OBSERVATION_DOMAINS.map((domain, i) => (
                            <div key={i} className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest">{domain.name}</p>
                                    <span className={`text-[10px] font-black ${domain.trend === 'up' ? 'text-emerald-500' : domain.trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
                                        {domain.trend === 'up' ? '↗' : domain.trend === 'down' ? '↘' : '→'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-slate-800 dark:text-white font-orbitron tracking-tight">{domain.score}%</span>
                                    <div className="flex-1 h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner border border-slate-200/50 dark:border-white/5 relative">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${domain.score}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.2 }}
                                            className={`h-full rounded-full relative overflow-hidden ${domain.score > 70 ? 'bg-emerald-500' : domain.score > 50 ? 'bg-indigo-500' : 'bg-red-500'}`}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-shimmer" />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Critical Success Layer: Dropout Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                <div className="lg:col-span-2">
                    <DropoutRadar />
                </div>
                <Card className="bg-gradient-to-br from-indigo-900/40 to-black/60 border-indigo-500/20 backdrop-blur-3xl rounded-[3rem] p-10 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50" />
                    <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center relative z-10">
                        <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse" />
                    </div>
                    <div className="space-y-3 relative z-10">
                        <h4 className="text-2xl font-black text-white font-orbitron uppercase tracking-tight">AI Intervention Engine</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                            Our predictive models have identified a correlation between low attendance and quiz engagement in Grade 7.
                        </p>
                    </div>
                    <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl relative z-10 shadow-xl shadow-indigo-600/20">
                        Launch Cluster-wide Remedial
                    </Button>
                </Card>
            </div>

            {/* Overlays */}
            <AnimatePresence>
                {selectedResource && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedResource(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] cursor-zoom-out"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-4 md:inset-20 bg-slate-900 border border-white/10 rounded-[3rem] z-[101] shadow-2xl flex flex-col p-1 md:p-12 overflow-hidden"
                        >
                            <div className="absolute top-8 right-8 z-[102]">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedResource(null)}
                                    className="h-12 w-12 rounded-full bg-white/5 text-white hover:bg-white/10"
                                >
                                    <XIcon className="w-6 h-6" />
                                </Button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-12 p-8 pt-16">
                                <div className="space-y-4">
                                    <Badge className="bg-emerald-500 text-white border-0 uppercase tracking-widest text-[10px] font-black h-8 px-4">Offline Module Active</Badge>
                                    <h2 className="text-5xl font-black text-white font-orbitron uppercase tracking-tighter">{selectedResource}</h2>
                                    <p className="text-slate-400 text-lg font-medium max-w-2xl">This professional development module is fully cached for offline use. You can access all videos and documents even without network connectivity.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="aspect-video bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center group cursor-pointer relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-xl border border-white/20 group-hover:scale-110 transition-transform">
                                            <Navigation className="w-8 h-8 rotate-90" />
                                        </div>
                                        <p className="absolute bottom-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Preview Training Video</p>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Key Learning Objectives</h3>
                                        <ul className="space-y-4">
                                            {['Implementation of NIPUN guidelines in grade 3', 'Interactive assessment strategies', 'Parent engagement protocols'].map((obj, i) => (
                                                <li key={i} className="flex items-center gap-4 text-slate-300">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    {obj}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl">
                                            Sync Progress Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}

                {activeCircle && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveCircle(null)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="fixed inset-0 z-[101] flex items-center justify-center p-6"
                        >
                            <div className="w-full max-w-4xl aspect-video bg-slate-900 border border-white/10 rounded-[4rem] relative overflow-hidden flex flex-col items-center justify-center text-center space-y-8 p-12">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-50" />
                                <div className="relative">
                                    <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 animate-pulse" />
                                    <div className="w-32 h-32 rounded-full border-4 border-orange-500/30 flex items-center justify-center relative z-10">
                                        <div className="w-24 h-24 rounded-full bg-orange-500/20 animate-ping absolute" />
                                        <Users className="w-12 h-12 text-orange-500" />
                                    </div>
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <Badge className="bg-orange-500 text-white border-0 text-[10px] font-black uppercase tracking-widest px-4 h-8">Secure Session Active</Badge>
                                    <h2 className="text-4xl font-black text-white font-orbitron uppercase tracking-tighter">{activeCircle}</h2>
                                    <p className="text-slate-400 font-medium max-w-md mx-auto">Connecting to peer mentors. 3 participants are already in the session.</p>
                                </div>
                                <div className="flex gap-4 relative z-10">
                                    <Button className="h-14 px-10 bg-white text-black hover:bg-slate-200 font-black uppercase tracking-widest text-[10px] rounded-2xl">Join with Video</Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setActiveCircle(null)}
                                        className="h-14 px-10 border-white/10 bg-white/5 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] rounded-2xl"
                                    >Leave Circle</Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
