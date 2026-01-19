import { StudentRiskProfile, EngagementData } from '../types/courseTypes';

/**
 * SIMULATED RANDOM FOREST PREDICTOR
 * In a real-world scenario, this would call a Python microservice 
 * or use a TensorFlow.js model trained on attendance/engagement data.
 */
export const calculateDropoutRisk = (
    attendanceDaysMissed: number,
    engagement: EngagementData
): { score: number; level: 'low' | 'medium' | 'high' } => {
    // Weights (Simulating Random Forest feature importance)
    const ATTENDANCE_WEIGHT = 0.6;
    const ENGAGEMENT_WEIGHT = 0.4;

    // 1. Attendance Score (0-100)
    // 3+ days is a major red flag in literature
    const attendanceScore = attendanceDaysMissed >= 3 ? 100 : attendanceDaysMissed * 30;

    // 2. Engagement Score (0-100)
    // Low average + downward trend increases risk
    let engagementRisk = (100 - engagement.averageScore);
    if (engagement.trend === 'down') engagementRisk += 20;
    engagementRisk = Math.min(100, engagementRisk);

    // Weighted Average
    const totalRisk = (attendanceScore * ATTENDANCE_WEIGHT) + (engagementRisk * ENGAGEMENT_WEIGHT);

    let level: 'low' | 'medium' | 'high' = 'low';
    if (totalRisk > 70) level = 'high';
    else if (totalRisk > 40) level = 'medium';

    return { score: Math.round(totalRisk), level };
};

export const MOCK_AT_RISK_STUDENTS: StudentRiskProfile[] = [
    {
        id: 's1',
        name: 'Rahul Kumar',
        attendance: {
            consecutiveAbsences: 4,
            totalAbsenceRate: 0.25,
            lastSeenDate: '2024-03-15',
        },
        engagement: {
            lastFiveQuizScores: [80, 70, 50, 40, 30],
            averageScore: 54,
            participationRate: 0.6,
            trend: 'down',
        },
        riskScore: 85,
        riskLevel: 'high',
        interventionStatus: 'none',
        parentContact: '+919876543210',
    },
    {
        id: 's2',
        name: 'Priya Sharma',
        attendance: {
            consecutiveAbsences: 2,
            totalAbsenceRate: 0.1,
            lastSeenDate: '2024-03-18',
        },
        engagement: {
            lastFiveQuizScores: [40, 45, 35, 40, 38],
            averageScore: 39,
            participationRate: 0.9,
            trend: 'stable',
        },
        riskScore: 55,
        riskLevel: 'medium',
        interventionStatus: 'none',
        parentContact: '+919876543211',
    },
    {
        id: 's3',
        name: 'Amit Singh',
        attendance: {
            consecutiveAbsences: 3,
            totalAbsenceRate: 0.15,
            lastSeenDate: '2024-03-16',
        },
        engagement: {
            lastFiveQuizScores: [90, 85, 80, 75, 70],
            averageScore: 80,
            participationRate: 0.8,
            trend: 'down',
        },
        riskScore: 45,
        riskLevel: 'medium',
        interventionStatus: 'none',
        parentContact: '+919876543212',
    }
];

export const generateWhatsAppLink = (student: StudentRiskProfile): string => {
    const message = `Hello, this is a message from [Teacher Name] at [School Name]. I noticed that ${student.name} has been absent for ${student.attendance.consecutiveAbsences} days and their recent quiz engagement has dipped. We value ${student.name}'s progress and would love to discuss how we can support them. Please let us know a good time to speak.`;

    return `https://wa.me/${student.parentContact.replace('+', '')}?text=${encodeURIComponent(message)}`;
};
