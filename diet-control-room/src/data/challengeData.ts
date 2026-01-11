import { BookOpen, Users, AlertTriangle, ClipboardCheck, Languages, Lightbulb, Clock, Heart, Target, Zap } from 'lucide-react';

export interface Challenge {
    id: string;
    title: string;
    description: string;
    category: 'Engagement' | 'Resources' | 'Behavior' | 'Assessment' | 'Language';
    icon: typeof BookOpen;
}

export const challengeData: Challenge[] = [
    {
        id: 'ch-1',
        title: 'Students Zone Out During Lectures',
        description: 'Difficulty maintaining student attention during longer explanations or theory sessions.',
        category: 'Engagement',
        icon: Users,
    },
    {
        id: 'ch-2',
        title: 'Lack of Teaching Materials',
        description: 'Limited access to charts, models, or visual aids for effective demonstrations.',
        category: 'Resources',
        icon: BookOpen,
    },
    {
        id: 'ch-3',
        title: 'Disruptive Classroom Behavior',
        description: 'Frequent interruptions, side conversations, or students not following instructions.',
        category: 'Behavior',
        icon: AlertTriangle,
    },
    {
        id: 'ch-4',
        title: 'Difficulty Assessing Understanding',
        description: 'Hard to gauge if students truly understand concepts before moving on.',
        category: 'Assessment',
        icon: ClipboardCheck,
    },
    {
        id: 'ch-5',
        title: 'Language Barrier with Students',
        description: 'Students struggle with instruction language; need to switch between languages.',
        category: 'Language',
        icon: Languages,
    },
    {
        id: 'ch-6',
        title: 'Making Abstract Concepts Concrete',
        description: 'Difficulty explaining theoretical concepts in ways students can visualize.',
        category: 'Engagement',
        icon: Lightbulb,
    },
    {
        id: 'ch-7',
        title: 'Time Management in Class',
        description: 'Running out of time before completing planned activities or lessons.',
        category: 'Behavior',
        icon: Clock,
    },
    {
        id: 'ch-8',
        title: 'Low Student Motivation',
        description: 'Students seem disinterested or unwilling to participate in activities.',
        category: 'Engagement',
        icon: Heart,
    },
    {
        id: 'ch-9',
        title: 'Mixed Ability Levels',
        description: 'Wide range of student abilities makes it hard to teach at the right pace.',
        category: 'Assessment',
        icon: Target,
    },
    {
        id: 'ch-10',
        title: 'No Internet/Tech Access',
        description: 'Cannot use digital resources, videos, or online tools in the classroom.',
        category: 'Resources',
        icon: Zap,
    },
];

export const categoryColors: Record<Challenge['category'], { bg: string; text: string; glow: string }> = {
    Engagement: { bg: 'bg-brand-cyan/20', text: 'text-brand-cyan', glow: 'shadow-[0_0_15px_-5px_#00f3ff]' },
    Resources: { bg: 'bg-brand-orange/20', text: 'text-brand-orange', glow: 'shadow-[0_0_15px_-5px_#ff9100]' },
    Behavior: { bg: 'bg-red-500/20', text: 'text-red-400', glow: 'shadow-[0_0_15px_-5px_#ef4444]' },
    Assessment: { bg: 'bg-brand-purple/20', text: 'text-brand-purple', glow: 'shadow-[0_0_15px_-5px_#bc13fe]' },
    Language: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-[0_0_15px_-5px_#22c55e]' },
};
