import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, PlayCircle, Clock, AlertTriangle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { triggerData, Trigger } from '@/data/triggerData';

interface WoOPanelProps {
    clusterId: string;
    glowColor: 'cyan' | 'purple' | 'orange';
}

export const WoOPanel: React.FC<WoOPanelProps> = ({ clusterId, glowColor }) => {
    // Filter triggers for this cluster (or show all for demo if ID doesn't match perfectly)
    const activeTriggers = triggerData.filter(t => t.clusterId === clusterId);

    const glowClasses = {
        cyan: 'shadow-[0_0_20px_-5px_#00f3ff]',
        purple: 'shadow-[0_0_20px_-5px_#bc13fe]',
        orange: 'shadow-[0_0_20px_-5px_#ff9100]',
    };

    const borderClasses = {
        cyan: 'border-neon-cyan/50',
        purple: 'border-neon-purple/50',
        orange: 'border-neon-orange/50',
    };

    const textClasses = {
        cyan: 'text-neon-cyan',
        purple: 'text-neon-purple',
        orange: 'text-neon-orange',
    };

    if (activeTriggers.length === 0) return null;

    return (
        <div className="mb-8">
            <h2 className="text-xl font-orbitron font-bold text-foreground mb-4 flex items-center gap-2">
                <Bell className={`w-5 h-5 ${textClasses[glowColor]} animate-pulse`} />
                Window of Opportunity (WoO) Alerts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTriggers.map((trigger, idx) => (
                    <TriggerCard
                        key={trigger.id}
                        trigger={trigger}
                        clusterId={clusterId}
                        glowClass={glowClasses[glowColor]}
                        borderClass={borderClasses[glowColor]}
                        textClass={textClasses[glowColor]}
                        delay={idx * 0.1}
                    />
                ))}
            </div>
        </div>
    );
};

interface TriggerCardProps {
    trigger: Trigger;
    clusterId: string;
    glowClass: string;
    borderClass: string;
    textClass: string;
    delay: number;
}

const TriggerCard: React.FC<TriggerCardProps> = ({ trigger, clusterId, glowClass, borderClass, textClass, delay }) => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleDeployModule = () => {
        toast({
            title: "🚀 Deploying Module",
            description: `"${trigger.recommendedModule.title}" is being prepared for ${trigger.affectedSchools} schools...`,
        });

        // Navigate to module generator with pre-filled context including clusterId
        // ClusterDashboard uses short IDs (a, b, c) but mockData expects cluster-a, cluster-b format
        setTimeout(() => {
            navigate('/module-generator', {
                state: {
                    clusterId: `cluster-${clusterId}`,
                    prefilledTopic: trigger.recommendedModule.title,
                    context: `Intervention for: ${trigger.message}`,
                    targetSchools: trigger.affectedSchools
                }
            });
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`relative bg-background/50 backdrop-blur-md border ${borderClass} rounded-xl p-5 overflow-hidden group hover:bg-background/80 transition-all ${glowClass}`}
        >
            {/* Urgency Indicator */}
            {trigger.urgency === 'high' && (
                <div className="absolute top-0 right-0 p-2">
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-500 bg-red-950/30 px-2 py-1 rounded-bl-lg border-l border-b border-red-500/20">
                        <AlertTriangle className="w-3 h-3" />
                        Critical
                    </div>
                </div>
            )}

            <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {trigger.detectedAt}
                </p>
                <h3 className="text-lg font-bold text-foreground leading-tight mb-2">{trigger.message}</h3>
                <p className="text-sm text-muted-foreground">Affected: <span className="text-foreground font-medium">{trigger.affectedSchools} Schools</span></p>
            </div>

            <div className={`p-4 rounded-lg bg-black/40 border border-white/5`}>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Recommended Intervention</p>
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <div className={`font-semibold text-sm ${textClass}`}>{trigger.recommendedModule.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {trigger.recommendedModule.duration}</span>
                            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {trigger.recommendedModule.type}</span>
                        </div>
                    </div>
                </div>
                <Button
                    size="sm"
                    onClick={handleDeployModule}
                    className={`w-full ${textClass} bg-white/5 hover:bg-white/10 border-white/10 hover:scale-105 transition-transform cursor-pointer`}
                >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Deploy Module
                </Button>
            </div>
        </motion.div>
    );
}
