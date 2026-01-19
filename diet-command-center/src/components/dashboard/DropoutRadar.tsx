import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    MessageCircle,
    TrendingDown,
    Calendar,
    ChevronRight,
    UserX,
    ShieldCheck,
    ExternalLink
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

        toast.success(`Intervention started for ${student.name}`);
    };

    return (
        <div className="bg-slate-900 rounded-3xl border border-white/10 overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-red-500/10 to-transparent">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Dropout Radar</h3>
                            <p className="text-xs text-slate-400">Early Warning System (Predictive AI)</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                        {students.filter(s => s.riskLevel === 'high').length} CRITICAL
                    </Badge>
                </div>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {students.map((student) => (
                    <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer group ${selectedStudent?.id === student.id
                                ? 'bg-red-500/10 border-red-500/40'
                                : 'bg-white/5 border-white/5 hover:border-white/20'
                            }`}
                        onClick={() => setSelectedStudent(student)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${student.riskLevel === 'high' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                                    }`}>
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-red-400 transition-colors">
                                        {student.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                                            <Calendar className="w-3 h-3" /> {student.attendance.consecutiveAbsences} days off
                                        </span>
                                        <span className="flex items-center gap-0.5 text-[10px] text-red-400 font-bold">
                                            <TrendingDown className="w-3 h-3" /> {student.engagement.averageScore}% Score
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {student.interventionStatus === 'WhatsApp Sent' ? (
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 rounded-full text-brand-cyan hover:bg-brand-cyan/20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleIntervention(student);
                                        }}
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                    </Button>
                                )}
                                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                            </div>
                        </div>

                        {/* Expanded Detail */}
                        <AnimatePresence>
                            {selectedStudent?.id === student.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden mt-4 pt-4 border-t border-white/10"
                                >
                                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                                        AI Predictor flags {student.name} due to consecutive absences and a downward
                                        trend in quiz engagement over the last 5 modules.
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-black/20 p-2 rounded-lg">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Risk Score</p>
                                            <p className="text-lg font-bold text-red-500">{student.riskScore}%</p>
                                        </div>
                                        <div className="bg-black/20 p-2 rounded-lg">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Trend</p>
                                            <p className="text-lg font-bold text-orange-500 flex items-center gap-1">
                                                DOWN <TrendingDown className="w-4 h-4" />
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold gap-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleIntervention(student);
                                        }}
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        1-Click WhatsApp Intervention
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Footer Info */}
            <div className="p-4 bg-slate-800/50 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 italic">
                    <UserX className="w-3 h-3" />
                    Predictions are based on Random Forest analysis of attendance & quiz data.
                </div>
            </div>
        </div>
    );
};
