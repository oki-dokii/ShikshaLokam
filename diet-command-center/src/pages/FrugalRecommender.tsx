import { useState, useRef } from "react";
import { Upload, Camera, Sparkles, ArrowLeft, Lightbulb, Recycle, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { recommendTLM } from "@/lib/gemini";
import { motion } from "framer-motion";
import { toast } from "sonner";

const FrugalRecommender = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [resourceText, setResourceText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<any | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setResults(null); // Reset results on new image
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!imagePreview && !resourceText) return;
        setIsAnalyzing(true);

        try {
            const data = await recommendTLM(imagePreview, resourceText);
            setResults(data);
            toast.success("Resources Identified!");
        } catch (error) {
            toast.error("Analysis failed. Try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-[0.03] pointer-events-none" />

            {/* Background Decorative Blurs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 px-6 py-8 flex items-center gap-6 max-w-7xl mx-auto">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/')}
                    className="rounded-full hover:bg-primary/10 text-muted-foreground transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Recycle className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/70">Resource Innovation</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-outfit font-bold text-foreground tracking-tight">
                        Frugal Science Lab
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">

                {/* Left: Upload Section */}
                <div className="lg:col-span-5 space-y-8 px-6 lg:px-0">
                    <div className="clean-card p-8 border-border/80 relative overflow-hidden bg-white">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <FlaskConical className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-outfit font-bold text-foreground">Available Materials</h2>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Visual Scan</p>
                            </div>
                        </div>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                border-2 border-dashed rounded-2xl h-[280px] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden mb-6 group
                                ${imagePreview ? 'border-primary shadow-lg shadow-primary/5 bg-muted/20' : 'border-border/80 hover:border-primary/50 hover:bg-primary/5 bg-muted/10'}
                            `}
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Upload" className="w-full h-full object-cover rounded-xl" />
                                    {isAnalyzing && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                                <div className="w-full h-[2px] bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] top-0 absolute animate-[scan_2s_ease-in-out_infinite]" />
                                            </div>
                                            <div className="bg-white/90 px-4 py-2 rounded-full border border-primary/20 shadow-xl">
                                                <div className="text-primary text-[10px] font-black tracking-widest animate-pulse flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                                                    IDENTIFYING RESOURCES...
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {!isAnalyzing && (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold text-foreground flex items-center gap-2">
                                                <Camera className="w-4 h-4" /> Change Photo
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary group-hover:scale-110 transition-transform">
                                        <Camera className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-outfit font-bold text-foreground mb-2">Upload Photo</h3>
                                    <p className="text-muted-foreground text-sm max-w-[200px] mx-auto leading-relaxed">
                                        Drag & drop or Click to identify teaching materials in your environment
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">
                                Or Describe Materials (Optional)
                            </label>
                            <textarea
                                placeholder="e.g., 'Bamboo sticks, Clay, Old Newspapers...'"
                                className="w-full bg-muted/30 border border-border/80 rounded-2xl p-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all resize-none h-28 placeholder:text-muted-foreground/60 text-sm font-medium"
                                value={resourceText}
                                onChange={(e) => setResourceText(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={handleAnalyze}
                            disabled={(!imagePreview && !resourceText) || isAnalyzing}
                            className="w-full h-16 mt-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] gap-3"
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Scanning Environments...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6" />
                                    <span>Identify Experiments</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Right: Results Section */}
                <div className="lg:col-span-7 px-6 lg:px-0 space-y-6">
                    {/* Detected Resources */}
                    {results && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="clean-card p-6 border-primary/20 bg-white"
                        >
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-primary" /> Visual Recognition Cache
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {results.detectedResources.map((item: string, idx: number) => (
                                    <span key={idx} className="px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full text-sm font-bold text-primary flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Activities */}
                    {results ? (
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2 ml-1">
                                <Lightbulb className="w-3 h-3 text-amber-500" /> Suggested Pedagogical Activities
                            </h3>
                            {results.activities.map((activity: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="clean-card p-6 border-border/80 bg-white hover:border-primary/30 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-outfit font-bold text-foreground text-xl leading-tight group-hover:text-primary transition-colors">
                                            {activity.title}
                                        </h4>
                                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full border border-primary/10 uppercase tracking-widest">
                                            {activity.subject}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-base leading-relaxed font-medium">
                                        {activity.description}
                                    </p>
                                    <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm cursor-pointer hover:underline">
                                        View Implementation Guide <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        !isAnalyzing && (
                            <div className="h-[500px] flex flex-col items-center justify-center text-center border-2 border-dashed border-primary/20 bg-primary/5 rounded-[2.5rem] p-12">
                                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                                    <FlaskConical className="w-12 h-12 text-primary/40" />
                                </div>
                                <h3 className="text-2xl font-outfit font-bold text-foreground mb-4">Innovation Lab Status</h3>
                                <p className="text-muted-foreground max-w-sm leading-relaxed">
                                    Upload a photo of your classroom or surroundings to transform everyday objects into powerful science experiments.
                                </p>
                            </div>
                        )
                    )}

                    {isAnalyzing && !results && (
                        <div className="h-[500px] flex flex-col items-center justify-center text-center border-2 border-dashed border-primary/20 bg-primary/5 rounded-[2.5rem] p-12 overflow-hidden relative">
                            <div className="w-40 h-40 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
                            <h3 className="text-2xl font-outfit font-bold text-primary animate-pulse">Running Vision Scan...</h3>
                            <p className="text-muted-foreground max-w-sm mt-4">
                                Analyzing local flora, discarded materials, and common objects for pedagogical potential.
                            </p>
                        </div>
                    )}
                </div>

            </main >
        </div >
    );
};

export default FrugalRecommender;
