import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft, Sparkles, Loader2, BookOpen, Lightbulb, Target,
    HelpCircle, FileText, Globe, Layers, Zap, Upload, GraduationCap,
    LucideIcon, CheckCircle2, Layout, BookMarked, Globe2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    transformManualContent,
    generateCourseModules,
    MicroModuleOutput
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
import { SUPPORTED_LANGUAGES, INDIAN_LANGUAGES } from "@/lib/translate";
import type { GeneratedCourse, CourseModule } from "@/types/courseTypes";
import FileUploader from "@/components/content/FileUploader";
import CourseOutline from "@/components/content/CourseOutline";
import ModuleViewer from "@/components/content/ModuleViewer";
import { NCERTSourceSelector } from "@/components/content/NCERTSourceSelector";
import type { NCERTSource } from "@/types/courseTypes";
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

type TransformMode = 'quick' | 'course';

const ContentTransformer = () => {
    const navigate = useNavigate();

    // Transform mode
    const [mode, setMode] = useState<TransformMode>('course');

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
    const [showAllLanguages, setShowAllLanguages] = useState(false);
    const [numberOfModules, setNumberOfModules] = useState(6);

    // NCERT RAG state
    const [isNcertMode, setIsNcertMode] = useState(false);
    const [selectedNcertSource, setSelectedNcertSource] = useState<NCERTSource | null>(null);
    const [ncertLoading, setNcertLoading] = useState(false);

    // Output state
    const [isTransforming, setIsTransforming] = useState(false);
    const [microModule, setMicroModule] = useState<MicroModuleOutput | null>(null);

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

    const handleQuickTransform = async () => {
        let sourceContent = useCustomContent ? customContent : selectedManual?.content;
        const sourceTitle = useCustomContent ? (uploadedFileName || "Custom Content") : selectedManual?.title || "";

        if (isNcertMode && selectedNcertSource) {
            // In NCERT mode, we use the RAG context as the primary source if no other content is provided
            // or we combine them. For Quick Transform, let's assume it uses NCERT context.
            const ncertContext = await loadNcertContext(selectedNcertSource);
            if (ncertContext) {
                sourceContent = ncertContext;
            }
        }

        if (!sourceContent || sourceContent.trim().length < 50) {
            toast.error("Please select a training manual, NCERT source, or enter custom content.");
            return;
        }

        const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
        const languageName = selectedLang ? selectedLang.name : 'English';

        setIsTransforming(true);

        if (languageCode !== 'en') {
            toast.info(`Generating in English, then translating to ${languageName}...`);
        }

        try {
            const result = await transformManualContent(
                sourceContent,
                sourceTitle,
                {
                    region: region,
                    teacherCluster: region.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    schoolType: schoolType,
                    language: languageName,
                    grade: grade,
                    subject: subject
                },
                getLocalContext(),
                languageCode
            );

            setMicroModule(result);
            toast.success(`Micro-module generated in ${languageName}!`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to transform content. Please try again.");
        } finally {
            setIsTransforming(false);
        }
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
                // If we have no primary content, use NCERT context as the primary content too
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

            // SAVE FOR OFFLINE USE
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
        setMicroModule(null);
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
                // For JSON, we fetch it (it's in src/data/ncert/ but we need to treat it as a module or fetch)
                // Since it was converted to JSON, we can import it or fetch it if moved to public
                // For now, let's assume it's fetched from the public path if we moved it, 
                // but actually, I'll use a dynamic import for simplicity if it's in src
                const pathParts = source.path.split('/');
                const fileName = pathParts[pathParts.length - 1];

                const response = await fetch(`/ncert/${fileName}`);
                const data = await response.json();
                // Filter out fragments and join meaningful answers
                return data
                    .map((item: any) => {
                        const q = item.question && item.question.length > 10 ? `Discussion: ${item.question}\n` : '';
                        return `${q}Insight: ${item.answer}`;
                    })
                    .join('\n\n');
            } else {
                // For PDF, fetch from public path and extract text
                const fileName = source.path.split('/').pop();
                const response = await fetch(`/ncert/${fileName}`);
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();

                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                let fullText = '';
                // Limit to first 10 pages for demo performance/context limits
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
                {/* Background Decorative Blurs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
                </div>

                {/* Header */}
                <header className="flex items-center gap-6 px-8 py-5 border-b border-border/50 relative z-10 bg-white/60 backdrop-blur-xl">
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

                {/* Main Content - Course View */}
                <div className="flex flex-1 relative z-10 overflow-hidden">
                    {/* Left Sidebar - Course Outline */}
                    <aside className="w-[320px] flex-shrink-0 border-r border-border/50 bg-white/40 backdrop-blur-md overflow-hidden flex flex-col">
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

                    {/* Main Content - Module Viewer */}
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
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/70">Content Adaptation</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-outfit font-bold text-foreground tracking-tight">
                        Resource Evolution Suite
                    </h1>
                </div>
            </header>

            {/* Mode Toggle */}
            <div className="flex gap-4 mb-10 relative z-10 max-w-7xl mx-auto px-6">
                <button
                    onClick={() => setMode('course')}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-sm border ${mode === 'course'
                        ? 'bg-primary text-white border-primary shadow-primary/20 scale-100'
                        : 'bg-white border-border text-muted-foreground hover:border-primary/30 hover:text-foreground scale-[0.98]'
                        }`}
                >
                    <Layout className="w-5 h-5" />
                    Course Builder
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ml-2 ${mode === 'course' ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>PREMIUM</span>
                </button>
                <button
                    onClick={() => setMode('quick')}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-sm border ${mode === 'quick'
                        ? 'bg-primary text-white border-primary shadow-primary/20 scale-100'
                        : 'bg-white border-border text-muted-foreground hover:border-primary/30 hover:text-foreground scale-[0.98]'
                        }`}
                >
                    <Zap className="w-5 h-5" />
                    Quick Transform
                </button>
            </div>

            {/* Offline Access Helper */}
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

                {/* LEFT: Input Configuration */}
                <div className="lg:col-span-5 space-y-8 px-6 lg:px-0">

                    {/* NCERT Mode Toggle & Selector */}
                    <div className="clean-card p-8 border-border/80 relative overflow-hidden bg-white">
                        <div className={`absolute top-0 right-0 p-4 ${isNcertMode ? 'opacity-100' : 'opacity-[0.05]'}`}>
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

                    {/* Source Content Selection */}
                    <div className="clean-card p-8 border-border/80 bg-white">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-outfit font-bold text-foreground">
                                    {mode === 'course' ? 'Upload Course Content' : 'Training Content'}
                                </h2>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Source Material</p>
                            </div>
                        </div>

                        {mode === 'course' ? (
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
                                    className="w-full h-40 bg-white/40 border-2 border-border/50 rounded-2xl p-5 text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none shadow-inner text-sm leading-relaxed"
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex p-1 bg-muted rounded-2xl mb-8">
                                    <button
                                        onClick={() => setUseCustomContent(false)}
                                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${!useCustomContent
                                            ? 'bg-white text-primary shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        Sample Manuals
                                    </button>
                                    <button
                                        onClick={() => setUseCustomContent(true)}
                                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${useCustomContent
                                            ? 'bg-white text-primary shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        Custom Paste
                                    </button>
                                </div>

                                {!useCustomContent ? (
                                    <div className="space-y-3">
                                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                            {SAMPLE_MANUALS.map((manual) => (
                                                <div
                                                    key={manual.id}
                                                    onClick={() => setSelectedManual(manual)}
                                                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${selectedManual?.id === manual.id
                                                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                                                        : 'border-border/50 bg-white/40 hover:border-primary/30 hover:bg-white/60'
                                                        }`}
                                                >
                                                    <div className="relative z-10">
                                                        <h4 className="font-bold text-foreground text-[15px]">{manual.title}</h4>
                                                        <p className="text-[11px] text-muted-foreground mt-1 font-medium">{manual.source}</p>
                                                        <div className="flex gap-2 mt-4">
                                                            {manual.topics.slice(0, 3).map(topic => (
                                                                <span key={topic} className="text-[10px] px-2.5 py-1 bg-muted rounded-full text-muted-foreground font-bold uppercase tracking-wider">
                                                                    {topic}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <CheckCircle2 className={`absolute top-4 right-4 w-5 h-5 text-primary transition-all ${selectedManual?.id === manual.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <textarea
                                        placeholder="Paste your training manual content here... (minimum 50 characters)"
                                        value={customContent}
                                        onChange={(e) => setCustomContent(e.target.value)}
                                        className="w-full h-60 bg-white/40 border-2 border-border/50 rounded-2xl p-5 text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none shadow-inner text-sm leading-relaxed"
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* Teacher Profile */}
                    <div className="clean-card p-8 border-border/80 bg-white">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-outfit font-bold text-foreground">Target Profile</h2>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Personalization Context</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Region/Context</label>
                                <select
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="w-full bg-muted/30 border border-border/80 rounded-xl p-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none cursor-pointer text-sm shadow-sm"
                                >
                                    <option value="rural-chhattisgarh">Rural Chhattisgarh</option>
                                    <option value="tribal-bastar">Tribal Bastar</option>
                                    <option value="semi-urban-raipur">Semi-Urban Raipur</option>
                                    <option value="default">General Context</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">School Type</label>
                                <select
                                    value={schoolType}
                                    onChange={(e) => setSchoolType(e.target.value)}
                                    className="w-full bg-muted/30 border border-border/80 rounded-xl p-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none cursor-pointer text-sm shadow-sm"
                                >
                                    {SCHOOL_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2 space-y-3">
                                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                    <Globe2 className="w-3 h-3 text-primary" />
                                    Output Language
                                </label>
                                <select
                                    value={languageCode}
                                    onChange={(e) => setLanguageCode(e.target.value)}
                                    className="w-full bg-white border-2 border-primary/40 rounded-2xl p-4 text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold appearance-none cursor-pointer shadow-sm"
                                >
                                    <option value="en">🌐 English (No Translation)</option>
                                    <optgroup label="━━ Indian Languages ━━">
                                        {INDIAN_LANGUAGES.map(lang => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.nativeName} - {lang.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                    {showAllLanguages && (
                                        <optgroup label="━━ Other Languages ━━">
                                            {SUPPORTED_LANGUAGES.filter(l =>
                                                l.code !== 'en' && !INDIAN_LANGUAGES.some(il => il.code === l.code)
                                            ).map(lang => (
                                                <option key={lang.code} value={lang.code}>
                                                    {lang.nativeName} - {lang.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowAllLanguages(!showAllLanguages)}
                                    className="text-xs font-bold text-primary hover:text-primary-dark transition-colors px-2"
                                >
                                    {showAllLanguages ? '← Use Indian Languages Only' : `🌐 Show All ${SUPPORTED_LANGUAGES.length} Languages →`}
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Grade Level</label>
                                <select
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className="w-full bg-muted/30 border border-border/80 rounded-xl p-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none cursor-pointer text-sm shadow-sm"
                                >
                                    {GRADE_LEVELS.map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Subject</label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full bg-muted/30 border border-border/80 rounded-xl p-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none cursor-pointer text-sm shadow-sm"
                                >
                                    {SUBJECTS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            {mode === 'course' && (
                                <div className="col-span-2 pt-4">
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
                            )}
                        </div>

                        {/* Local Context Preview */}
                        <div className="mt-8 p-5 bg-muted/30 rounded-2xl border border-border/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Sparkles className="w-10 h-10 text-primary" />
                            </div>
                            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground mb-3">AI Context Injection</p>
                            <div className="flex flex-wrap gap-2">
                                {getLocalContext().localMetaphors.slice(0, 4).map(m => (
                                    <span key={m} className="text-[11px] px-3 py-1.5 bg-white border border-primary/10 rounded-full text-foreground/70 font-bold shadow-sm">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Transform Button */}
                    {!microModule && (
                        <Button
                            onClick={mode === 'course' ? handleCourseGeneration : handleQuickTransform}
                            disabled={isTransforming || ncertLoading || (!selectedManual && !customContent.trim() && !selectedNcertSource)}
                            className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] gap-4"
                        >
                            {isTransforming || ncertLoading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>
                                        {ncertLoading
                                            ? 'Loading NCERT Context...'
                                            : (mode === 'course' ? `Generating ${numberOfModules} Modules...` : 'Transforming Content...')
                                        }
                                    </span>
                                </>
                            ) : (
                                <>
                                    {mode === 'course' ? (
                                        <>
                                            <Layers className="w-6 h-6" />
                                            <span>Build Resource Course</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-6 h-6" />
                                            <span>Transform to Micro-Module</span>
                                        </>
                                    )}
                                </>
                            )}
                        </Button>
                    )}
                </div>

                {/* RIGHT: Output */}
                <div className="lg:col-span-7 min-h-[600px] px-6 lg:px-0 relative">
                    <AnimatePresence mode="wait">
                        {microModule ? (
                            <motion.div
                                key="output"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="clean-card overflow-hidden shadow-2xl border-border bg-white"
                            >
                                {/* Header */}
                                <div className="bg-primary p-8 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Sparkles className="w-24 h-24" />
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                                            Immersion Module
                                        </span>
                                        <span className="px-3 py-1 bg-secondary/30 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                                            5 MINUTE READ
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-outfit font-bold leading-tight">
                                        {microModule.sourceTitle}
                                    </h2>
                                    <div className="flex items-center gap-4 mt-6 text-sm font-medium text-white/80">
                                        <div className="flex items-center gap-1.5">
                                            <Globe2 className="w-4 h-4" />
                                            {SUPPORTED_LANGUAGES.find(l => l.code === languageCode)?.name || 'English'}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <GraduationCap className="w-4 h-4" />
                                            {grade}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Grid */}
                                <div className="p-8 space-y-6">
                                    {[
                                        { title: "Core Concept", content: microModule.coreIdea, color: "text-primary", icon: Lightbulb, bg: "bg-primary/5", border: "border-primary/10" },
                                        { title: "Interactive Example", content: microModule.classroomExample, color: "text-emerald-600", icon: Layout, bg: "bg-emerald-500/5", border: "border-emerald-500/10" },
                                        { title: "Practical Action", content: microModule.actionStep, color: "text-amber-600", icon: Target, bg: "bg-amber-500/5", border: "border-amber-500/10" },
                                        { title: "Personal Reflection", content: microModule.reflectionQuestion, color: "text-secondary", icon: HelpCircle, bg: "bg-secondary/5", border: "border-secondary/10", italic: true }
                                    ].map((section, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className={`p-6 rounded-2xl border ${section.border} ${section.bg} group hover:shadow-md transition-all`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-8 h-8 rounded-lg ${section.bg} border ${section.border} flex items-center justify-center ${section.color}`}>
                                                    <section.icon className="w-4 h-4" />
                                                </div>
                                                <h3 className={`font-black text-[10px] uppercase tracking-widest ${section.color}`}>
                                                    {section.title}
                                                </h3>
                                            </div>
                                            <p className={`text-foreground/80 leading-relaxed text-sm ${section.italic ? 'italic font-medium' : ''}`}>
                                                {section.content}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="p-8 pt-0 flex gap-4">
                                    <Button
                                        onClick={resetForm}
                                        variant="outline"
                                        className="flex-1 h-14 rounded-2xl border-primary/20 hover:bg-primary/5 text-primary font-bold"
                                    >
                                        Adapt Another
                                    </Button>
                                    <Button className="flex-1 h-14 rounded-2xl shadow-lg shadow-primary/20 font-bold gap-2">
                                        <Upload className="w-4 h-4" />
                                        Save to Library
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-primary/5 rounded-[2.5rem] p-12 text-center"
                            >
                                <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-8">
                                    <Sparkles className="w-12 h-12 text-muted-foreground/30" />
                                </div>
                                <h3 className="text-2xl font-outfit font-bold text-foreground mb-4">
                                    {mode === 'course' ? 'Resource Strategy Ready' : 'Evolution Unit Pending'}
                                </h3>
                                <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
                                    {mode === 'course'
                                        ? "Fill in your content parameters to generate a deep-immersion pedagogical resource course."
                                        : "Select your source material and target profile to evolve it into a localized micro-resource."}
                                </p>
                                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                                    <div className="p-4 bg-muted/10 rounded-2xl border border-border/30">
                                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Efficiency</p>
                                        <p className="text-lg font-black text-foreground">5 Min</p>
                                    </div>
                                    <div className="p-4 bg-muted/10 rounded-2xl border border-border/30">
                                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Adaptation</p>
                                        <p className="text-lg font-black text-foreground">Local</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div >
    );
};

export default ContentTransformer;
