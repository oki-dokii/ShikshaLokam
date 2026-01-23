import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen, Users, ArrowRight, CheckCircle2, PlayCircle, Plus, X, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface TimetableSlot {
    id: string;
    time: string;
    subject: string;
    grade: string;
    status: 'completed' | 'current' | 'upcoming';
    topic: string;
}

const DEFAULT_SCHEDULE: TimetableSlot[] = [
    {
        id: '1',
        time: "09:00 - 10:00",
        subject: "Mathematics",
        grade: "Grade 6B",
        status: "completed",
        topic: "Ratios and Proportions"
    },
    {
        id: '2',
        time: "10:15 - 11:15",
        subject: "Science",
        grade: "Grade 7A",
        status: "current",
        topic: "Energy Transformations"
    },
    {
        id: '3',
        time: "11:30 - 12:30",
        subject: "English",
        grade: "Grade 6A",
        status: "upcoming",
        topic: "Vivid Descriptions in Writing"
    },
    {
        id: '4',
        time: "13:30 - 14:30",
        subject: "Social Studies",
        grade: "Grade 8C",
        status: "upcoming",
        topic: "Local Governance"
    }
];

export const TeacherTimetable = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [schedule, setSchedule] = useState<TimetableSlot[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Form state
    const [newSlot, setNewSlot] = useState({
        time: '',
        subject: '',
        grade: '',
        topic: ''
    });

    // Load schedule from localStorage on mount
    useEffect(() => {
        if (user?.email) {
            const savedSchedule = localStorage.getItem(`timetable_${user.email}`);
            if (savedSchedule) {
                setSchedule(JSON.parse(savedSchedule));
            } else {
                setSchedule(DEFAULT_SCHEDULE);
            }
        }
    }, [user?.email]);

    // Save schedule whenever it changes
    useEffect(() => {
        if (user?.email && schedule.length > 0) {
            localStorage.setItem(`timetable_${user.email}`, JSON.stringify(schedule));
        }
    }, [schedule, user?.email]);

    const handleAddSlot = () => {
        if (!newSlot.time || !newSlot.subject || !newSlot.grade || !newSlot.topic) {
            toast.error("Please fill all fields");
            return;
        }

        const slot: TimetableSlot = {
            id: Date.now().toString(),
            ...newSlot,
            status: 'upcoming'
        };

        setSchedule([...schedule, slot]);
        setIsAddOpen(false);
        setNewSlot({ time: '', subject: '', grade: '', topic: '' });
        toast.success("Schedule updated!");
    };

    const handleDeleteSlot = (id: string) => {
        setSchedule(schedule.filter(s => s.id !== id));
        toast.success("Slot removed");
    };

    const getDynamicStatus = (timeRange: string): 'completed' | 'current' | 'upcoming' => {
        try {
            const [start, end] = timeRange.split(' - ');
            const now = new Date();
            const [startH, startM] = start.split(':').map(Number);
            const [endH, endM] = end.split(':').map(Number);

            const startTime = new Date(now);
            startTime.setHours(startH, startM, 0);

            const endTime = new Date(now);
            endTime.setHours(endH, endM, 0);

            if (now < startTime) return 'upcoming';
            if (now > endTime) return 'completed';
            return 'current';
        } catch (e) {
            return 'upcoming';
        }
    };

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    const today = currentTime.toLocaleDateString('en-US', {
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

                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white border-primary/20 transition-all gap-2">
                                    <Plus className="w-4 h-4" />
                                    Add Slot
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-outfit font-bold">Add New Class</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Time Slot (e.g. 09:00 - 10:00)</Label>
                                        <Input
                                            value={newSlot.time}
                                            onChange={e => setNewSlot({ ...newSlot, time: e.target.value })}
                                            placeholder="HH:MM - HH:MM"
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Subject</Label>
                                        <Input
                                            value={newSlot.subject}
                                            onChange={e => setNewSlot({ ...newSlot, subject: e.target.value })}
                                            placeholder="Mathematics, Science..."
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Grade</Label>
                                        <Input
                                            value={newSlot.grade}
                                            onChange={e => setNewSlot({ ...newSlot, grade: e.target.value })}
                                            placeholder="Grade 6B"
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Topic</Label>
                                        <Input
                                            value={newSlot.topic}
                                            onChange={e => setNewSlot({ ...newSlot, topic: e.target.value })}
                                            placeholder="Core concept for today"
                                            className="rounded-xl"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddSlot} className="w-full rounded-xl py-6 font-bold shadow-lg shadow-primary/20">Save to My Journey</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-border/80 shadow-sm">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-foreground">{formattedTime}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{today}</span>
                    </div>
                </div>
            </div>

            <div className="relative space-y-6">
                {/* Connection Line */}
                <div className="absolute left-[3.75rem] top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden md:block" />

                <AnimatePresence mode='popLayout'>
                    {schedule.map((slot, i) => {
                        const status = getDynamicStatus(slot.time);
                        return (
                            <motion.div
                                key={slot.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                layout
                                className={`relative group overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-500 ${status === 'current'
                                    ? 'bg-card border-primary/40 shadow-2xl shadow-primary/10 ring-1 ring-primary/20 scale-[1.02] dark:bg-primary/5'
                                    : 'bg-muted/20 border-border/50 hover:bg-card hover:border-primary/20 hover:shadow-xl'
                                    }`}
                            >
                                {status === 'current' && (
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] dark:opacity-[0.1]">
                                        <Clock className="w-24 h-24 text-primary" />
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row md:items-center gap-8">
                                    <button
                                        onClick={() => handleDeleteSlot(slot.id)}
                                        className="absolute top-4 right-4 p-2 text-muted-foreground/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="flex-shrink-0 w-24 flex flex-col items-center md:items-start">
                                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${status === 'current' ? 'text-primary' : 'text-muted-foreground'
                                            }`}>
                                            {slot.time.split(' - ')[0]}
                                        </span>
                                        <div className={`w-8 h-1 rounded-full ${status === 'current' ? 'bg-primary' : 'bg-border'
                                            }`} />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center flex-wrap gap-3 mb-2">
                                            <h3 className={`text-2xl font-outfit font-bold tracking-tight ${status === 'completed' ? 'text-muted-foreground/60 line-through' : 'text-foreground'
                                                }`}>
                                                {slot.subject}
                                            </h3>
                                            {status === 'current' && (
                                                <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 border border-green-500/20">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                    Live Session
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center flex-wrap gap-6 text-sm">
                                            <span className="flex items-center gap-2 font-medium text-muted-foreground">
                                                <div className="p-1.5 bg-muted/50 rounded-lg group-hover:bg-background transition-colors dark:bg-muted/30 dark:group-hover:bg-muted/50">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                {slot.grade}
                                            </span>
                                            <span className="flex items-center gap-2 font-medium text-muted-foreground">
                                                <div className="p-1.5 bg-muted/50 rounded-lg group-hover:bg-background transition-colors dark:bg-muted/30 dark:group-hover:bg-muted/50">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                                {slot.topic}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0">
                                        {status === 'completed' ? (
                                            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 rounded-2xl text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span>Reflection Logged</span>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={() => navigate(status === 'current' ? '/simulation' : '/content-transformer')}
                                                variant={status === 'current' ? "default" : "outline"}
                                                className={`rounded-2xl gap-3 h-14 px-8 font-bold transition-all duration-300 ${status === 'current'
                                                    ? 'bg-primary shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] text-primary-foreground'
                                                    : 'border-border/80 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary'
                                                    }`}
                                            >
                                                {status === 'current' ? (
                                                    <>
                                                        <PlayCircle className="w-5 h-5" />
                                                        <span>Active Simulation</span>
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
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="mt-12 text-center p-8 rounded-[2rem] bg-muted/20 border border-dashed border-border/50">
                <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
                    Need to adjust your schedule? Add new slots or remove completed ones. Changes are saved to your personal <span className="text-primary font-bold italic">Teaching Hub</span>.
                </p>
            </div>
        </div>
    );
};
