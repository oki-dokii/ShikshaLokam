import { useState, useEffect } from 'react';
import {
    Building2,
    Users,
    AlertTriangle,
    FileCheck,
    Briefcase,
    TrendingDown,
    MoreHorizontal,
    Activity,
    ShieldCheck,
    MessageSquare,
    X,
    Clock,
    User,
    ChevronRight,
    Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ClusterMetrics } from '@/types/courseTypes';

const INITIAL_COMPLIANCE_ITEMS = [
    { task: 'UDISE Data Verification', progress: 85, due: '2 Days' },
    { task: 'Mid-Day Meal Audit', progress: 40, due: '5 Days' },
    { task: 'Annual Grant Utilization', progress: 92, due: 'Today' },
];

const INITIAL_ESCALATIONS = [
    { id: 1, type: 'Infrastructure', title: 'Roof Leakage - Block A', severity: 'high', from: 'CRP Rajesh' },
    { id: 2, type: 'Staffing', title: 'Math Teacher Maternity Leave', severity: 'medium', from: 'Principal GHS' },
];

export function BRPDashboard({ cluster }: { cluster: ClusterMetrics }) {
    const [staffing, setStaffing] = useState(cluster.schools.map(s => ({
        school: s.name,
        teachers: s.teacherCount,
        required: s.teacherCount + (s.averageEngagement < 60 ? 2 : s.averageEngagement < 80 ? 1 : 0),
        status: s.averageEngagement < 80 ? 'deficit' : 'balanced',
        value: s.averageEngagement < 80 ? -(Math.floor(Math.random() * 2) + 1) : 0
    })));
    const [compliance, setCompliance] = useState(INITIAL_COMPLIANCE_ITEMS);
    const [escalations, setEscalations] = useState(INITIAL_ESCALATIONS);
    const [selectedEscalation, setSelectedEscalation] = useState<any>(null);

    // Update data when cluster changes
    useEffect(() => {
        setStaffing(cluster.schools.map(s => ({
            school: s.name,
            teachers: s.teacherCount,
            required: s.teacherCount + (s.averageEngagement < 60 ? 2 : s.averageEngagement < 80 ? 1 : 0),
            status: s.averageEngagement < 80 ? 'deficit' : 'balanced',
            value: s.averageEngagement < 80 ? -(Math.floor(Math.random() * 2) + 1) : 0
        })));
    }, [cluster]);

    const handleAutoBalance = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: 'AI Engine analyzing teacher-student ratios and subject requirements...',
                success: () => {
                    setStaffing(prev => prev.map(s => ({ ...s, status: 'balanced', value: 0, teachers: s.required })));
                    return 'Optimization Successful: 3 teachers reassigned virtually to schools with critical Math/Science vacancies. Draft deployment order sent to BEO.';
                },
                error: 'Failed to balance staffing.',
            }
        );
    };

    const handleResolveEscalation = (id: number) => {
        setEscalations(prev => prev.filter(e => e.id !== id));
        toast.success("Issue marked as resolved and notification sent to Block Office.");
    };

    const handleWhatsAppSchool = (school: string, deficit: number) => {
        toast.success(`WhatsApp alert sent to Principal of ${school}`, {
            description: `Action Required: Temporary reassignment to fix teacher deficit (${Math.abs(deficit)}).`
        });
    };

    const handleStaffAction = (school: string) => {
        toast.info(`Opening deployment details for ${school}...`, {
            description: "Suggested Action: Move 1 Math teacher from Surplus to Deficit.",
            action: {
                label: "Request Transfer",
                onClick: () => toast.success(`Transfer request for ${school} submitted for BEO approval.`)
            }
        });
    };

    const handleEscalationDetails = (issue: any) => {
        setSelectedEscalation({
            ...issue,
            timestamp: 'Today, 10:45 AM',
            description: issue.type === 'Infrastructure'
                ? 'Severe roof leakage reported in Block A primary wing. Water damage to mid-day meal storage area and academic records. Immediate structural assessment required.'
                : 'Subject teacher for Mathematics is proceeding on maternity leave from next week. No local substitute available. Affecting 120 students across Grade 8-10.',
            priority: issue.severity === 'high' ? 'Critical' : 'High',
            assignedTo: 'Block Resource Coordinator (BRC)',
            timeline: [
                { time: '10:45 AM', event: 'Issue reported via Mobile App' },
                { time: '11:15 AM', event: 'Initial triage by BRP' },
                { time: '11:45 AM', event: 'Escalated to District Office' }
            ]
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Staffing & PTR Balancer */}
            <Card className="bg-white/90 dark:bg-[#0A0F1E]/60 border-slate-200 dark:border-white/5 backdrop-blur-2xl shadow-xl dark:shadow-none overflow-hidden group relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-white/5 pb-6 bg-slate-50/30 dark:bg-white/[0.02]">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2.5 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-inner">
                                <Users className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-slate-800 dark:text-white font-orbitron tracking-wide text-xl">Staffing & PTR Balancer</CardTitle>
                        </div>
                        <CardDescription className="text-slate-500 dark:text-slate-400">
                            Real-time analysis of teacher deployment vs requirement across 42 schools.
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleAutoBalance}
                        className="border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 font-black uppercase tracking-[0.15em] text-[10px] rounded-xl h-10 px-5 transition-all"
                    >
                        <Activity className="w-4 h-4 mr-2 animate-pulse" /> Auto-Balance
                    </Button>
                </CardHeader>
                <CardContent className="pt-8">
                    <div className="space-y-4">
                        {staffing.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 dark:bg-white/[0.03] rounded-2xl border border-slate-200/60 dark:border-white/5 hover:border-blue-500/30 hover:bg-white dark:hover:bg-blue-600/[0.05] transition-all group shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-0.5 h-full bg-transparent group-hover:bg-blue-500 transition-all" />
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-3 shadow-sm font-orbitron text-lg">
                                        {item.school.substring(0, 2)}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors text-lg tracking-tight">{item.school}</h4>
                                        <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                            <span>Current: <span className="text-slate-900 dark:text-white font-orbitron text-xs">{item.teachers}</span></span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                            <span>Required: <span className="text-slate-900 dark:text-white font-orbitron text-xs">{item.required}</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.status === 'deficit' && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleWhatsAppSchool(item.school, item.value);
                                            }}
                                            className="h-10 w-10 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/10 rounded-xl"
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                        </Button>
                                    )}
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStaffAction(item.school);
                                        }}
                                        className="h-10 w-10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 rounded-xl"
                                        title="View Deployment Details"
                                    >
                                        <Activity className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Compliance Dashboard */}
                <Card className="bg-white/90 dark:bg-[#0A0F1E]/60 border-slate-200 dark:border-white/5 backdrop-blur-2xl h-full shadow-xl">
                    <CardHeader className="border-b border-slate-100 dark:border-white/5 pb-4 bg-slate-50/50 dark:bg-white/[0.02]">
                        <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white font-orbitron tracking-wide text-[10px] font-black uppercase tracking-[0.2em]">
                            <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm">
                                <FileCheck className="w-5 h-5" />
                            </div>
                            Compliance Tracker
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-8 px-8">
                        {compliance.map((item, i) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-between text-sm items-end">
                                    <span className="text-slate-800 dark:text-white font-black tracking-tight">{item.task}</span>
                                    <Badge variant="outline" className={`text-[10px] border-none font-black uppercase tracking-widest px-2 ${item.due === 'Today' ? 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                                        }`}>Due: {item.due}</Badge>
                                </div>
                                <div className="relative pt-2">
                                    <Progress value={item.progress} className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden" />
                                    <span className="absolute right-0 bottom-[100%] mb-1 text-[10px] font-black font-orbitron text-emerald-600 dark:text-emerald-400">{item.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Escalation Matrix */}
                <Card className="bg-gradient-to-br from-red-50 via-white to-white dark:from-red-950/20 dark:to-[#0A0F1E]/60 border-slate-200 dark:border-white/5 backdrop-blur-2xl shadow-xl">
                    <CardHeader className="border-b border-slate-100 dark:border-white/5 pb-4 bg-red-500/[0.02] dark:bg-red-500/[0.02]">
                        <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white font-orbitron tracking-wide text-[10px] font-black uppercase tracking-[0.2em]">
                            <div className="p-2 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 animate-pulse shadow-sm">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            Escalation Matrix
                        </CardTitle>
                        <CardDescription className="text-red-600/60 dark:text-red-400/50 font-black uppercase text-[10px] tracking-widest mt-1">Actions Required: {escalations.length}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-8 px-8">
                        {escalations.map((issue) => (
                            <div key={issue.id} className="p-5 bg-red-500/[0.02] dark:bg-white/[0.03] border border-red-500/10 dark:border-white/5 rounded-2xl hover:bg-red-500/[0.05] dark:hover:bg-red-500/[0.1] transition-all group relative overflow-hidden shadow-sm">
                                <div className="absolute left-0 top-0 w-1.5 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                <div className="flex justify-between items-start pl-4">
                                    <div className="space-y-2">
                                        <Badge variant="outline" className="text-[9px] py-0 border-red-500/20 text-red-600 dark:text-red-400 bg-red-500/10 font-black uppercase tracking-[0.2em]">{issue.type}</Badge>
                                        <h5 className="font-black text-slate-800 dark:text-white text-base group-hover:text-red-600 transition-colors tracking-tight">{issue.title}</h5>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                            <User className="w-3.5 h-3.5" /> {issue.from}
                                        </p>
                                    </div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse" />
                                </div>
                                <div className="flex gap-2 mt-6 pl-4 font-black">
                                    <Button
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleResolveEscalation(issue.id);
                                        }}
                                        className="h-9 px-6 text-[10px] bg-red-600 hover:bg-red-500 text-white border-0 shadow-xl shadow-red-600/20 rounded-xl uppercase tracking-widest"
                                    >
                                        Resolve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-9 px-6 text-[10px] border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl uppercase tracking-widest"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEscalationDetails(issue);
                                        }}
                                    >
                                        Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

            </div>

            {/* Side Drawer for Details */}
            <AnimatePresence>
                {selectedEscalation && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEscalation(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#0A0F1E] border-l border-slate-200 dark:border-white/10 z-[101] shadow-2xl flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
                                <div className="space-y-1">
                                    <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-none uppercase text-[10px] tracking-widest">{selectedEscalation.type}</Badge>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white font-orbitron uppercase leading-tight">{selectedEscalation.title}</h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedEscalation(null)}
                                    className="h-10 w-10 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-white/5"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Drawer Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* Status Overview */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">Priority</p>
                                        <p className="text-sm font-bold text-red-600 dark:text-red-400">{selectedEscalation.priority}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">Status</p>
                                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500 italic">In Progress</p>
                                    </div>
                                </div>

                                {/* AI Summary */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Activity className="w-3 h-3 text-blue-500" /> AI Incident Summary
                                    </h4>
                                    <div className="p-5 rounded-2xl bg-blue-500/[0.02] dark:bg-blue-500/[0.05] border border-blue-500/10 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                            {selectedEscalation.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-orange-500" /> Resolution Timeline
                                    </h4>
                                    <div className="space-y-6 pl-2 border-l-2 border-slate-100 dark:border-white/5 ml-2">
                                        {selectedEscalation.timeline.map((t: any, i: number) => (
                                            <div key={i} className="relative pl-6">
                                                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-[#0A0F1E] border-2 border-orange-500 flex items-center justify-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                </div>
                                                <p className="text-xs font-black text-slate-400">{t.time}</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1">{t.event}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Reporter */}
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Reported By</p>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedEscalation.from}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01] space-y-3">
                                <Button
                                    className="w-full h-12 bg-slate-900 border-0 dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-100 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-xl"
                                    onClick={() => {
                                        handleResolveEscalation(selectedEscalation.id);
                                        setSelectedEscalation(null);
                                    }}
                                >
                                    Approve Resolution
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full h-12 border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl font-bold uppercase tracking-widest text-xs"
                                >
                                    Escalate Further
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
