import { motion } from "framer-motion";
import { User } from "lucide-react";

export const Testimonials = () => {
    const testimonials = [
        {
            quote: "The 'Just-in-Time' advice helped me manage a disruptive class immediately. I didn't have to wait for the monthly training session.",
            author: "Priya Sharma",
            role: "Govt. School Teacher, Ranchi",
            color: "bg-orange-100 text-orange-600"
        },
        {
            quote: "I used the Frugal Lab ideas to teach air pressure using just a plastic bottle. The students were amazed!",
            author: "Rahul Verma",
            role: "Science Teacher, Bokaro",
            color: "bg-blue-100 text-blue-600"
        },
        {
            quote: "Documentation used to take hours. Now, the Reflection Copilot does it in minutes, and I actually learn from it.",
            author: "Anjali Das",
            role: "Primary Teacher, Gumla",
            color: "bg-green-100 text-green-600"
        }
    ];

    return (
        <section className="py-24 px-4 bg-background relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-tr-full" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-black text-foreground mb-4"
                    >
                        Voices from the <span className="text-primary">Classroom</span>
                    </motion.h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        See how teachers across the state are transforming their daily practice.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-card p-8 rounded-3xl shadow-sm border border-border hover:shadow-md transition-shadow"
                        >
                            <div className="mb-6">
                                <div className="text-6xl text-primary/20 font-serif leading-none">"</div>
                                <p className="text-muted-foreground font-medium leading-relaxed -mt-6 relative z-10">
                                    {t.quote}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 pt-6 border-t border-border">
                                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center`}>
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-foreground text-sm">{t.author}</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
