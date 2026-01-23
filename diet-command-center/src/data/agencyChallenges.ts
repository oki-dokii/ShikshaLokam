import {
    Users, BookOpen, AlertTriangle, Home, Wrench, GraduationCap,
    Clock, Heart, Languages, Lightbulb, Zap, Calendar,
    MessageSquare, Target, Coins, CloudOff, UserX, Layers,
    HandHeart, HelpCircle
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Challenge {
    id: string;
    text: string; // First-person phrasing for teachers
    category: 'attendance' | 'infrastructure' | 'management' | 'community' | 'resources' | 'learning';
    icon: LucideIcon;
}

export const CHALLENGES: Challenge[] = [
    // Attendance Challenges
    {
        id: 'att-1',
        text: 'My students leave for harvest season every year',
        category: 'attendance',
        icon: Calendar,
    },
    {
        id: 'att-2',
        text: 'Students often skip class to help with family work',
        category: 'attendance',
        icon: Users,
    },
    {
        id: 'att-3',
        text: 'Girls drop out after reaching puberty',
        category: 'attendance',
        icon: UserX,
    },

    // Infrastructure Challenges
    {
        id: 'inf-1',
        text: 'No electricity in my classroom for digital aids',
        category: 'infrastructure',
        icon: Zap,
    },
    {
        id: 'inf-2',
        text: 'We have no proper drinking water facility',
        category: 'infrastructure',
        icon: CloudOff,
    },
    {
        id: 'inf-3',
        text: 'The classroom roof leaks during monsoon',
        category: 'infrastructure',
        icon: Home,
    },
    {
        id: 'inf-4',
        text: 'No separate toilets for girls in our school',
        category: 'infrastructure',
        icon: AlertTriangle,
    },

    // Management Challenges
    {
        id: 'mgt-1',
        text: 'I teach Grades 1-5 all in one room (multi-grade)',
        category: 'management',
        icon: Layers,
    },
    {
        id: 'mgt-2',
        text: 'Too many students in my class (overcrowded)',
        category: 'management',
        icon: Users,
    },
    {
        id: 'mgt-3',
        text: 'I struggle to manage disruptive behavior',
        category: 'management',
        icon: AlertTriangle,
    },
    {
        id: 'mgt-4',
        text: 'I run out of time before completing lessons',
        category: 'management',
        icon: Clock,
    },

    // Community Challenges
    {
        id: 'com-1',
        text: 'Parents don\'t attend school meetings',
        category: 'community',
        icon: MessageSquare,
    },
    {
        id: 'com-2',
        text: 'Parents don\'t value education over work',
        category: 'community',
        icon: Coins,
    },
    {
        id: 'com-3',
        text: 'Community doesn\'t trust the school system',
        category: 'community',
        icon: HandHeart,
    },

    // Resources Challenges
    {
        id: 'res-1',
        text: 'No Science Lab equipment available',
        category: 'resources',
        icon: Wrench,
    },
    {
        id: 'res-2',
        text: 'We lack basic teaching charts and materials',
        category: 'resources',
        icon: BookOpen,
    },
    {
        id: 'res-3',
        text: 'No sports equipment for physical education',
        category: 'resources',
        icon: Target,
    },
    {
        id: 'res-4',
        text: 'Textbooks arrive late or are insufficient',
        category: 'resources',
        icon: BookOpen,
    },

    // Learning Challenges
    {
        id: 'lrn-1',
        text: 'Students struggle with English fluency',
        category: 'learning',
        icon: Languages,
    },
    {
        id: 'lrn-2',
        text: 'Students can\'t grasp abstract Math concepts',
        category: 'learning',
        icon: Lightbulb,
    },
    {
        id: 'lrn-3',
        text: 'Wide gap in student ability levels',
        category: 'learning',
        icon: GraduationCap,
    },
    {
        id: 'lrn-4',
        text: 'Students are unmotivated and disinterested',
        category: 'learning',
        icon: Heart,
    },
    {
        id: 'lrn-5',
        text: 'I can\'t tell if students really understand',
        category: 'learning',
        icon: HelpCircle,
    },
];

export const categoryConfig: Record<Challenge['category'], { bg: string; text: string; label: string }> = {
    attendance: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Attendance' },
    infrastructure: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Infrastructure' },
    management: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Management' },
    community: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Community' },
    resources: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'Resources' },
    learning: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'Learning' },
};
