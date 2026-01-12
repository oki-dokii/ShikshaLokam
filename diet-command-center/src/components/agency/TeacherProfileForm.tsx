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
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Tell us about yourself</h2>
                <p className="text-slate-400">This helps us understand your classroom context better</p>
            </div>

            <div className="space-y-4">
                {/* Region Select */}
                <div className="space-y-2">
                    <label className="text-sm text-slate-400 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Region
                    </label>
                    <Select onValueChange={(v) => updateProfile('region', v)}>
                        <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                            <SelectValue placeholder="Select your region type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/10">
                            {REGIONS.map(r => (
                                <SelectItem key={r} value={r} className="text-white hover:bg-slate-700">
                                    {r}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* School Type Select */}
                <div className="space-y-2">
                    <label className="text-sm text-slate-400 flex items-center gap-2">
                        <School className="w-4 h-4" /> School Type
                    </label>
                    <Select onValueChange={(v) => updateProfile('schoolType', v)}>
                        <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                            <SelectValue placeholder="Select school type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/10">
                            {SCHOOL_TYPES.map(s => (
                                <SelectItem key={s} value={s} className="text-white hover:bg-slate-700">
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Language Select */}
                <div className="space-y-2">
                    <label className="text-sm text-slate-400 flex items-center gap-2">
                        <Languages className="w-4 h-4" /> Medium of Instruction
                    </label>
                    <Select onValueChange={(v) => updateProfile('language', v)}>
                        <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                            <SelectValue placeholder="Select language medium" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/10">
                            {LANGUAGES.map(l => (
                                <SelectItem key={l} value={l} className="text-white hover:bg-slate-700">
                                    {l}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Grade Select */}
                <div className="space-y-2">
                    <label className="text-sm text-slate-400 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> Grade Level
                    </label>
                    <Select onValueChange={(v) => updateProfile('grade', v)}>
                        <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                            <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/10">
                            {GRADES.map(g => (
                                <SelectItem key={g} value={g} className="text-white hover:bg-slate-700">
                                    {g}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Subject Select */}
                <div className="space-y-2">
                    <label className="text-sm text-slate-400 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Subject
                    </label>
                    <Select onValueChange={(v) => updateProfile('subject', v)}>
                        <SelectTrigger className="bg-slate-800/50 border-white/10 text-white">
                            <SelectValue placeholder="Select your subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/10">
                            {SUBJECTS.map(s => (
                                <SelectItem key={s} value={s} className="text-white hover:bg-slate-700">
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={!isComplete}
                    className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold h-14 rounded-full text-lg disabled:opacity-50"
                >
                    Start Swiping <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
};
