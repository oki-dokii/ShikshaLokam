import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Users, ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SCHEDULE = [
    {
        time: "09:00 - 10:00",
        subject: "Mathematics",
        grade: "Grade 6B",
        status: "completed",
        topic: "Ratios and Proportions"
    },
    {
        time: "10:15 - 11:15",
        subject: "Science",
        grade: "Grade 7A",
        status: "current",
        topic: "Energy Transformations"
    },
    {
        time: "11:30 - 12:30",
        subject: "English",
        grade: "Grade 6A",
        status: "upcoming",
        topic: "Vivid Descriptions in Writing"
    },
    {
        time: "13:30 - 14:30",
        subject: "Social Studies",
        grade: "Grade 8C",
        status: "upcoming",
        topic: "Local Governance"
    }
];

export const TeacherTimetable = () => {
    // Current date for display
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="w-full max-w-4xl mx-auto py-16 px-4">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-4xl font-outfit font-black text-foreground tracking-tight mb-2">
                        Today's <span className="text-primary italic">Journey</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">Your curated classroom schedule</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-border/80 shadow-sm">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-foreground">10:42 AM</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">{today}</span>
                </div>
            </div>

            <div className="relative space-y-6">
                {/* Connection Line */}
                <div className="absolute left-[3.75rem] top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden md:block" />

                {SCHEDULE.map((slot, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className={`relative group overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-500 ${slot.status === 'current'
                                ? 'bg-white border-primary/30 shadow-2xl shadow-primary/5 ring-1 ring-primary/20 scale-[1.02]'
                                : 'bg-muted/10 border-border/50 hover:bg-white hover:border-primary/20 hover:shadow-xl'
                            }`}
                    >
                        {slot.status === 'current' && (
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                <Clock className="w-24 h-24 text-primary" />
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row md:items-center gap-8">
                            <div className="flex-shrink-0 w-24 flex flex-col items-center md:items-start">
                                <span className={`text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${slot.status === 'current' ? 'text-primary' : 'text-muted-foreground'
                                    }`}>
                                    {slot.time.split(' - ')[0]}
                                </span>
                                <div className={`w-8 h-1 rounded-full ${slot.status === 'current' ? 'bg-primary' : 'bg-border'
                                    }`} />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center flex-wrap gap-3 mb-2">
                                    <h3 className={`text-2xl font-outfit font-bold tracking-tight ${slot.status === 'completed' ? 'text-muted-foreground/60 line-through' : 'text-foreground'
                                        }`}>
                                        {slot.subject}
                                    </h3>
                                    {slot.status === 'current' && (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 border border-green-200">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            Live Session
                                        </span>
                                    )}
                                    {slot.status === 'upcoming' && i === 2 && (
                                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
                                            Next Up
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center flex-wrap gap-6 text-sm">
                                    <span className="flex items-center gap-2 font-medium text-muted-foreground">
                                        <div className="p-1.5 bg-muted rounded-lg group-hover:bg-white transition-colors">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        {slot.grade}
                                    </span>
                                    <span className="flex items-center gap-2 font-medium text-muted-foreground">
                                        <div className="p-1.5 bg-muted rounded-lg group-hover:bg-white transition-colors">
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                        {slot.topic}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                {slot.status === 'completed' ? (
                                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl text-emerald-600 font-bold text-sm">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span>Reflection Logged</span>
                                    </div>
                                ) : (
                                    <Button
                                        variant={slot.status === 'current' ? "default" : "outline"}
                                        className={`rounded-2xl gap-3 h-14 px-8 font-bold transition-all duration-300 ${slot.status === 'current'
                                                ? 'bg-primary shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.95]'
                                                : 'border-border/80 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary'
                                            }`}
                                    >
                                        {slot.status === 'current' ? (
                                            <>
                                                <PlayCircle className="w-5 h-5 text-white" />
                                                <span className="text-white">Active Simulation</span>
                                            </>
                                        ) : (
                                            <>
                                                Resource Kit
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 text-center p-8 rounded-[2rem] bg-muted/30 border border-dashed border-border">
                <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
                    Need to adjust your schedule? Your timetable is synced with the <span className="text-primary font-bold italic">District Hub</span>. Changes update in real-time.
                </p>
            </div>
        </div>
    );
};
