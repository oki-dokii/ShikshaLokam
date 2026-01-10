import React from 'react';
import { Monitor } from 'lucide-react';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-brand-dark text-white relative overflow-hidden font-rajdhani selection:bg-brand-cyan/30">

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid-overlay bg-[size:40px_40px] opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-dark/50 to-brand-dark" />
            </div>

            {/* Header */}
            <header className="relative z-50 border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-cyan/10 rounded-lg border border-brand-cyan/20">
                            <Monitor className="w-6 h-6 text-brand-cyan" />
                        </div>
                        <div>
                            <h1 className="font-orbitron font-bold text-xl tracking-wider text-white">
                                DIET <span className="text-brand-cyan">CONTROL ROOM</span>
                            </h1>
                            <p className="text-[10px] text-slate-400 tracking-[0.2em] uppercase">Government Education Command Center</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>SYSTEM ONLINE</span>
                        </div>
                        <div>
                            v2.0.4-alpha
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
};
