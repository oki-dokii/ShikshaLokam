export interface TeacherProfile {
    region: string;
    schoolType: string;
    language: string;
    grade: string;
    subject: string;
}

export interface SwipeRecord {
    challenge_id: string;
    challenge_text: string;
    swipe_direction: 'left' | 'right' | 'up';
    urgency_level: 'low' | 'medium' | 'high';
    teacher_context: TeacherProfile;
    timestamp: string;
}

export interface AggregatedDemand {
    topChallenges: { text: string; count: number; urgencyScore: number }[];
    urgentChallenges: { text: string; count: number }[];
    categoryBreakdown: { category: string; count: number }[];
    recommendedModule: string;
    demandProfile: string;
}

// Preset options for teacher profile
export const REGIONS = [
    'Rural - Remote Village',
    'Rural - Near Town',
    'Semi-Urban',
    'Tribal Area',
    'Urban Slum',
];

export const SCHOOL_TYPES = [
    'Government Primary School',
    'Government Upper Primary',
    'Government High School',
    'Ashram School (Residential)',
    'KGBV (Girls Residential)',
];

export const LANGUAGES = [
    'Hindi Medium',
    'English Medium',
    'Regional Language',
    'Tribal Dialect + Hindi',
    'Bilingual',
];

export const GRADES = [
    'Grades 1-2',
    'Grades 3-5',
    'Grades 6-8',
    'Grades 9-10',
    'Multi-Grade (1-5)',
];

export const SUBJECTS = [
    'All Subjects (Primary)',
    'Mathematics',
    'Science',
    'Social Studies',
    'Language (Hindi/English)',
    'Physical Education',
];
