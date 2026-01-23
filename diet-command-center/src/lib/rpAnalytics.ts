import { BlockMetrics, ClusterMetrics, SchoolMetrics, ObservationReport } from '../types/courseTypes';

export const MOCK_BLOCK_DATA: BlockMetrics = {
    id: 'b1',
    name: 'Aurad Block',
    totalSchools: 42,
    criticalInterventionsCount: 8,
    clusters: [
        {
            id: 'c1',
            name: 'Aurad Town',
            overallHealth: 78,
            topPerformingSchool: 'GHS Aurad Main',
            needsSupportCount: 2,
            schools: [
                { id: 's1', name: 'GHS Aurad Main', teacherCount: 12, averageEngagement: 92, atRiskCount: 1, lastVisitDate: '2024-03-10' },
                { id: 's2', name: 'GLPS Aurad West', teacherCount: 5, averageEngagement: 65, atRiskCount: 3, lastVisitDate: '2024-03-12' },
                { id: 's3', name: 'GMS Aurad Town', teacherCount: 8, averageEngagement: 77, atRiskCount: 2, lastVisitDate: '2024-03-05' }
            ]
        },
        {
            id: 'c2',
            name: 'Kushnoor',
            overallHealth: 62,
            topPerformingSchool: 'GHS Kushnoor',
            needsSupportCount: 5,
            schools: [
                { id: 's4', name: 'GHS Kushnoor', teacherCount: 15, averageEngagement: 85, atRiskCount: 2, lastVisitDate: '2024-03-08' },
                { id: 's5', name: 'GLPS Border Area', teacherCount: 4, averageEngagement: 42, atRiskCount: 5, lastVisitDate: '2024-03-15' },
                { id: 's6', name: 'GMS Hill Station', teacherCount: 6, averageEngagement: 58, atRiskCount: 4, lastVisitDate: '2024-03-14' }
            ]
        }
    ]
};

export const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
};

export const generateObservationReport = async (transcript: string): Promise<Partial<ObservationReport['aiAnalysis']>> => {
    // In a real implementation, this would call Gemini to analyze the teaching transcript
    // For now, we simulate the AI analysis logic
    return {
        strengths: [
            "Effective use of local analogies for complex concepts.",
            "Strong classroom management and student eye-contact.",
            "Successful integration of Frugal TLMs (Classroom trash used as tools)."
        ],
        improvements: [
            "Encourage more participation from students in the back rows.",
            "Use simpler language when explaining abstract mathematical theories.",
            "Wait for 5 seconds after asking a question before answering it yourself."
        ],
        pedagogicalScore: 84,
        recommendedResources: [
            "Advanced Pedagogy Micro-module #4: Active Listening",
            "NCERT Science Chapter 4: Pedagogical Guide for Teachers"
        ]
    };
};
