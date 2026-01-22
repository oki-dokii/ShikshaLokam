import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Map as MapIcon,
    GraduationCap,
    Mic,
    LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MOCK_BLOCK_DATA } from '@/lib/rpAnalytics';
import { MentorCopilot } from '@/components/rp/MentorCopilot';
import { SpaceScene } from '@/components/layout/SpaceScene';
import { CRPDashboard } from '@/components/rp/CRPDashboard';
import { ARPDashboard } from '@/components/rp/ARPDashboard';
import { BRPDashboard } from '@/components/rp/BRPDashboard';



type RPRole = 'BRP' | 'CRP' | 'ARP';

export default function ResourcePersonDashboard() {
    const [role, setRole] = useState<RPRole>('BRP');
    const [selectedCluster, setSelectedCluster] = useState(MOCK_BLOCK_DATA.clusters[0]);
    const [showMentorCopilot, setShowMentorCopilot] = useState(false);

    const handleGenerateReport = () => {
        const reportType = role === 'BRP' ? 'Cluster Health Report' : role === 'ARP' ? 'Academic Excellence Plan' : 'Mentorship Activity Log';

        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: `Generating ${reportType} for ${selectedCluster.name}...`,
                success: (data) => `${reportType} has been generated and sent to your email.`,
                error: 'Failed to generate report. Please try again.',
            }
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] relative overflow-x-hidden p-6 md:p-10 selection:bg-brand-blue/30 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="hidden dark:block">
                    <SpaceScene />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/80 to-[#020617]" />
                </div>
                <div className="dark:hidden absolute inset-0 bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-40" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pb-8 border-b border-slate-200 dark:border-white/5">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-brand-blue/40 blur-xl rounded-full animate-pulse" />
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center relative shadow-[0_0_30px_rgba(37,99,235,0.3)] border border-white/10">
                                    <LayoutDashboard className="w-7 h-7 text-white" />
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <h1 className="text-4xl md:text-5xl font-black font-orbitron tracking-tighter text-slate-900 dark:text-white uppercase drop-shadow-2xl">
                                    Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">Command</span>
                                </h1>
                                <p className="text-slate-400 text-sm font-medium tracking-wide flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    OPERATIONAL DASHBOARD v2.0 • {MOCK_BLOCK_DATA.name.toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Role Switcher - HUD Style */}
                <div className="flex p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden ring-1 ring-slate-200 dark:ring-white/5">
                    <div className="absolute inset-x-0 -top-full h-full bg-gradient-to-b from-slate-100/50 dark:from-white/5 to-transparent opacity-20" />
                    {(['BRP', 'ARP', 'CRP'] as RPRole[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`
                                    relative px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ease-out
                                    ${role === r
                                    ? 'text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] bg-gradient-to-br from-brand-blue via-blue-600 to-blue-700 transform scale-105 z-10'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }
                                `}
                        >
                            {r} View
                            {role === r && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-xl" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="w-full">
                    <div className="bg-white/60 dark:bg-[#0A0F1E]/40 border border-slate-200 dark:border-white/5 rounded-3xl p-1 md:p-8 backdrop-blur-sm relative overflow-hidden min-h-[600px] shadow-sm dark:shadow-none">

                        {/* Dashboard Role Context Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200 dark:border-white/5 gap-4">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tighter uppercase">
                                    {role === 'CRP' ? (
                                        <div className="p-2 bg-brand-blue/20 rounded-lg text-brand-blue"><MapIcon className="w-6 h-6" /></div>
                                    ) : role === 'ARP' ? (
                                        <div className="p-2 bg-pink-500/20 rounded-lg text-pink-500"><GraduationCap className="w-6 h-6" /></div>
                                    ) : (
                                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-500"><LayoutDashboard className="w-6 h-6" /></div>
                                    )}
                                    {role === 'BRP' ? 'Block Operations Center' :
                                        role === 'ARP' ? 'Academic Excellence Hub' :
                                            'Field Mentor Cockpit'}
                                </h2>
                                <p className="text-slate-400 text-sm mt-2 ml-14 font-medium max-w-2xl leading-relaxed">
                                    {role === 'BRP' ? 'Administrative oversight, resource allocation, and compliance monitoring across all clusters.' :
                                        role === 'ARP' ? 'Pedagogical planning, teacher training analytics, and learning outcome tracking.' :
                                            'Daily visit planning, classroom observation tools, and peer mentorship management.'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 ml-14 md:ml-0">
                                <Button
                                    size="lg"
                                    className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 font-bold uppercase tracking-wider text-xs h-12 px-6 shadow-xl dark:shadow-white/10"
                                    onClick={handleGenerateReport}
                                >
                                    Export {role} Report
                                </Button>
                                <Button
                                    size="icon"
                                    className="h-12 w-12 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white border border-slate-200 dark:border-white/5"
                                    onClick={() => setShowMentorCopilot(true)}
                                >
                                    <Mic className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Dynamic Dashboard Content */}
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                            {role === 'CRP' && <CRPDashboard />}
                            {role === 'ARP' && <ARPDashboard />}
                            {role === 'BRP' && <BRPDashboard />}
                        </div>
                    </div>
                </div>
            </div >

            <AnimatePresence>
                {showMentorCopilot && (
                    <MentorCopilot onClose={() => setShowMentorCopilot(false)} />
                )}
            </AnimatePresence>
        </div >
    );
}
