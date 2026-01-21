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
        <div className="min-h-screen bg-background p-8">
            {/* Header */}
            <header className="flex items-center gap-4 mb-8 max-w-5xl mx-auto">
                <Button variant="ghost" onClick={() => navigate('/heatmap')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Recycle className="w-6 h-6 text-secondary" />
                        Frugal TLM Recommender
                    </h1>
                    <p className="text-sm text-muted-foreground">Turn trash into teaching treasures</p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left: Upload Section */}
                <div className="space-y-6">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            border-2 border-dashed rounded-xl h-[300px] flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden
                            ${imagePreview ? 'border-primary/50 bg-card' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                        `}
                    >
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Upload" className="w-full h-full object-cover rounded-xl opacity-50" />
                                {isAnalyzing && (
                                    <div className="absolute inset-0 bg-primary/10 animate-pulse flex items-center justify-center">
                                        <div className="text-primary font-semibold tracking-wide animate-pulse">Analyzing resources...</div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                    <Camera className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">Upload Classroom Photo</h3>
                                <p className="text-muted-foreground">Drag & drop or Click to identify available materials</p>
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
                        <label className="text-sm font-medium text-foreground mb-2 block">
                            Or Describe Available Materials (Optional)
                        </label>
                        <textarea
                            placeholder="e.g., 'Bamboo sticks, Clay, Old Newspapers, Plastic Cups'"
                            className="w-full bg-background border border-border rounded-xl p-4 text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none h-24 placeholder:text-muted-foreground"
                            onChange={(e) => setResourceText(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handleAnalyze}
                        disabled={(!imagePreview && !resourceText) || isAnalyzing}
                        className="w-full h-14 text-base"
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
                            className="bg-card border border-border rounded-xl p-6 shadow-sm"
                        >
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" /> Detected Resources
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {results.detectedResources.map((item: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Activities */}
                    {results && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4 text-accent" /> Suggested Activities
                            </h3>
                            {results.activities.map((activity: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors shadow-sm"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-foreground text-lg">{activity.title}</h4>
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-semibold uppercase">
                                            {activity.subject}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {activity.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!results && !isAnalyzing && (
                        <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground border border-border rounded-xl bg-muted/20">
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
