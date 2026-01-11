import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Hero } from '../components/landing/Hero';
import { ClusterCard } from '../components/landing/ClusterCard';
import { AlertTriangle, Zap } from 'lucide-react';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <MainLayout>
            <Hero />

            {/* Live Issues Ticker - Simulated */}
            <div className="flex gap-4 mb-16 overflow-x-auto pb-4 no-scrollbar">
                {[
                    { msg: "High Absenteeism in Cluster A (35%)", color: "text-red-400" },
                    { msg: "No Lab Equipment in Cluster B", color: "text-amber-400" },
                    { msg: "Language Barrier in Cluster C", color: "text-brand-orange" }
                ].map((issue, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2 bg-red-950/20 border border-red-500/20 rounded-full whitespace-nowrap">
                        <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                        <span className={`text-sm font-medium ${issue.color}`}>{issue.msg}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <ClusterCard
                    title="Cluster A"
                    subtitle="Attendance & Behaviour"
                    color="cyan"
                    icon="users"
                    stats={[
                        { label: 'Avg Attendance', value: '82%' },
                        { label: 'Behavior Flags', value: '12' }
                    ]}
                    onClick={() => navigate('/dashboard/cluster-a')}
                />
                <ClusterCard
                    title="Cluster B"
                    subtitle="Science & TLM"
                    color="purple"
                    icon="science"
                    stats={[
                        { label: 'Lab Usage', value: '45%' },
                        { label: 'Resource Gap', value: 'High' }
                    ]}
                    onClick={() => navigate('/dashboard/cluster-b')}
                />
                <ClusterCard
                    title="Cluster C"
                    subtitle="Language & Context"
                    color="orange"
                    icon="language"
                    stats={[
                        { label: 'Proficiency', value: 'B1' },
                        { label: 'Training Need', value: 'Critical' }
                    ]}
                    onClick={() => navigate('/dashboard/cluster-c')}
                />
            </div>

            {/* Agency Engine Feature Card */}
            <div className="mb-12">
                <button
                    onClick={() => navigate('/agency')}
                    className="w-full max-w-md mx-auto block group"
                >
                    <div className="glass-panel rounded-xl p-6 border-brand-orange/30 hover:border-brand-orange/60 transition-all hover:shadow-[0_0_30px_-10px_#ff9100]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-brand-orange/20">
                                <Zap className="w-6 h-6 text-brand-orange" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-orbitron font-bold text-white group-hover:text-brand-orange transition-colors">
                                    Agency Engine
                                </h3>
                                <p className="text-sm text-slate-400">
                                    Swipe to tell us your classroom challenges
                                </p>
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            <div className="text-center">
                <button
                    className="relative group px-12 py-4 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan text-brand-cyan font-orbitron font-bold tracking-wider rounded-none overflow-hidden transition-all"
                    onClick={() => console.log('Generating training...')}
                >
                    <div className="absolute inset-0 bg-brand-cyan/20 blur-xl group-hover:blur-2xl transition-all opacity-50" />
                    <span className="relative flex items-center gap-3">
                        <Zap className="w-5 h-5 fill-current" />
                        GENERATE UPDATED TRAINING MODULES
                    </span>
                </button>
            </div>
        </MainLayout>
    );
};
