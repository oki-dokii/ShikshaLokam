import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    Map
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { ClusterMetrics } from '@/types/courseTypes';

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
        const loadingToast = toast.loading(`Mapping optimized route to ${nextVisit.school}...`);

        setTimeout(() => {
            toast.dismiss(loadingToast);
            toast.success(`Navigation Active`, {
                description: `ETA to ${nextVisit.school}: 8 mins via Main Aurad Road (No Traffic).`,
                icon: <Navigation className="w-4 h-4 text-indigo-500" />
            });

            setTimeout(() => {
                setIsNavigating(false);
                toast.info(`Arrived at ${nextVisit.school}`, {
                    description: "Digital Classroom Observation template has been auto-loaded.",
                });
            }, 3000);
        }, 1500);
    };

    const handlePocketKit = (item: string) => {
        const loading = toast.loading(`Decrypting offline module: ${item}...`);
        setTimeout(() => {
            toast.dismiss(loading);
            toast.success(`${item} Ready`, {
                description: "This module is available offline for use in low-network zones.",
                icon: <WifiOff className="w-4 h-4 text-emerald-500" />
            });
        }, 1200);
    };

    const handlePeerCircle = (name: string) => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: `Authenticating session for ${name}...`,
                success: 'Joined Peer Circle. 3 members are currently active in discussion.',
                error: 'Connection failed.',
            }
        );
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
                <Card className="lg:col-span-2 bg-white/80 dark:bg-[#0A0F1E]/60 border-slate-200 dark:border-indigo-500/20 backdrop-blur-xl shadow-xl dark:shadow-2xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
                    <CardHeader className="relative z-10 border-b border-slate-100 dark:border-indigo-500/10 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white font-orbitron tracking-wide text-xl">
                                    <div className="p-2 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                                        <Route className="w-5 h-5" />
                                    </div>
                                    Smart Visit Planner
                                </CardTitle>
                                <CardDescription className="text-slate-500 dark:text-indigo-200/50 font-medium">
                                    AI-optimized route based on urgency & proximity
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="border-indigo-500/20 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5">
                                <Map className="w-3 h-3 mr-1" /> Map View
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-6 relative z-10">
                        {visits.map((visit, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={visit.id}
                                onClick={() => toggleVisitStatus(visit.id)}
                                className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-[#0F1629] border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 hover:bg-white dark:hover:bg-[#151B33] transition-all group/item cursor-pointer shadow-sm hover:shadow-md"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner ${visit.status === 'urgent' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                        visit.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                            'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                        }`}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-slate-800 dark:text-white group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-300 transition-colors">{visit.school}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <Badge variant="secondary" className="bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[10px] h-5 rounded-md border-0">{visit.distance}</Badge>
                                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {visit.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                    <Badge className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold ${visit.status === 'urgent' ? 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
                                        visit.status === 'completed' ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                                            'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                        }`}>
                                        {visit.reason}
                                    </Badge>
                                    {visit.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                </div>
                            </motion.div>
                        ))}
                        <Button
                            onClick={handleStartNavigation}
                            disabled={isNavigating}
                            className={`w-full mt-4 h-12 ${isNavigating ? 'bg-slate-700 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-500'} text-white font-bold tracking-wider uppercase text-xs shadow-lg shadow-indigo-600/20 transition-all rounded-xl`}
                        >
                            <Navigation className={`w-4 h-4 mr-2 ${isNavigating ? 'animate-spin' : ''}`} />
                            {isNavigating ? 'Recalculating Optimized Path...' : 'Start Smart Navigation'}
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-white/80 dark:bg-[#0A0F1E]/60 border-slate-200 dark:border-emerald-500/20 backdrop-blur-xl shadow-lg">
                        <CardHeader className="pb-3 border-b border-slate-100 dark:border-white/5">
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white font-orbitron tracking-wide text-sm uppercase">
                                <WifiOff className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Offline Pocket Kit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                            {['NIPUN Guidelines v2', 'Math TLM Demo Video', 'Remedial Handbook'].map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => handlePocketKit(item)}
                                    className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-500/10 hover:border-emerald-500/30 cursor-pointer group active:scale-95 transition-all shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                                            <BookOpen className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-sm text-slate-700 dark:text-slate-300 font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item}</span>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:text-emerald-600 group-hover:-rotate-45 transition-all" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 dark:from-orange-500/10 to-transparent border-slate-200 dark:border-orange-500/20 backdrop-blur-xl shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white font-orbitron tracking-wide text-sm uppercase">
                                <Users className="w-4 h-4 text-orange-500 dark:text-orange-400" /> Peer Circles
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {PEER_GROUPS.map((group) => (
                                    <div
                                        key={group.id}
                                        onClick={() => handlePeerCircle(group.name)}
                                        className="p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-orange-500/10 flex items-center justify-between cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors shadow-sm"
                                    >
                                        <div>
                                            <div className="text-xs font-bold text-orange-900 dark:text-orange-200">{group.name}</div>
                                            <div className="text-[10px] text-orange-600/60 dark:text-orange-400/60 mt-0.5">{group.nextSession}</div>
                                        </div>
                                        <Badge className="bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 border-0 text-[10px] shadow-none">{group.members}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Row: Observation */}
            <Card className="bg-white/80 dark:bg-[#0A0F1E]/80 border-slate-200/60 dark:border-white/5 backdrop-blur-xl shadow-xl">
                <CardHeader className="border-b border-slate-100 dark:border-white/5 pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white font-orbitron tracking-wide text-lg uppercase">
                        <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> Live Observation Analytics
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {OBSERVATION_DOMAINS.map((domain, i) => (
                            <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors relative overflow-hidden group shadow-sm">
                                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                                    <div className={`text-5xl font-black ${domain.trend === 'up' ? 'text-green-500' : domain.trend === 'down' ? 'text-red-500' : 'text-yellow-500'}`}>
                                        {domain.trend === 'up' ? '↗' : domain.trend === 'down' ? '↘' : '→'}
                                    </div>
                                </div>
                                <p className="text-[10px] text-indigo-600 dark:text-indigo-300 uppercase font-black tracking-widest mb-2">{domain.name}</p>
                                <div className="flex items-end gap-2 relative z-10">
                                    <span className="text-3xl font-bold text-slate-800 dark:text-white">{domain.score}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-200 dark:bg-black/50 mt-3 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${domain.score}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
