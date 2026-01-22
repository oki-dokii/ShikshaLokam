import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Sparkles, ArrowRight, ShieldCheck, User, Lock, GraduationCap } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (email && password) {
                login({ email, name: email.split('@')[0], role: 'Teacher' });
                toast.success('Welcome back, Teacher!', {
                    description: 'Accessing your Teaching Assistant suite...',
                });
                navigate('/');
            } else {
                toast.error('Invalid credentials', {
                    description: 'Please enter both email and password.',
                });
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
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
                        className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-lg shadow-primary/10"
                    >
                        <Sparkles className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h1 className="text-4xl font-outfit font-black tracking-tight mb-2">The Agency Engine</h1>
                    <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">Teaching Assistant Suite</p>
                </div>

                <div className="glass-card p-8 border border-border/50 relative overflow-hidden bg-white/50 backdrop-blur-xl rounded-[2.5rem]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Email Address</Label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="teacher@shikshalokam.org"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 focus:border-primary/50 transition-all font-outfit"
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
                                    className="pl-12 h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 focus:border-primary/50 transition-all font-outfit"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-xl shadow-primary/20 transition-all group"
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Sign In</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-border/50 text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Secured for Educators Only</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-muted-foreground/60 text-[10px] font-bold uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Pedagogy Support
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
        </div>
    );
};

export default Login;
