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

// Mock Data for CRP
const VISIT_PLAN = [
    { id: 1, school: 'Govt High School, Sector A', status: 'urgent', reason: 'Critical Attendance Drop', distance: '1.2 km', time: '09:00 AM' },
    { id: 2, school: 'Primary School, Block B', status: 'pending', reason: 'Routine Academic Review', distance: '3.5 km', time: '11:00 AM' },
    { id: 3, school: 'Girls High School, Sector C', status: 'completed', reason: 'MDM Quality Check', distance: '0.8 km', time: '02:00 PM' },
];

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

export function CRPDashboard() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Row: Visit Planner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-[#0A0F1E]/60 border-indigo-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
                    <CardHeader className="relative z-10 border-b border-indigo-500/10 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-3 text-white font-orbitron tracking-wide text-xl">
                                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                        <Route className="w-5 h-5" />
                                    </div>
                                    Smart Visit Planner
                                </CardTitle>
                                <CardDescription className="text-indigo-200/50 font-medium">
                                    AI-optimized route based on urgency & proximity
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/5">
                                <Map className="w-3 h-3 mr-1" /> Map View
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-6 relative z-10">
                        {VISIT_PLAN.map((visit, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={visit.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-[#0F1629] border border-white/5 hover:border-indigo-500/30 hover:bg-[#151B33] transition-all group/item cursor-pointer"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner ${visit.status === 'urgent' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                            visit.status === 'completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                        }`}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white group-hover/item:text-indigo-300 transition-colors">{visit.school}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <Badge variant="secondary" className="bg-white/5 text-slate-400 text-[10px] h-5 rounded-md border-0">{visit.distance}</Badge>
                                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {visit.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold ${visit.status === 'urgent' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                                            visit.status === 'completed' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                                                'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                        }`}>
                                        {visit.reason}
                                    </Badge>
                                </div>
                            </motion.div>
                        ))}
                        <Button className="w-full mt-4 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wider uppercase text-xs shadow-lg shadow-indigo-600/20">
                            <Navigation className="w-4 h-4 mr-2" /> Start Navigation
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-[#0A0F1E]/60 border-emerald-500/20 backdrop-blur-xl">
                        <CardHeader className="pb-3 border-b border-white/5">
                            <CardTitle className="flex items-center gap-2 text-white font-orbitron tracking-wide text-sm">
                                <WifiOff className="w-4 h-4 text-emerald-400" /> Offline Pocket Kit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-2">
                            {['NIPUN Guidelines v2', 'Math TLM Demo Video', 'Remedial Handbook'].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/10 hover:border-emerald-500/30 cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-500">
                                            <BookOpen className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-sm text-slate-300 font-medium group-hover:text-emerald-400 transition-colors">{item}</span>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-emerald-500/50 group-hover:text-emerald-500 group-hover:-rotate-45 transition-all" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-white font-orbitron tracking-wide text-sm">
                                <Users className="w-4 h-4 text-orange-400" /> Peer Circles
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {PEER_GROUPS.map((group) => (
                                    <div key={group.id} className="p-3 bg-black/20 rounded-lg border border-orange-500/10 flex items-center justify-between">
                                        <div>
                                            <div className="text-xs font-bold text-orange-200">{group.name}</div>
                                            <div className="text-[10px] text-orange-400/60 mt-0.5">{group.nextSession}</div>
                                        </div>
                                        <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border-0 text-[10px]">{group.members}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Row: Observation */}
            <Card className="bg-[#0A0F1E]/80 border-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white font-orbitron tracking-wide text-lg">
                        <CheckCircle2 className="w-5 h-5 text-indigo-400" /> Live Observation Analytics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {OBSERVATION_DOMAINS.map((domain, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-20">
                                    <div className={`text-4xl font-black ${domain.trend === 'up' ? 'text-green-500' : domain.trend === 'down' ? 'text-red-500' : 'text-yellow-500'}`}>
                                        {domain.trend === 'up' ? '↗' : domain.trend === 'down' ? '↘' : '→'}
                                    </div>
                                </div>
                                <p className="text-[10px] text-indigo-300 uppercase font-black tracking-widest mb-2">{domain.name}</p>
                                <div className="flex items-end gap-2 relative z-10">
                                    <span className="text-3xl font-bold text-white">{domain.score}%</span>
                                </div>
                                <div className="w-full h-1 bg-black/50 mt-3 rounded-full overflow-hidden">
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
