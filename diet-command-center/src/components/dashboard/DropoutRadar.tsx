import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    MessageSquare,
    TrendingDown,
    Calendar,
    ChevronRight,
    UserX,
    ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MOCK_AT_RISK_STUDENTS, generateWhatsAppLink } from '@/lib/dropoutPrediction';
import type { StudentRiskProfile } from '@/types/courseTypes';

export const DropoutRadar = () => {
    const [students, setStudents] = useState<StudentRiskProfile[]>(MOCK_AT_RISK_STUDENTS);
    const [selectedStudent, setSelectedStudent] = useState<StudentRiskProfile | null>(null);

    const handleIntervention = (student: StudentRiskProfile) => {
        const link = generateWhatsAppLink(student);
        window.open(link, '_blank');

        // Update status locally
        setStudents(prev => prev.map(s =>
            s.id === student.id ? { ...s, interventionStatus: 'WhatsApp Sent' } : s
        ));

        toast.success(`Intervention started for ${student.name}`, {
            description: "WhatsApp message draft opened with predictive insights.",
            icon: <MessageSquare className="w-4 h-4 text-emerald-500" />
        });
    };

    return (
        <div className="bg-white/95 dark:bg-[#0A0F1E]/60 border border-slate-200 dark:border-white/5 backdrop-blur-3xl rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.03] via-transparent to-transparent pointer-events-none" />

            {/* Header */}
            <div className="p-10 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[1.25rem] bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center border border-red-500/20 shadow-xl shadow-red-500/10">
                            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white font-orbitron tracking-tight uppercase">Dropout Radar</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black tracking-[0.25em] uppercase">Predictive Student Risk AI v2.0</p>
                            </div>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 px-4 py-1.5 font-black uppercase tracking-widest text-[9px]">
                        {students.filter(s => s.riskLevel === 'high').length} CRITICAL ALERTS
                    </Badge>
                </div>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-4 max-h-[600px] relative z-10">
                {students.map((student, i) => (
                    <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${selectedStudent?.id === student.id
                            ? 'bg-red-500/[0.05] border-red-500/40 shadow-inner'
                            : 'bg-slate-50/50 dark:bg-white/[0.03] border-slate-200/60 dark:border-white/5 hover:border-red-500/30 hover:bg-white dark:hover:bg-red-500/[0.05]'
                            }`}
                        onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl font-orbitron transform group-hover:scale-110 transition-transform ${student.riskLevel === 'high' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                                    }`}>
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-800 dark:text-white group-hover:text-red-600 transition-colors tracking-tight uppercase">
                                        {student.name}
                                    </h4>
                                    <div className="flex items-center gap-4 mt-2">
                                        <Badge variant="outline" className="bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[9px] h-6 rounded-lg border-slate-200/50 dark:border-white/10 font-bold px-2 flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" /> {student.attendance.consecutiveAbsences} Days Absent
                                        </Badge>
                                        <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                            <TrendingDown className="w-3.5 h-3.5" /> Performance: {student.engagement.averageScore}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {student.interventionStatus === 'WhatsApp Sent' ? (
                                    <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                        <ShieldCheck className="w-5 h-5" /> Intervention Sent
                                    </div>
                                ) : (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-12 w-12 rounded-2xl bg-white/50 dark:bg-white/5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-500/20 shadow-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleIntervention(student);
                                        }}
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                    </Button>
                                )}
                                <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform ${selectedStudent?.id === student.id ? 'rotate-90' : ''}`} />
                            </div>
                        </div>

                        {/* Expanded Detail */}
                        <AnimatePresence>
                            {selectedStudent?.id === student.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden mt-6 pt-6 border-t border-slate-100 dark:border-white/5 space-y-6"
                                >
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">
                                        "High probability of drop-out detected by Pattern Recognition Engine.
                                        {student.name} is showing consistent score degradation from 80% to {student.engagement.averageScore}% over {student.engagement.lastFiveQuizScores.length} cycles."
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white dark:bg-black/40 p-5 rounded-[1.5rem] border border-slate-200/60 dark:border-white/5 shadow-xl">
                                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Composite Risk Index</p>
                                            <div className="flex items-end gap-3">
                                                <span className="text-4xl font-black text-red-500 font-orbitron">{student.riskScore}%</span>
                                                <Badge className="bg-red-500/10 text-red-600 border-0 mb-1">CRITICAL</Badge>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-black/40 p-5 rounded-[1.5rem] border border-slate-200/60 dark:border-white/5 shadow-xl">
                                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Engagement Velocity</p>
                                            <div className="flex items-end gap-3 text-red-500">
                                                <TrendingDown className="w-8 h-8 mb-1" />
                                                <span className="text-4xl font-black font-orbitron uppercase">Neg.</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl gap-3 shadow-[0_15px_30px_-5px_rgba(16,185,129,0.3)]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleIntervention(student);
                                        }}
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        1-Click WhatsApp Parent Feedback
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01] relative z-10">
                <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-widest">
                    <UserX className="w-4 h-4 text-red-500" />
                    AI insight: Predictions synthesized by the Regional Intelligence Repository for Aurangabad.
                </div>
            </div>
        </div>
    );
};
