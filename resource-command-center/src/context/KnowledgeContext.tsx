import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Insight {
    id: string;
    text: string;
    tags: string[];
    timestamp: number;
    author: string;
    clusterId?: string;
}

interface KnowledgeContextType {
    insights: Insight[];
    addInsight: (text: string, tags: string[], clusterId?: string) => void;
}

const KnowledgeContext = createContext<KnowledgeContextType | undefined>(undefined);

export const KnowledgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [insights, setInsights] = useState<Insight[]>([]);

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('diet_tacit_knowledge');
        if (saved) {
            try {
                setInsights(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse knowledge base", e);
            }
        } else {
            // Seed with some initial data
            setInsights([
                {
                    id: '1',
                    text: "Used marbles to explain electron flow in circuits. Students visualized current much better.",
                    tags: ["#Science", "#Physics", "#HandsOn"],
                    timestamp: Date.now() - 86400000,
                    author: "Sarah J.",
                    clusterId: "b"
                },
                {
                    id: '2',
                    text: "Start the day with a 'feeling check-in' color wheel. Reduced disruptive outbursts by 40%.",
                    tags: ["#SEL", "#ClassroomMgmt", "#Behavior"],
                    timestamp: Date.now() - 172800000,
                    author: "Mike T.",
                    clusterId: "a"
                }
            ]);
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem('diet_tacit_knowledge', JSON.stringify(insights));
    }, [insights]);

    const addInsight = (text: string, tags: string[], clusterId?: string) => {
        const newInsight: Insight = {
            id: Date.now().toString(),
            text,
            tags,
            timestamp: Date.now(),
            author: "You", // Default to current user
            clusterId
        };
        setInsights(prev => [newInsight, ...prev]);
    };

    return (
        <KnowledgeContext.Provider value={{ insights, addInsight }}>
            {children}
        </KnowledgeContext.Provider>
    );
};

export const useKnowledge = () => {
    const context = useContext(KnowledgeContext);
    if (!context) {
        throw new Error("useKnowledge must be used within a KnowledgeProvider");
    }
    return context;
};
