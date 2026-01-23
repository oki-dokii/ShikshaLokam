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
    MessageSquare
} from 'lucide-react';
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
                loading: 'Analyzing teacher requirements...',
                success: () => {
                    setStaffing(prev => prev.map(s => ({ ...s, status: 'balanced', value: 0, teachers: s.required })));
                    return 'Optimization complete: Deployment orders drafted for better PTR.';
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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Staffing & PTR Balancer */}
            <Card className="bg-[#0A0F1E]/80 border-blue-500/20 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                <Users className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-white font-orbitron tracking-wide text-xl">Staffing & PTR Balancer</CardTitle>
                        </div>
                        <CardDescription className="text-blue-200/50">
                            Real-time analysis of teacher deployment vs requirement across 42 schools.
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleAutoBalance}
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-bold uppercase tracking-wide text-xs"
                    >
                        <Activity className="w-4 h-4 mr-2" /> Auto-Balance
                    </Button>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        {staffing.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-[#0F1629] rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 border border-white/10 group-hover:bg-blue-900/50 group-hover:text-blue-300 transition-colors">
                                        {item.school.substring(0, 2)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-base group-hover:text-blue-200 transition-colors">{item.school}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                                            <span>Current: <span className="text-white">{item.teachers}</span></span>
                                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                                            <span>Required: <span className="text-white">{item.required}</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {item.status === 'deficit' && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleWhatsAppSchool(item.school, item.value)}
                                            className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleStaffAction(item.school)}
                                        className="h-8 w-8 text-slate-400 hover:text-white"
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Compliance Dashboard */}
                <Card className="bg-[#0A0F1E]/80 border-emerald-500/20 backdrop-blur-xl h-full">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="flex items-center gap-3 text-white font-orbitron tracking-wide text-lg">
                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                <FileCheck className="w-5 h-5" />
                            </div>
                            Compliance Tracker
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {compliance.map((item, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between text-sm items-end">
                                    <span className="text-white font-bold">{item.task}</span>
                                    <Badge variant="outline" className={`text-[10px] border-none ${item.due === 'Today' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'
                                        }`}>Due: {item.due}</Badge>
                                </div>
                                <div className="relative pt-1">
                                    <Progress value={item.progress} className="h-2.5 bg-slate-800 rounded-full" />
                                    <span className="absolute right-0 top-0 -mt-1 text-xs font-bold text-emerald-400">{item.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Escalation Matrix */}
                <Card className="bg-gradient-to-br from-red-950/20 to-[#0A0F1E] border-red-500/20 backdrop-blur-xl">
                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="flex items-center gap-3 text-white font-orbitron tracking-wide text-lg">
                            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 animate-pulse">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            Escalation Matrix
                        </CardTitle>
                        <CardDescription className="text-red-300/50">Actions Required: {escalations.length}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        {escalations.map((issue) => (
                            <div key={issue.id} className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer group relative overflow-hidden">
                                <div className="absolute left-0 top-0 w-1 h-full bg-red-500" />
                                <div className="flex justify-between items-start pl-3">
                                    <div className="space-y-1">
                                        <Badge variant="outline" className="text-[10px] py-0 border-red-500/20 text-red-400 bg-red-500/10">{issue.type}</Badge>
                                        <h5 className="font-bold text-white text-sm group-hover:text-red-200 transition-colors">{issue.title}</h5>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" /> {issue.from}
                                        </p>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                                </div>
                                <div className="flex gap-2 mt-4 pl-3">
                                    <Button
                                        size="sm"
                                        onClick={() => handleResolveEscalation(issue.id)}
                                        className="h-7 text-xs bg-red-600 hover:bg-red-500 text-white border-0 shadow-lg shadow-red-600/20"
                                    >
                                        Resolve
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs border-white/10 text-slate-400 hover:text-white hover:bg-white/5">Details</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
