import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Recycle, MessageSquare, BookOpen, Activity, LineChart, Flame, FileText, MessageCircle, Send, Sparkles } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { CTAButton } from "@/components/CTAButton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";



import { AIVoiceAssistant } from "@/components/AIVoiceAssistant";
import { KnowledgeProvider } from "@/context/KnowledgeContext";
import { TeacherTimetable } from "@/components/dashboard/TeacherTimetable";
import { useAuth } from "@/context/AuthContext";



const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const handleGenerate = () => {
    if (isAuthenticated) {
      navigate("/agency-engine");
    } else {
      navigate("/login");
    }
  };



  return (
    <KnowledgeProvider>
      <div className="min-h-screen bg-background overflow-hidden relative">
        <header className="fixed top-0 left-0 right-0 z-[60] bg-white/70 backdrop-blur-xl border-b border-border/50 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-outfit font-black tracking-tight">Shiksha<span className="text-primary">Assistant</span></span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Logged in as</span>
                  <span className="text-sm font-bold text-foreground">{user?.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={logout} className="rounded-xl border-border/50 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all font-bold">
                  Logout
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => navigate('/login')} className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20">
                Sign In
              </Button>
            )}
          </div>
        </header>
        <AIVoiceAssistant />
        {/* Hero Section */}
        <HeroSection />

        {/* Sunita's Story - The Support Gap Section */}
        <section className="relative py-24 px-4 bg-muted/20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
                  The Implementation Gap: <br /><span className="text-primary italic">A Teacher's Reality</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed font-inter">
                  <p>
                    Meet {isAuthenticated ? user?.name : 'Sunita'}, a teacher {isAuthenticated ? 'like you' : 'in a rural school in Jharkhand'}. {isAuthenticated ? 'You try' : 'She tries'} a new group activity, but the class falls into chaos. {isAuthenticated ? 'You need' : 'She needs'} a strategy <strong>now</strong>—not in three weeks when a mentor visits.
                  </p>
                  <p>
                    Without "just-in-time" support, the "spark" of innovation dies, replaced by rote instruction and professional burnout.
                  </p>
                  <p className="font-semibold text-foreground italic">
                    Training happens in workshops; implementation happens in the classroom. We bridge that gap.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-2xl blur-2xl animate-pulse" />
                <div className="relative glass-card p-8 border border-primary/10">
                  <h3 className="text-xl font-bold mb-4 text-primary">The Existing Gap</h3>
                  <ul className="space-y-4 text-sm">
                    <li className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-destructive flex-shrink-0">!</div>
                      <span><strong>Lag Time:</strong> Support arrives weeks after the need has passed.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-destructive flex-shrink-0">!</div>
                      <span><strong>Generic Feedback:</strong> "Teach properly" lacks actionable granular detail.</span>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-destructive flex-shrink-0">!</div>
                      <span><span><strong>Isolation:</strong> No peer to "knock on the door" of in remote areas.</span></span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Just-in-Time Coaching Highlights */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Immediate Advice",
                  desc: "Ask any question—from management to pedagogy—and get instant, helpful suggestions.",
                  icon: <MessageSquare className="w-6 h-6 text-primary" />,
                  bg: "bg-primary/5"
                },
                {
                  title: "Small-Dose Learning",
                  desc: "Quick training modules matched perfectly to the challenge you're facing right now.",
                  icon: <BookOpen className="w-6 h-6 text-secondary" />,
                  bg: "bg-secondary/5"
                },
                {
                  title: "Flexible Feedback",
                  desc: "Share quick updates and get advice within hours, not weeks.",
                  icon: <Activity className="w-6 h-6 text-accent" />,
                  bg: "bg-accent/5"
                }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-8 rounded-2xl border border-border/50 ${feature.bg} card-hover`}
                >
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-sm mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Teacher Timetable Section */}
        <section className="relative py-12 px-4 bg-muted/20">
          <TeacherTimetable />
        </section>

        {/* Solutions Section */}
        <section className="relative py-24 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                Your Professional <span className="text-primary">Teaching Assistant</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Evidence-based tools to help you manage your classroom and master your craft.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Resource Evolution Suite Card */}
              <div className="glass-card p-8 card-hover flex flex-col items-start border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-foreground">Resource Evolution Suite</h3>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded uppercase font-bold tracking-wider">AI Content</span>
                </div>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  Turn NCERT books or training manuals into interactive micro-modules with AI visualizations.
                </p>
                <Button
                  onClick={() => navigate('/content-transformer')}
                  className="w-full mt-auto rounded-xl shadow-lg shadow-primary/20"
                >
                  Transform Now
                </Button>
              </div>

              {/* Simulation Arena Card */}
              <div className="glass-card p-8 card-hover flex flex-col items-start border-secondary/20">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Simulation Arena</h3>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  Practice handling chaotic classroom scenarios or difficult parent conversations with AI role-play.
                </p>
                <Button
                  onClick={() => navigate('/simulation')}
                  variant="secondary"
                  className="w-full mt-auto rounded-xl shadow-lg shadow-secondary/20"
                >
                  Enter Arena
                </Button>
              </div>

              {/* AI Assessment Card */}
              <div className="glass-card p-8 card-hover flex flex-col items-start border-accent/20">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">AI Assessment Copilot</h3>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  Analyze formative assessment data and generate personalized learning paths for every student.
                </p>
                <Button
                  onClick={() => navigate('/assessment-ai')}
                  variant="outline"
                  className="w-full mt-auto rounded-xl"
                >
                  Analyze Learning
                </Button>
              </div>

              {/* Telegram Bot Card */}
              <div className="glass-card p-8 card-hover flex flex-col items-start border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Send className="w-7 h-7 text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-foreground">24/7 Teacher Bot</h3>
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-[10px] rounded uppercase font-bold tracking-wider animate-pulse">Live Now</span>
                </div>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  Get instant classroom solutions on your phone via Telegram. Your 24/7 partner for "Just-in-Time" teaching breakthroughs.
                </p>
                <Button
                  onClick={() => window.open('https://t.me/diet_teacher_support_bot', '_blank')}
                  className="w-full mt-auto rounded-xl shadow-lg shadow-primary/20 gap-2"
                >
                  <Send className="w-4 h-4" />
                  Open on Telegram
                </Button>
              </div>

              {/* Real-Time Feedback Card */}
              <div className="glass-card p-8 card-hover flex flex-col items-start">
                <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Live Pulse Advisor</h3>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  Facing a challenge right now? Describe the situation and get evidence-based interventions instantly.
                </p>
                <Button
                  onClick={() => navigate('/real-time-feedback')}
                  variant="destructive"
                  className="w-full mt-auto rounded-xl shadow-lg shadow-destructive/20"
                >
                  Get Urgent Help
                </Button>
              </div>

              {/* Frugal Science Lab Card */}
              <div className="glass-card p-8 card-hover flex flex-col items-start border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Recycle className="w-7 h-7 text-emerald-500" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-foreground">Frugal Science Lab</h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded uppercase font-bold tracking-wider">Resourceful</span>
                </div>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  No lab equipment? No problem. Turn household objects into powerful teaching learning materials.
                </p>
                <Button
                  onClick={() => navigate('/frugal-tlm')}
                  variant="outline"
                  className="w-full mt-auto rounded-xl border-emerald-200 hover:bg-emerald-50 text-emerald-600"
                >
                  Scan for Ideas
                </Button>
              </div>

              {/* Implementation Copilot Card */}
              <div className="glass-card p-8 card-hover flex flex-col items-start">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <MessageCircle className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Reflection Copilot</h3>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  Reflect on your teaching day and build a personalized portfolio of your professional growth.
                </p>
                <Button
                  onClick={() => navigate('/implementation-copilot')}
                  variant="outline"
                  className="w-full mt-auto rounded-xl"
                >
                  Start Reflection
                </Button>
              </div>

              {/* Session Reflection / Engagement Tracker Card */}
              <div className="glass-card p-8 card-hover flex flex-col items-start border-brand-cyan/20">
                <div className="w-14 h-14 bg-brand-cyan/10 rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="w-7 h-7 text-brand-cyan" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-foreground">Daily Session Reflection</h3>
                  <span className="px-2 py-0.5 bg-brand-cyan/10 text-brand-cyan text-[10px] rounded uppercase font-bold tracking-wider">Most Used</span>
                </div>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  Describe how your day went and get AI-powered suggestions to improve student engagement and classroom dynamics.
                </p>
                <Button
                  onClick={() => navigate('/engagement-analysis')}
                  variant="outline"
                  className="w-full mt-auto rounded-xl border-brand-cyan/30 hover:bg-brand-cyan/5 text-brand-cyan"
                >
                  Reflect on Today
                </Button>
              </div>

              {/* Agency Engine Card */}
              <div className="glass-card p-8 card-hover flex flex-col items-start border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-transparent">
                <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Flame className="w-7 h-7 text-pink-500" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-foreground">Agency Engine</h3>
                  <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-[10px] rounded uppercase font-bold tracking-wider">Demand Driven</span>
                </div>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  Collect authentic teacher needs through interactive swipe-based pedagogical challenges.
                </p>
                <Button
                  onClick={() => navigate('/agency-engine')}
                  className="w-full mt-auto rounded-xl bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-500/20"
                >
                  Open Engine
                </Button>
              </div>

              {/* Training Demand Predictor Card */}
              <div className="glass-card p-8 card-hover flex flex-col items-start border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <LineChart className="w-7 h-7 text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-foreground">Training Demand Predictor</h3>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded uppercase font-bold tracking-wider">Predictive AI</span>
                </div>
                <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                  Forecast and prevent training gaps with predictive classroom analytics and risk profiling.
                </p>
                <Button
                  onClick={() => navigate('/predictive-training')}
                  variant="outline"
                  className="w-full mt-auto rounded-xl border-primary/20 hover:bg-primary/5 text-primary"
                >
                  Forecast Needs
                </Button>
              </div>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="relative py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-right" />
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight"
            >
              Start Your Coaching Journey
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground mb-10 text-xl leading-relaxed"
            >
              Join a community of 48,000+ teachers transforming their classrooms with ShikshaLokam.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGenerate} className="px-10 py-7 text-lg rounded-2xl">
                Try Teacher Assistant
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-border bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-8">
              <span className="text-2xl font-bold">Shiksha<span className="text-primary">Lokam</span></span>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 font-inter">
              Empowering teachers as skilled professionals with "Just-in-Time" support. We believe that every teacher deserves a professional assistant.
            </p>
            <div className="border-t border-border pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground/70">
                © 2026 ShikshaLokam • Professional Teacher Development
              </p>
              <div className="flex gap-6 text-sm text-muted-foreground/70 font-medium">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </KnowledgeProvider>
  );
};

export default Index;
