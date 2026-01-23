import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Sparkles, ArrowRight, ShieldCheck, User, Lock, GraduationCap, LayoutDashboard, ArrowLeft, UserPlus } from 'lucide-react';

type UserRole = 'Teacher' | 'ARP/BRP';

import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole) return;

        setIsLoading(true);

        // Artificial delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            if (isSignUp) {
                const success = await register({ email, password, name: email.split('@')[0], role: selectedRole });
                if (success) {
                    toast.success('Account created successfully!', {
                        description: `Welcome to the ShikshaAssistant family, ${email.split('@')[0]}!`
                    });
                    navigate(selectedRole === 'ARP/BRP' ? '/rp-dashboard' : '/');
                } else {
                    toast.error('Registration failed', {
                        description: 'An account with this email already exists.'
                    });
                }
            } else {
                const success = await login(email, password);
                if (success) {
                    toast.success(`Welcome back!`, {
                        description: `Accessing your ${selectedRole === 'ARP/BRP' ? 'Command Center' : 'Teaching Assistant suite'}...`
                    });
                    navigate(selectedRole === 'ARP/BRP' ? '/rp-dashboard' : '/');
                } else {
                    toast.error('Log in failed', {
                        description: 'Invalid email or password. Please try again or sign up.'
                    });
                }
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Role Selection Screen
    if (!selectedRole) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
                {/* Top Right Actions */}
                <div className="absolute top-6 right-6 z-50">
                    <LanguageSwitcher />
                </div>

                {/* Background Orbs */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg"
                >
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12 }}
                            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-lg shadow-primary/10"
                        >
                            <Sparkles className="w-8 h-8 text-primary" />
                        </motion.div>
                        <h1 className="text-4xl font-outfit font-black tracking-tight mb-2">Welcome</h1>
                        <p className="text-muted-foreground font-medium">How would you like to sign in?</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Teacher Option */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedRole('Teacher')}
                            className="glass-card p-8 border border-border/50 rounded-3xl hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all text-left group"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <GraduationCap className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">I'm a Teacher</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Access classroom tools, AI support, and professional development resources.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm">
                                <span>Continue</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.button>

                        {/* ARP/BRP Option */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedRole('ARP/BRP')}
                            className="glass-card p-8 border border-border/50 rounded-3xl hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all text-left group"
                        >
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                                <LayoutDashboard className="w-7 h-7 text-indigo-500" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">I'm an ARP/BRP</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Access the Resource Command Center, analytics, and teacher oversight tools.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-indigo-500 font-bold text-sm">
                                <span>Continue</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Login Form Screen
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Top Right Actions */}
            <div className="absolute top-6 right-6 z-50">
                <LanguageSwitcher />
            </div>

            {/* Background Orbs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12 }}
                        className={`w-16 h-16 ${selectedRole === 'ARP/BRP' ? 'bg-indigo-500/10' : 'bg-primary/10'} rounded-2xl flex items-center justify-center mx-auto mb-6 border ${selectedRole === 'ARP/BRP' ? 'border-indigo-500/20' : 'border-primary/20'} shadow-lg ${selectedRole === 'ARP/BRP' ? 'shadow-indigo-500/10' : 'shadow-primary/10'}`}
                    >
                        {isSignUp ? (
                            <UserPlus className={`w-8 h-8 ${selectedRole === 'ARP/BRP' ? 'text-indigo-500' : 'text-primary'}`} />
                        ) : selectedRole === 'ARP/BRP' ? (
                            <LayoutDashboard className="w-8 h-8 text-indigo-500" />
                        ) : (
                            <GraduationCap className="w-8 h-8 text-primary" />
                        )}
                    </motion.div>
                    <h1 className="text-4xl font-outfit font-black tracking-tight mb-2">
                        {isSignUp ? 'Create Account' : (selectedRole === 'ARP/BRP' ? 'Resource Person' : 'Teacher') + ' Sign In'}
                    </h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">
                        {selectedRole === 'ARP/BRP' ? 'Command Center Access' : 'Teaching Assistant Suite'}
                    </p>
                </div>

                <div className="glass-card p-8 border border-border/50 relative overflow-hidden rounded-[2.5rem]">
                    {/* Back Button */}
                    <button
                        onClick={() => setSelectedRole(null)}
                        className="absolute top-4 left-4 flex items-center gap-1 text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back
                    </button>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Email Address</Label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="email"
                                    placeholder={selectedRole === 'ARP/BRP' ? "arp@shikshalokam.org" : "teacher@shikshalokam.org"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 h-14 rounded-2xl border-border/50 bg-background focus:ring-primary/20 focus:border-primary/50 transition-all font-outfit"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 h-14 rounded-2xl border-border/50 bg-background focus:ring-primary/20 focus:border-primary/50 transition-all font-outfit"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full h-14 rounded-2xl ${selectedRole === 'ARP/BRP' ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-primary hover:bg-primary/90'} text-white font-bold text-base shadow-xl ${selectedRole === 'ARP/BRP' ? 'shadow-indigo-500/20' : 'shadow-primary/20'} transition-all group`}
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border/50 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border/50 text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Secured for Educators Only</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-muted-foreground/60 text-[10px] font-bold uppercase tracking-wider">
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedRole === 'ARP/BRP' ? 'bg-indigo-500' : 'bg-primary'}`} />
                        {selectedRole === 'ARP/BRP' ? 'Analytics' : 'Pedagogy Support'}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground/60 text-[10px] font-bold uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        AI Insights
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground/60 text-[10px] font-bold uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Evidence Based
                    </div>
                </div>
            </motion.div>
        </div >
    );
};

export default Login;
