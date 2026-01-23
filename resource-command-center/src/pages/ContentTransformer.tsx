import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft, Sparkles, Loader2, BookOpen, Lightbulb, Target,
    HelpCircle, FileText, Globe, Layers, Upload, GraduationCap,
    LucideIcon, CheckCircle2, Layout, BookMarked, Globe2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    generateCourseModules
} from "@/lib/gemini";
import {
    SAMPLE_MANUALS,
    REGION_CONTEXTS,
    SCHOOL_TYPES,
    GRADE_LEVELS,
    SUBJECTS,
    ManualChunk,
    LocalContext
} from "@/data/trainingManuals";
import { SUPPORTED_LANGUAGES } from "@/lib/translate";
import type { GeneratedCourse } from "@/types/courseTypes";
import FileUploader from "@/components/content/FileUploader";
import CourseOutline from "@/components/content/CourseOutline";
import ModuleViewer from "@/components/content/ModuleViewer";
import { NCERTSourceSelector } from "@/components/content/NCERTSourceSelector";
import type { NCERTSource } from "@/types/courseTypes";
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const ContentTransformer = () => {
    const navigate = useNavigate();

    // Source content state
    const [selectedManual, setSelectedManual] = useState<ManualChunk | null>(null);
    const [customContent, setCustomContent] = useState("");
    const [useCustomContent, setUseCustomContent] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");

    // Teacher profile state
    const [region, setRegion] = useState("rural-chhattisgarh");
    const [schoolType, setSchoolType] = useState(SCHOOL_TYPES[0]);
    const [languageCode, setLanguageCode] = useState("en");
    const [grade, setGrade] = useState(GRADE_LEVELS[1]);
    const [subject, setSubject] = useState(SUBJECTS[6]);
    const [numberOfModules, setNumberOfModules] = useState(4);

    // NCERT RAG state
    const [isNcertMode, setIsNcertMode] = useState(false);
    const [selectedNcertSource, setSelectedNcertSource] = useState<NCERTSource | null>(null);
    const [ncertLoading, setNcertLoading] = useState(false);

    // Output state
    const [isTransforming, setIsTransforming] = useState(false);

    // Course builder state
    const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);
    const [activeModuleIndex, setActiveModuleIndex] = useState(0);

    const getLocalContext = (): LocalContext => {
        return REGION_CONTEXTS[region] || REGION_CONTEXTS["default"];
    };

    const handleFileContentExtracted = (content: string, fileName: string) => {
        setCustomContent(content);
        setUploadedFileName(fileName);
        setUseCustomContent(true);
        toast.success(`Content extracted from ${fileName}`);
    };

    const handleCourseGeneration = async () => {
        let sourceContent = useCustomContent ? customContent : selectedManual?.content;
        const isUsingNcertOnly = isNcertMode && selectedNcertSource && (!sourceContent || sourceContent.trim().length < 50);

        if (!isUsingNcertOnly && (!sourceContent || sourceContent.trim().length < 50)) {
            toast.error("Please provide content OR select an NCERT source.");
            return;
        }

        const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
        const languageName = selectedLang ? selectedLang.name : 'English';

        setIsTransforming(true);
        toast.info(`Generating ${numberOfModules} micro-modules with AI...`);

        try {
            let ncertContext = "";
            if (isNcertMode && selectedNcertSource) {
                ncertContext = await loadNcertContext(selectedNcertSource);
                if (!sourceContent || sourceContent.trim().length < 50) {
                    sourceContent = ncertContext;
                }
            }

            const course = await generateCourseModules({
                content: sourceContent || "",
                title: uploadedFileName || selectedManual?.title || selectedNcertSource?.title,
                subject: subject,
                gradeLevel: grade,
                numberOfModules: numberOfModules,
                language: languageName,
                region: region,
                isNcertMode: isNcertMode,
                ncertContext: ncertContext
            });

            setGeneratedCourse(course);
            setActiveModuleIndex(0);

            try {
                localStorage.setItem('shiksha_saved_course', JSON.stringify(course));
                localStorage.setItem('shiksha_last_saved', new Date().toISOString());
                toast.success(`Course saved for offline access!`);
            } catch (e) {
                console.warn("Quota exceeded", e);
            }

            toast.success(`Course generated with ${course.modules.length} modules!`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate course. Please try again.");
        } finally {
            setIsTransforming(false);
        }
    };

    const handleModuleComplete = () => {
        if (!generatedCourse) return;

        const updatedModules = [...generatedCourse.modules];
        updatedModules[activeModuleIndex] = {
            ...updatedModules[activeModuleIndex],
            isCompleted: true
        };

        setGeneratedCourse({
            ...generatedCourse,
            modules: updatedModules
        });
    };

    const resetForm = () => {
        setGeneratedCourse(null);
        setSelectedManual(null);
        setCustomContent("");
        setUploadedFileName("");
        setActiveModuleIndex(0);
        setIsNcertMode(false);
        setSelectedNcertSource(null);
    };

    const loadNcertContext = async (source: NCERTSource): Promise<string> => {
        setNcertLoading(true);
        try {
            if (source.type === 'json') {
                const pathParts = source.path.split('/');
                const fileName = pathParts[pathParts.length - 1];

                const response = await fetch(`/ncert/${fileName}`);
                const data = await response.json();
                return data
                    .map((item: any) => {
                        const q = item.question && item.question.length > 10 ? `Discussion: ${item.question}\n` : '';
                        return `${q}Insight: ${item.answer}`;
                    })
                    .join('\n\n');
            } else {
                const fileName = source.path.split('/').pop();
                const response = await fetch(`/ncert/${fileName}`);
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();

                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                let fullText = '';
                const pagesToRead = Math.min(pdf.numPages, 10);
                for (let i = 1; i <= pagesToRead; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n\n';
                }
                return fullText;
            }
        } catch (error) {
            console.error('Error loading NCERT context:', error);
            toast.error('Failed to load NCERT source content.');
            return "";
        } finally {
            setNcertLoading(false);
        }
    };

    // Course Builder View
    if (generatedCourse) {
        return (
            <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
                </div>

                <header className="flex items-center gap-6 px-8 py-5 border-b border-border/50 relative z-10 bg-background/60 backdrop-blur-xl">
                    <Button
                        variant="ghost"
                        onClick={resetForm}
                        className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl font-bold transition-all"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        New Course
                    </Button>
                    <div className="w-[2px] h-8 bg-border/50" />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Layers className="w-4 h-4 text-primary" />
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/70">Strategic Resource Course</span>
                        </div>
                        <h1 className="text-xl font-outfit font-extrabold text-foreground tracking-tight">
                            {generatedCourse.title}
                        </h1>
                    </div>

                    <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-muted/50 rounded-2xl border border-border/50">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center">
                                    <GraduationCap className="w-3 h-3 text-primary/50" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Immersion Mode</span>
                    </div>
                </header>

                <div className="flex flex-1 relative z-10 overflow-hidden">
                    <aside className="w-[320px] flex-shrink-0 border-r border-border/50 bg-card overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-border/50 bg-muted/30">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Architecture</h3>
                            <p className="text-sm text-foreground/80 font-medium line-clamp-2">{generatedCourse.description}</p>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                            <CourseOutline
                                course={generatedCourse}
                                activeModuleIndex={activeModuleIndex}
                                onSelectModule={setActiveModuleIndex}
                            />
                        </div>
                    </aside>

                    <div className="flex-1 p-6 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <ModuleViewer
                                key={generatedCourse.modules[activeModuleIndex].id}
                                module={generatedCourse.modules[activeModuleIndex]}
                                onComplete={handleModuleComplete}
                                onNext={() => setActiveModuleIndex(prev => Math.min(prev + 1, generatedCourse.modules.length - 1))}
                                onPrevious={() => setActiveModuleIndex(prev => Math.max(prev - 1, 0))}
                                hasNext={activeModuleIndex < generatedCourse.modules.length - 1}
                                hasPrevious={activeModuleIndex > 0}
                                currentIndex={activeModuleIndex}
                                totalModules={generatedCourse.modules.length}
                            />
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-[0.03] pointer-events-none" />

            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
            </div>

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
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/70">Content Adaptation</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-outfit font-bold text-foreground tracking-tight">
                        Resource Evolution Suite
                    </h1>
                </div>
            </header>

            <div className="flex gap-4 mb-10 relative z-10 max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-100">
                    <Layout className="w-5 h-5" />
                    Course Builder
                    <span className="text-[10px] px-2 py-0.5 rounded-full ml-2 bg-white/20">PREMIUM</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-end">
                <button
                    onClick={() => {
                        const saved = localStorage.getItem('shiksha_saved_course');
                        if (saved) {
                            setGeneratedCourse(JSON.parse(saved));
                            toast.success("Loaded offline course!");
                        } else {
                            toast.error("No saved course found.");
                        }
                    }}
                    className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
                >
                    <BookOpen className="w-4 h-4" />
                    Load Last Saved (Offline Mode)
                </button>
            </div>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">

                <div className="lg:col-span-5 space-y-8 px-6 lg:px-0">
                    <div className="glass-card p-8 border-border relative overflow-hidden bg-card">
                        <div className="absolute top-0 right-0 p-4 opacity-100">
                            <BookOpen className="w-16 h-16 text-primary -rotate-12" />
                        </div>

                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <BookMarked className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-outfit font-bold text-foreground">NCERT RAG Mode</h2>
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Strict Syllabus Alignment</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsNcertMode(!isNcertMode)}
                                className={`w-14 h-7 rounded-full transition-all relative shadow-inner ${isNcertMode ? 'bg-primary' : 'bg-muted-foreground/20'}`}
                            >
                                <motion.div
                                    animate={{ x: isNcertMode ? 30 : 4 }}
                                    className="absolute top-1 left-0 w-5 h-5 bg-white rounded-full shadow-md"
                                />
                            </button>
                        </div>

                        <AnimatePresence>
                            {isNcertMode && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-6 border-t border-primary/10 mt-2">
                                        <NCERTSourceSelector
                                            selectedSource={selectedNcertSource}
                                            onSelect={(source) => {
                                                setSelectedNcertSource(source);
                                                if (source) {
                                                    setSubject(source.subject);
                                                    setGrade(`Grade ${source.grade}`);
                                                }
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="glass-card p-8 border-border bg-card">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-outfit font-bold text-foreground">Upload Course Content</h2>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Source Material</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <FileUploader
                                onContentExtracted={handleFileContentExtracted}
                                isProcessing={isTransforming}
                            />

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border/50"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-4 bg-card text-muted-foreground text-[10px] font-black uppercase tracking-widest">or paste content</span>
                                </div>
                            </div>

                            <textarea
                                placeholder="Paste your syllabus, course outline, or teaching content here... (minimum 100 characters)"
                                value={customContent}
                                onChange={(e) => {
                                    setCustomContent(e.target.value);
                                    setUseCustomContent(true);
                                }}
                                className="w-full h-40 bg-background/40 border-2 border-border/50 rounded-2xl p-5 text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none shadow-inner text-sm leading-relaxed"
                            />
                        </div>
                    </div>

                    <div className="glass-card p-8 border-border bg-card">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Layers className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-outfit font-bold text-foreground">Course Structure</h2>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Module Configuration</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Number of Modules</label>
                                <span className="text-lg font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">{numberOfModules}</span>
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="30"
                                value={numberOfModules}
                                onChange={(e) => setNumberOfModules(Number(e.target.value))}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <p className="text-[10px] text-muted-foreground font-medium mt-3 uppercase tracking-widest">
                                Estimated duration: ~{numberOfModules * 7} minutes immersion
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handleCourseGeneration}
                        disabled={isTransforming || ncertLoading || (!selectedManual && !customContent.trim() && !selectedNcertSource)}
                        className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] gap-4"
                    >
                        {isTransforming || ncertLoading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>
                                    {ncertLoading
                                        ? 'Loading NCERT Context...'
                                        : `Generating ${numberOfModules} Modules...`
                                    }
                                </span>
                            </>
                        ) : (
                            <>
                                <Layers className="w-6 h-6" />
                                <span>Build Resource Course</span>
                            </>
                        )}
                    </Button>
                </div>

                <div className="lg:col-span-7 min-h-[600px] px-6 lg:px-0 relative">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-primary/5 rounded-[2.5rem] p-12 text-center"
                    >
                        <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-8">
                            <Sparkles className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-2xl font-outfit font-bold text-foreground mb-4">
                            Resource Strategy Ready
                        </h3>
                        <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
                            Fill in your content parameters to generate a deep-immersion pedagogical resource course.
                        </p>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                            <div className="p-4 bg-muted/10 rounded-2xl border border-border/30">
                                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Efficiency</p>
                                <p className="text-lg font-black text-foreground">Course</p>
                            </div>
                            <div className="p-4 bg-muted/10 rounded-2xl border border-border/30">
                                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Adaptation</p>
                                <p className="text-lg font-black text-foreground">Local</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ContentTransformer;
