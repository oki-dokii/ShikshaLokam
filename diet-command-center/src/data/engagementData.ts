// Learner Engagement Analysis Data
export interface StudentEngagementData {
    id: string;
    subject: string;
    grade: string;
    engagementScore: number;
    attentionSpan: number; // in minutes
    participationRate: number;
    questionAsked: number;
    homeworkCompletion: number;
    trend: 'up' | 'down' | 'stable';
}

export interface ClassroomSession {
    id: string;
    clusterId: string;
    date: string;
    subject: string;
    totalStudents: number;
    activeParticipants: number;
    avgEngagement: number;
    peakEngagementTime: string;
    lowEngagementTime: string;
    activities: ActivityEngagement[];
}

export interface ActivityEngagement {
    activity: string;
    duration: number;
    engagementLevel: 'high' | 'medium' | 'low';
    studentResponse: number;
}

export interface EngagementPattern {
    pattern: string;
    description: string;
    frequency: number;
    impact: 'positive' | 'negative' | 'neutral';
    recommendation: string;
}

// Mock classroom session data
export const CLASSROOM_SESSIONS: ClassroomSession[] = [
    {
        id: 'session-1',
        clusterId: 'cluster-a',
        date: '2026-01-10',
        subject: 'Mathematics',
        totalStudents: 35,
        activeParticipants: 22,
        avgEngagement: 58,
        peakEngagementTime: '10:15 AM',
        lowEngagementTime: '11:00 AM',
        activities: [
            { activity: 'Lecture Introduction', duration: 15, engagementLevel: 'medium', studentResponse: 45 },
            { activity: 'Group Problem Solving', duration: 20, engagementLevel: 'high', studentResponse: 78 },
            { activity: 'Individual Practice', duration: 15, engagementLevel: 'low', studentResponse: 35 },
            { activity: 'Discussion & Q/A', duration: 10, engagementLevel: 'high', studentResponse: 82 },
        ]
    },
    {
        id: 'session-2',
        clusterId: 'cluster-b',
        date: '2026-01-10',
        subject: 'Science',
        totalStudents: 40,
        activeParticipants: 35,
        avgEngagement: 76,
        peakEngagementTime: '09:30 AM',
        lowEngagementTime: '10:45 AM',
        activities: [
            { activity: 'Experiment Demo', duration: 20, engagementLevel: 'high', studentResponse: 88 },
            { activity: 'Theory Explanation', duration: 15, engagementLevel: 'medium', studentResponse: 55 },
            { activity: 'Lab Activity', duration: 25, engagementLevel: 'high', studentResponse: 92 },
            { activity: 'Summary', duration: 10, engagementLevel: 'medium', studentResponse: 60 },
        ]
    },
    {
        id: 'session-3',
        clusterId: 'cluster-c',
        date: '2026-01-10',
        subject: 'Language',
        totalStudents: 28,
        activeParticipants: 15,
        avgEngagement: 42,
        peakEngagementTime: '10:00 AM',
        lowEngagementTime: '10:30 AM',
        activities: [
            { activity: 'Reading Aloud', duration: 15, engagementLevel: 'low', studentResponse: 30 },
            { activity: 'Story Telling', duration: 20, engagementLevel: 'high', studentResponse: 75 },
            { activity: 'Grammar Exercise', duration: 15, engagementLevel: 'low', studentResponse: 25 },
            { activity: 'Group Song', duration: 10, engagementLevel: 'high', studentResponse: 85 },
        ]
    },
    {
        id: 'session-4',
        clusterId: 'cluster-d',
        date: '2026-01-10',
        subject: 'Social Science',
        totalStudents: 32,
        activeParticipants: 24,
        avgEngagement: 65,
        peakEngagementTime: '11:15 AM',
        lowEngagementTime: '11:45 AM',
        activities: [
            { activity: 'Map Activity', duration: 15, engagementLevel: 'high', studentResponse: 80 },
            { activity: 'Textbook Reading', duration: 20, engagementLevel: 'low', studentResponse: 40 },
            { activity: 'Role Play', duration: 20, engagementLevel: 'high', studentResponse: 88 },
            { activity: 'Quiz', duration: 10, engagementLevel: 'high', studentResponse: 75 },
        ]
    }
];

// Weekly engagement trends per cluster
export const WEEKLY_TRENDS = [
    { day: 'Mon', clusterA: 52, clusterB: 78, clusterC: 38, clusterD: 62 },
    { day: 'Tue', clusterA: 48, clusterB: 82, clusterC: 42, clusterD: 65 },
    { day: 'Wed', clusterA: 55, clusterB: 75, clusterC: 45, clusterD: 68 },
    { day: 'Thu', clusterA: 58, clusterB: 80, clusterC: 40, clusterD: 64 },
    { day: 'Fri', clusterA: 45, clusterB: 72, clusterC: 35, clusterD: 60 },
];

// Identified engagement patterns
export const ENGAGEMENT_PATTERNS: EngagementPattern[] = [
    {
        pattern: 'Activity Dip After 30 Minutes',
        description: 'Student attention consistently drops after 30 minutes of any single activity',
        frequency: 85,
        impact: 'negative',
        recommendation: 'Break lessons into 20-minute segments with activity switches'
    },
    {
        pattern: 'High Engagement with Group Work',
        description: 'Group activities show 40% higher engagement than individual work',
        frequency: 92,
        impact: 'positive',
        recommendation: 'Increase collaborative learning activities to at least 50% of class time'
    },
    {
        pattern: 'Morning Peak Performance',
        description: 'Engagement scores are 25% higher in morning sessions (9-11 AM)',
        frequency: 78,
        impact: 'positive',
        recommendation: 'Schedule challenging subjects in morning slots'
    },
    {
        pattern: 'Language Barrier Impact',
        description: 'Cluster C shows 35% lower engagement when standard language is used',
        frequency: 95,
        impact: 'negative',
        recommendation: 'Use local dialect for initial explanations, then transition to standard language'
    },
    {
        pattern: 'Visual Content Boost',
        description: 'Sessions with visual aids show 30% improvement in student response',
        frequency: 88,
        impact: 'positive',
        recommendation: 'Incorporate at least one visual activity per lesson'
    }
];

// Subject-wise engagement averages
export const SUBJECT_ENGAGEMENT = [
    { subject: 'Science (Lab)', engagement: 82, color: '#22c55e' },
    { subject: 'Mathematics', engagement: 65, color: '#3b82f6' },
    { subject: 'Social Science', engagement: 68, color: '#a855f7' },
    { subject: 'Language', engagement: 52, color: '#f97316' },
    { subject: 'Science (Theory)', engagement: 58, color: '#06b6d4' },
];
