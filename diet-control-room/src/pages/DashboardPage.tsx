import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ArrowLeft, School, GraduationCap, UserCheck, TrendingUp } from 'lucide-react';
import { AttendanceChart, ResourceChart, ProficiencyChart, IssuesTrendChart } from '../components/dashboard/AnalyticsCharts';

export const DashboardPage = () => {
    const { clusterId } = useParams();
    const navigate = useNavigate();

    // Mock data based on cluster ID could go here
    const clusterName = clusterId?.replace('cluster-', 'Cluster ').toUpperCase() || 'CLUSTER';

    return (
        <MainLayout>
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-xl font-orbitron font-bold text-white">{clusterName} <span className="text-brand-cyan">ANALYTICS</span></h2>
                    <p className="text-sm text-slate-500">Real-time performance metrics</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Schools" value="42" icon={School} color="cyan" />
                <StatCard label="Teachers" value="315" icon={UserCheck} color="purple" />
                <StatCard label="Students" value="12.5k" icon={GraduationCap} color="orange" />
                <StatCard label="Avg Attendance" value="88%" icon={TrendingUp} color="emerald" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                <ChartCard title="Attendance Trends (4 Weeks)">
                    <AttendanceChart />
                </ChartCard>

                <ChartCard title="Resource Availability Gap">
                    <ResourceChart />
                </ChartCard>

                <ChartCard title="Language Proficiency Distribution">
                    <ProficiencyChart />
                </ChartCard>

                <ChartCard title="Issue Resolution Velocity">
                    <IssuesTrendChart />
                </ChartCard>
            </div>
        </MainLayout>
    );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => {
    const colorOutput = {
        cyan: 'text-brand-cyan',
        purple: 'text-brand-purple',
        orange: 'text-brand-orange',
        emerald: 'text-emerald-400'
    }[color as string] || 'text-white';

    return (
        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-xl backdrop-blur-sm relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-3 opacity-10 ${colorOutput}`}>
                <Icon className="w-12 h-12" />
            </div>
            <div className="relative z-10">
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">{label}</div>
                <div className="text-2xl font-orbitron font-bold text-white">{value}</div>
            </div>
        </div>
    );
}

const ChartCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-xl backdrop-blur-sm">
        <h3 className="text-sm font-orbitron text-slate-300 mb-6 border-b border-white/5 pb-2">{title}</h3>
        {children}
    </div>
);
