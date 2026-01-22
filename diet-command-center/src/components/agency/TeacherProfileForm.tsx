import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, School, Languages, GraduationCap, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    TeacherProfile,
    REGIONS,
    SCHOOL_TYPES,
    LANGUAGES,
    GRADES,
    SUBJECTS
} from '@/types/agency';

interface TeacherProfileFormProps {
    onComplete: (profile: TeacherProfile) => void;
}

export const TeacherProfileForm: React.FC<TeacherProfileFormProps> = ({ onComplete }) => {
    const [profile, setProfile] = useState<Partial<TeacherProfile>>({});

    const isComplete = profile.region && profile.schoolType && profile.language && profile.grade && profile.subject;

    const handleSubmit = () => {
        if (isComplete) {
            onComplete(profile as TeacherProfile);
        }
    };

    const updateProfile = (field: keyof TeacherProfile, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto"
        >
            <div className="clean-card p-8 border-border/80 bg-white relative overflow-hidden shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-pink-500/20">
                        <User className="w-8 h-8 text-pink-500" />
                    </div>
                    <h2 className="text-2xl font-outfit font-bold text-foreground mb-2">Teacher Profile</h2>
                    <p className="text-muted-foreground text-sm font-medium">Define your classroom context for precise demand mapping</p>
                </div>

                <div className="space-y-5">
                    {/* Region Select */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Geographical Context
                        </label>
                        <Select onValueChange={(v) => updateProfile('region', v)}>
                            <SelectTrigger className="bg-muted/30 border-border/80 text-foreground h-12 focus:ring-pink-500/20">
                                <SelectValue placeholder="Select region type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-border shadow-2xl">
                                {REGIONS.map(r => (
                                    <SelectItem key={r} value={r} className="text-foreground focus:bg-pink-50 focus:text-pink-700 font-medium">
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* School Type Select */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                            <School className="w-3 h-3" /> Institution Category
                        </label>
                        <Select onValueChange={(v) => updateProfile('schoolType', v)}>
                            <SelectTrigger className="bg-muted/30 border-border/80 text-foreground h-12 focus:ring-pink-500/20">
                                <SelectValue placeholder="Select school type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-border shadow-2xl">
                                {SCHOOL_TYPES.map(s => (
                                    <SelectItem key={s} value={s} className="text-foreground focus:bg-pink-50 focus:text-pink-700 font-medium">
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Language Select */}
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                            <Languages className="w-3 h-3" /> Language Medium
                        </label>
                        <Select onValueChange={(v) => updateProfile('language', v)}>
                            <SelectTrigger className="bg-muted/30 border-border/80 text-foreground h-12 focus:ring-pink-500/20">
                                <SelectValue placeholder="Select instruction medium" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-border shadow-2xl">
                                {LANGUAGES.map(l => (
                                    <SelectItem key={l} value={l} className="text-foreground focus:bg-pink-50 focus:text-pink-700 font-medium">
                                        {l}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Grade Select */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                <GraduationCap className="w-3 h-3" /> Grade
                            </label>
                            <Select onValueChange={(v) => updateProfile('grade', v)}>
                                <SelectTrigger className="bg-muted/30 border-border/80 text-foreground h-12 focus:ring-pink-500/20">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-border shadow-2xl">
                                    {GRADES.map(g => (
                                        <SelectItem key={g} value={g} className="text-foreground focus:bg-pink-50 focus:text-pink-700 font-medium">
                                            {g}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Subject Select */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                <BookOpen className="w-3 h-3" /> Subject
                            </label>
                            <Select onValueChange={(v) => updateProfile('subject', v)}>
                                <SelectTrigger className="bg-muted/30 border-border/80 text-foreground h-12 focus:ring-pink-500/20">
                                    <SelectValue placeholder="Domain" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-border shadow-2xl">
                                    {SUBJECTS.map(s => (
                                        <SelectItem key={s} value={s} className="text-foreground focus:bg-pink-50 focus:text-pink-700 font-medium">
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={!isComplete}
                        className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold h-14 rounded-2xl text-lg disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-pink-500/20"
                    >
                        Start Swiping <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
