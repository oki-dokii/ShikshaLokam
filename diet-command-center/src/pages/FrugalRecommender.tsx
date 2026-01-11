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
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

            {/* Header */}
            <header className="flex items-center gap-4 mb-8 relative z-10">
                <Button variant="ghost" onClick={() => navigate('/heatmap')} className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                        <Recycle className="w-6 h-6 text-brand-cyan" />
                        Frugal TLM Recommender
                    </h1>
                    <p className="text-sm text-slate-400">Turn trash into teaching treasures</p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">

                {/* Left: Upload Section */}
                <div className="space-y-6">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            border-2 border-dashed rounded-2xl h-[300px] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden
                            ${imagePreview ? 'border-brand-cyan/50 bg-slate-900' : 'border-white/10 hover:border-brand-cyan/50 hover:bg-white/5'}
                        `}
                    >
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Upload" className="w-full h-full object-cover rounded-xl opacity-50" />
                                {isAnalyzing && (
                                    <div className="absolute inset-0 bg-brand-cyan/10 animate-pulse flex items-center justify-center">
                                        <div className="scan-line absolute w-full h-1 bg-brand-cyan shadow-[0_0_15px_rgba(6,182,212,0.8)] top-0 animate-scan" />
                                        <div className="text-brand-cyan font-orbitron font-bold tracking-widest animate-pulse">ANALYZING RESOURCES...</div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-cyan">
                                    <Camera className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Upload Classroom Photo</h3>
                                <p className="text-slate-400">Drag & drop or Click to identify available materials</p>
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

                    <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                            Or Describe Available Materials (Optional)
                        </label>
                        <textarea
                            placeholder="e.g., 'Bamboo sticks, Clay, Old Newspapers, Plastic Cups'"
                            className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-slate-200 focus:border-brand-cyan focus:outline-none resize-none h-24 placeholder:text-slate-600"
                            onChange={(e) => setResourceText(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handleAnalyze}
                        disabled={(!imagePreview && !resourceText) || isAnalyzing}
                        className="w-full h-14 text-lg bg-brand-cyan text-brand-dark hover:bg-cyan-400 font-bold"
                    >
                        {isAnalyzing ? "Scanning..." : "Identify Experiments"}
                    </Button>
                </div>

                {/* Right: Results Section */}
                <div className="space-y-6">
                    {/* Detected Resources */}
                    {results && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-900/50 border border-white/10 rounded-2xl p-6"
                        >
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-brand-cyan" /> Detected Resources
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {results.detectedResources.map((item: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-cyan-200">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Activities */}
                    {results && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-yellow-400" /> Suggested Activities
                            </h3>
                            {results.activities.map((activity: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-slate-900 border border-white/10 rounded-xl p-5 hover:border-brand-cyan/30 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white text-lg">{activity.title}</h4>
                                        <span className="px-2 py-0.5 bg-brand-cyan/20 text-brand-cyan text-xs rounded font-bold uppercase">
                                            {activity.subject}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {activity.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!results && !isAnalyzing && (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 border border-white/5 rounded-2xl bg-white/[0.02]">
                            <FlaskConical className="w-12 h-12 mb-4 opacity-50" />
                            <p>Upload an image to get frugal science ideas.</p>
                        </div>
                    )}
                </div>

            </main >
        </div >
    );
};

export default FrugalRecommender;
