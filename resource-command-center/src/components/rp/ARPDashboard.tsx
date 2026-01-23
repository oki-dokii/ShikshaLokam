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
    MessageSquare
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Top Stat Row for Academic focus */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Avg Student Score', val: '68%', color: 'text-blue-600 dark:text-brand-blue', icon: GraduationCap, bg: 'bg-blue-50 dark:bg-brand-blue/10' },
                    { label: 'Curriculum Covered', val: '74%', color: 'text-emerald-600 dark:text-emerald-400', icon: BookOpen, bg: 'bg-emerald-50 dark:bg-emerald-400/10' },
                    { label: 'Learning Gaps', val: '12', color: 'text-red-600 dark:text-red-400', icon: AlertTriangle, bg: 'bg-red-50 dark:bg-red-400/10' },
                    { label: 'Trainings Live', val: '3', color: 'text-orange-600 dark:text-orange-400', icon: Target, bg: 'bg-orange-50 dark:bg-orange-400/10' }
                ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white dark:bg-[#0F1629]/90 border border-slate-200 dark:border-white/10 backdrop-blur-md flex flex-col items-start gap-4 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] dark:hover:shadow-2xl transition-all group shadow-lg">
                        <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform shadow-sm`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <span className={`text-3xl font-black font-orbitron ${stat.color} drop-shadow-sm`}>{stat.val}</span>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1 font-black">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Heatmap Section */}
                <Card className="lg:col-span-2 bg-white dark:bg-[#0A0F1E]/90 border-slate-200 dark:border-pink-500/20 backdrop-blur-xl shadow-xl dark:shadow-2xl">
                    <CardHeader className="border-b border-slate-100 dark:border-white/5 pb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white font-orbitron tracking-wide text-xl">
                                    <div className="p-2 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400">
                                        <BrainCircuit className="w-5 h-5" />
                                    </div>
                                    Concept Mastery Heatmap
                                </CardTitle>
                                <CardDescription className="text-slate-500 dark:text-pink-200/50 mt-1 font-medium">
                                    Live performance analysis by sub-topic across {heatmap.reduce((acc, curr) => acc + curr.students, 0)} students
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-transparent">Math</Badge>
                                <Badge variant="outline" className="border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-transparent">Science</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {heatmap.map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    onClick={() => handleTopicClick(item.topic)}
                                    className={`p-5 rounded-xl border relative overflow-hidden flex items-center justify-between group cursor-pointer transition-all shadow-sm ${item.status === 'critical' ? 'bg-red-500/[0.03] dark:bg-red-500/10 border-red-500/20 hover:bg-red-500/[0.08] dark:hover:bg-red-500/20' :
                                        item.status === 'warning' ? 'bg-orange-500/[0.03] dark:bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/[0.08] dark:hover:bg-orange-500/20' :
                                            item.status === 'good' ? 'bg-blue-500/[0.03] dark:bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/[0.08] dark:hover:bg-blue-500/20' :
                                                'bg-emerald-500/[0.03] dark:bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/[0.08] dark:hover:bg-emerald-500/20'
                                        }`}
                                >
                                    <div className="space-y-1 relative z-10">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-800 dark:text-white text-base group-hover:underline decoration-white/20">{item.topic}</h4>
                                            <span className="text-[10px] text-slate-500 dark:text-slate-300 bg-slate-200/50 dark:bg-white/10 px-1.5 rounded font-mono font-bold tracking-tighter">{item.code}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-300 font-medium">{item.students} Students Tracked</p>
                                    </div>

                                    <div className="flex items-center gap-3 relative z-10">
                                        {item.status === 'critical' && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleWhatsAppGap(item.topic, item.mastery);
                                                }}
                                                className="h-8 w-8 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/10"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <div className="text-right">
                                            <div className={`text-2xl font-black font-orbitron ${item.status === 'critical' ? 'text-red-600 dark:text-red-400' :
                                                item.status === 'warning' ? 'text-orange-600 dark:text-orange-400' :
                                                    item.status === 'good' ? 'text-blue-600 dark:text-blue-400' :
                                                        'text-emerald-600 dark:text-emerald-400'
                                                }`}>{Math.round(item.mastery)}%</div>
                                            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-black">Mastery</div>
                                        </div>
                                    </div>

                                    {/* Abstract Glow */}
                                    <div className={`absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l to-transparent opacity-10 group-hover:opacity-30 transition-opacity ${item.status === 'critical' ? 'from-red-500' :
                                        item.status === 'warning' ? 'from-orange-500' :
                                            item.status === 'good' ? 'from-blue-500' :
                                                'from-emerald-500'
                                        }`} />
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Training Impact & Quick Actions */}
                <div className="space-y-6">
                    <Card className="bg-white dark:bg-[#1e293b]/90 border-slate-200 dark:border-brand-cyan/20 backdrop-blur-xl h-fit shadow-lg">
                        <CardHeader className="pb-4 border-b border-slate-100 dark:border-white/5">
                            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white font-orbitron tracking-wide text-xs uppercase">
                                <TrendingUp className="w-4 h-4 text-brand-cyan" /> Training Impact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {TRAINING_SESSIONS.map((session) => (
                                <div key={session.id} className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-white/10 hover:border-brand-cyan/30 transition-all group shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h5 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-brand-cyan transition-colors">{session.name}</h5>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Badge variant="outline" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-xs h-6 px-2 text-slate-600 dark:text-slate-300">{session.date}</Badge>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Attd: <span className="text-slate-900 dark:text-white font-black">{session.attendance}</span></span>
                                            <Badge className={`h-6 px-2 text-xs font-black ${session.impact.includes('+') ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-0' : 'bg-slate-100 text-slate-500 dark:bg-slate-500/20 dark:text-slate-400 border-0'}`}>
                                                {session.impact}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs text-brand-cyan hover:text-white hover:bg-brand-cyan/20 border border-brand-cyan/10 rounded-xl">View All Analytics</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 via-white to-white dark:from-brand-purple/20 dark:to-brand-blue/10 border-slate-200 dark:border-brand-purple/30 backdrop-blur-xl shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-slate-800 dark:text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-brand-purple" /> Quick AI Tools
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleUploadPlan}
                                className="h-24 flex flex-col items-center justify-center gap-3 bg-white dark:bg-[#0F1629]/80 hover:bg-brand-purple/10 dark:hover:bg-brand-purple/20 border border-slate-200 dark:border-white/10 hover:border-brand-purple/40 transition-all group rounded-2xl shadow-sm hover:shadow-md"
                            >
                                <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:text-brand-purple transition-all group-hover:scale-110">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter">Upload Plan</span>
                            </button>
                            <button
                                onClick={handleCreateQuiz}
                                className="h-24 flex flex-col items-center justify-center gap-3 bg-white dark:bg-[#0F1629]/80 hover:bg-brand-blue/10 dark:hover:bg-brand-blue/20 border border-slate-200 dark:border-white/10 hover:border-brand-blue/40 transition-all group rounded-2xl shadow-sm hover:shadow-md"
                            >
                                <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:text-brand-blue transition-all group-hover:scale-110">
                                    <CheckSquare className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter">Create Quiz</span>
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
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
