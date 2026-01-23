export type TriggerType = 'high-absenteeism' | 'unit-start' | 'performance-drop';

export interface MicroModule {
    id: string;
    title: string;
    duration: string;
    type: 'video' | 'workshop' | 'guide';
}

export interface Trigger {
    id: string;
    clusterId: string;
    type: TriggerType;
    message: string;
    detectedAt: string;
    affectedSchools: number;
    urgency: 'high' | 'medium' | 'low';
    recommendedModule: MicroModule;
}

export const triggerData: Trigger[] = [
    {
        id: '1',
        clusterId: 'a',
        type: 'high-absenteeism',
        message: 'High student absenteeism (>15%) detected in 5 schools',
        detectedAt: '2 hours ago',
        affectedSchools: 5,
        urgency: 'high',
        recommendedModule: {
            id: 'm1',
            title: 'Parent Engagement & Motivation Workshop',
            duration: '15 min',
            type: 'workshop'
        }
    },
    {
        id: '2',
        clusterId: 'b',
        type: 'unit-start',
        message: 'Upcoming Science Unit: Optics starting next week',
        detectedAt: '5 hours ago',
        affectedSchools: 12,
        urgency: 'medium',
        recommendedModule: {
            id: 'm2',
            title: 'Low-Cost TLM for Light & Reflection',
            duration: '10 min',
            type: 'video'
        }
    },
    {
        id: '3',
        clusterId: 'c',
        type: 'performance-drop',
        message: 'Dip in Reading Comprehension scores observed',
        detectedAt: '1 day ago',
        affectedSchools: 8,
        urgency: 'high',
        recommendedModule: {
            id: 'm3',
            title: 'Contextual Storytelling Techniques',
            duration: '20 min',
            type: 'guide'
        }
    }
];
