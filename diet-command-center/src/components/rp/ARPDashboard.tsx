import { useState, useEffect } from 'react';
import {
    BookOpen,
    GraduationCap,
    BrainCircuit,
    TrendingUp,
    FileText,
    CheckSquare,
    Sparkles,
    Target,
    AlertTriangle,
    MessageSquare,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ClusterMetrics } from '@/types/courseTypes';

const INITIAL_TOPIC_HEATMAP = [
    { topic: 'Fractions', code: 'M-7-04', mastery: 45, status: 'critical', students: 120 },
    { topic: 'Geometry', code: 'M-7-08', mastery: 72, status: 'good', students: 340 },
    { topic: 'Algebra', code: 'M-8-02', mastery: 58, status: 'warning', students: 210 },
    { topic: 'Data Handling', code: 'M-6-11', mastery: 88, status: 'excellent', students: 450 },
    { topic: 'Measurement', code: 'M-5-05', mastery: 30, status: 'critical', students: 90 },
    { topic: 'Number System', code: 'M-9-01', mastery: 65, status: 'warning', students: 180 },
];

const TRAINING_SESSIONS = [
    { id: 1, name: 'Effective Math Pedagogy', date: 'Oct 12', attendance: '92%', impact: '+15% Scores' },
    { id: 2, name: 'Science Lab Safety', date: 'Oct 05', attendance: '85%', impact: 'Pending' },
];

export function ARPDashboard({ cluster }: { cluster: ClusterMetrics }) {
    const navigate = useNavigate();
    const [heatmap, setHeatmap] = useState(INITIAL_TOPIC_HEATMAP);

    // Update heatmap based on cluster health to simulate dynamic data
    useEffect(() => {
        setHeatmap(prev => prev.map(item => {
            const newMastery = Math.min(100, Math.max(10, item.mastery + (cluster.overallHealth - 70) / 2 + (Math.random() * 10 - 5)));
            return {
                ...item,
                mastery: newMastery,
                status: newMastery < 50 ? 'critical' : newMastery < 65 ? 'warning' : newMastery < 85 ? 'good' : 'excellent'
            };
        }));
    }, [cluster]);

    const handleTopicClick = (topic: string) => {
        toast.info(`Generating deep analysis for ${topic}... Opening Teacher Copilot.`);
        navigate('/engagement-analysis');
    };

    const handleWhatsAppGap = (topic: string, mastery: number) => {
        toast.success(`Cluster-wide WhatsApp alert sent for ${topic}`, {
            description: `All Math teachers in ${cluster.name} notified. Action: Remedial focus on this gap (${Math.round(mastery)}% mastery).`
        });
    };

    const handleCreateQuiz = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: "AI generating remedial assessment for the cluster's biggest learning gap...",
                success: () => {
                    navigate('/simulation-arena'); // Move to a simulation or quiz area
                    return "Diagnostic Assessment generated! Redirecting to Simulation Arena.";
                },
                error: "System busy: Training model update in progress.",
            }
        );
    };

    const handleUploadPlan = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2500)),
            {
                loading: 'AI analyzing lesson plan for pedagogical alignment with Cluster Goals...',
                success: 'Lesson plan analyzed! 92% alignment with NIPUN standards. Added to Resource Repository.',
                error: 'File format not supported.',
            }
        );
    };

    return (
        <motion.div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* Top Stat Row for Academic focus */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Avg Student Score', val: '68%', color: 'text-blue-600 dark:text-blue-400', icon: GraduationCap, bg: 'bg-blue-500/10 dark:bg-blue-500/20', glow: 'shadow-blue-500/20' },
                    { label: 'Curriculum Covered', val: '74%', color: 'text-emerald-600 dark:text-emerald-400', icon: BookOpen, bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', glow: 'shadow-emerald-500/20' },
                    { label: 'Learning Gaps', val: '12', color: 'text-red-600 dark:text-red-400', icon: AlertTriangle, bg: 'bg-red-500/10 dark:bg-red-500/20', glow: 'shadow-red-500/20' },
                    { label: 'Trainings Live', val: '3', color: 'text-orange-600 dark:text-orange-400', icon: Target, bg: 'bg-orange-500/10 dark:bg-orange-500/20', glow: 'shadow-orange-500/20' }
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-white/90 dark:bg-[#0A0F1E]/60 border border-slate-200 dark:border-white/5 backdrop-blur-2xl p-6 rounded-[2rem] flex flex-col items-start gap-5 hover:shadow-2xl transition-all group overflow-hidden relative shadow-xl dark:shadow-none"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/5 dark:to-white/[0.02] -rotate-45 transform translate-x-12 -translate-y-12 pointer-events-none transition-transform group-hover:translate-x-10 group-hover:-translate-y-10" />
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-all duration-500 shadow-xl border border-white/10 relative z-10`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="relative z-10 space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${stat.color} animate-pulse`} />
                                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-black">{stat.label}</p>
                            </div>
                            <span className={`text-5xl font-black font-orbitron ${stat.color} tracking-tight`}>{stat.val}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Heatmap Section */}
                <Card className="lg:col-span-2 bg-white/90 dark:bg-[#0A0F1E]/60 border-slate-200 dark:border-white/5 backdrop-blur-2xl shadow-xl dark:shadow-none relative overflow-hidden group/card rounded-[2.5rem]">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-20" />
                    <CardHeader className="border-b border-slate-100 dark:border-white/5 pb-8 relative z-10 px-10 pt-10 bg-slate-50/50 dark:bg-white/[0.02]">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <CardTitle className="flex items-center gap-4 text-slate-800 dark:text-white font-orbitron tracking-wide text-2xl">
                                    <div className="p-3 rounded-2xl bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 shadow-glow transition-transform group-hover/card:scale-110 duration-500">
                                        <BrainCircuit className="w-8 h-8" />
                                    </div>
                                    Topic Mastery Heatmap
                                </CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-xl leading-relaxed">
                                    Granular academic monitoring for {heatmap.reduce((acc, curr) => acc + curr.students, 0)} students across {cluster.name}. Red zones mandate remedial pedagogical intervention.
                                </CardDescription>
                            </div>
                            <div className="hidden sm:flex gap-3">
                                <Badge variant="outline" className="border-slate-200/50 dark:border-white/10 text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-white/5 px-4 py-1.5 uppercase text-[10px] font-black tracking-widest">Mathematics</Badge>
                                <Badge variant="outline" className="border-slate-200/50 dark:border-white/10 text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-white/5 px-4 py-1.5 uppercase text-[10px] font-black tracking-widest">Science</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {heatmap.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                    onClick={() => handleTopicClick(item.topic)}
                                    className={`p-6 rounded-3xl border relative overflow-hidden flex items-center justify-between group cursor-pointer transition-all shadow-sm ${item.status === 'critical' ? 'bg-red-500/[0.03] dark:bg-red-500/[0.05] border-red-500/20 hover:border-red-500/40' :
                                        item.status === 'warning' ? 'bg-orange-500/[0.03] dark:bg-orange-500/[0.05] border-orange-500/20 hover:border-orange-500/40' :
                                            item.status === 'good' ? 'bg-blue-500/[0.03] dark:bg-blue-500/[0.05] border-blue-500/20 hover:border-blue-500/40' :
                                                'bg-emerald-500/[0.03] dark:bg-emerald-500/[0.05] border-emerald-500/20 hover:border-emerald-500/40'
                                        }`}
                                >
                                    <div className="absolute left-0 top-0 w-1.5 h-full opacity-30 bg-current transition-all group-hover:opacity-100" />
                                    <div className="space-y-3 relative z-10 pr-4">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-black text-slate-800 dark:text-white text-xl tracking-tight leading-none group-hover:text-blue-500 transition-colors uppercase">{item.topic}</h4>
                                            <span className="text-[9px] text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-white/10 px-2 py-1 rounded-lg font-orbitron font-black tracking-widest border border-slate-200/50 dark:border-white/10">{item.code}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                {[...Array(3)].map((_, j) => (
                                                    <div key={j} className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800" />
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">{item.students} Students</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 relative z-10 shrink-0">
                                        {item.status === 'critical' && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleWhatsAppGap(item.topic, item.mastery);
                                                }}
                                                className="h-11 w-11 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/10 rounded-2xl border border-emerald-500/10 shadow-sm"
                                            >
                                                <MessageSquare className="w-5 h-5" />
                                            </Button>
                                        )}
                                        <div className="text-right">
                                            <div className={`text-4xl font-black font-orbitron leading-none tracking-tighter ${item.status === 'critical' ? 'text-red-500 shadow-red-500/20' :
                                                item.status === 'warning' ? 'text-orange-500 shadow-orange-500/20' :
                                                    item.status === 'good' ? 'text-blue-500 shadow-blue-500/20' :
                                                        'text-emerald-500 shadow-emerald-500/20'
                                                }`}>{Math.round(item.mastery)}%</div>
                                            <div className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-black mt-2">Mastery</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Training Impact & Quick Actions */}
                <div className="space-y-8">
                    <Card className="bg-white/90 dark:bg-[#0A0F1E]/60 border-slate-200 dark:border-white/5 backdrop-blur-xl h-fit shadow-xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="pb-6 border-b border-slate-100 dark:border-white/5 px-8 pt-8 bg-slate-50/50 dark:bg-white/[0.02]">
                            <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white font-orbitron tracking-widest text-[10px] font-black uppercase tracking-[0.25em]">
                                <TrendingUp className="w-5 h-5 text-indigo-500 shadow-glow" /> Training Impact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-5">
                            {TRAINING_SESSIONS.map((session) => (
                                <div key={session.id} className="p-5 bg-white/50 dark:bg-white/[0.03] rounded-[1.5rem] border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all group shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/[0.02] -rotate-45 transform translate-x-12 -translate-y-12" />
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <h5 className="text-base font-black text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors uppercase tracking-tight">{session.name}</h5>
                                    </div>
                                    <div className="flex justify-between items-center relative z-10">
                                        <Badge variant="outline" className="bg-white dark:bg-black/20 border-slate-200/50 dark:border-white/5 text-[9px] h-6 px-3 text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest leading-none flex items-center">{session.date}</Badge>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Attd: <span className="text-slate-900 dark:text-white font-orbitron ml-1">{session.attendance}</span></span>
                                            <Badge className={`h-7 px-3 text-[10px] font-black uppercase border-0 tracking-widest ${session.impact.includes('+') ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shadow-lg shadow-emerald-500/10' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>
                                                {session.impact}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full h-14 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/10 border border-slate-200/50 dark:border-white/10 rounded-[1.25rem] transition-all bg-white/30 dark:bg-white/[0.02] mt-2">Deep Cluster Metrics</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0A0F1E] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group rounded-[2.5rem]">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.05] via-transparent to-blue-500/[0.05] pointer-events-none" />
                        <CardHeader className="pb-6 relative z-10 border-b border-white/5 px-8 pt-8 bg-white/[0.01]">
                            <CardTitle className="text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse shadow-glow" /> AI Support Cockpit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-5 p-8 relative z-10">
                            <button
                                onClick={handleUploadPlan}
                                className="h-32 flex flex-col items-center justify-center gap-4 bg-white/[0.02] hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/40 transition-all group rounded-[2rem] shadow-xl relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="p-4 rounded-2xl bg-white/5 text-slate-500 group-hover:text-purple-400 group-hover:bg-purple-400/10 transition-all group-hover:scale-110 shadow-inner border border-white/5 relative z-10">
                                    <FileText className="w-7 h-7" />
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] relative z-10">Upload Plan</span>
                            </button>
                            <button
                                onClick={handleCreateQuiz}
                                className="h-32 flex flex-col items-center justify-center gap-4 bg-white/[0.02] hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/40 transition-all group rounded-[2rem] shadow-xl relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="p-4 rounded-2xl bg-white/5 text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all group-hover:scale-110 shadow-inner border border-white/5 relative z-10">
                                    <CheckSquare className="w-7 h-7" />
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] relative z-10">Create Quiz</span>
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}

function AlertIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
    )
}
