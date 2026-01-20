import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft, Sparkles, Loader2, BookOpen, Lightbulb, Target,
    HelpCircle, FileText, Globe, Layers, Zap, Upload
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
            <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

                {/* Header */}
                <header className="flex items-center gap-4 p-4 border-b border-white/10 relative z-10 bg-slate-900/80 backdrop-blur">
                    <Button variant="ghost" onClick={resetForm} className="text-slate-400 hover:text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        New Course
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            <Layers className="w-5 h-5 text-brand-cyan" />
                            {generatedCourse.title}
                        </h1>
                        <p className="text-xs text-slate-400">{generatedCourse.description}</p>
                    </div>
                </header>

                {/* Main Content - Course View */}
                <div className="flex h-[calc(100vh-73px)] relative z-10">
                    {/* Left Sidebar - Course Outline */}
                    <div className="w-80 flex-shrink-0 border-r border-white/10 p-4 overflow-hidden">
                        <CourseOutline
                            course={generatedCourse}
                            activeModuleIndex={activeModuleIndex}
                            onSelectModule={setActiveModuleIndex}
                        />
                    </div>

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
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

            {/* Header */}
            <header className="flex items-center gap-4 mb-8 relative z-10">
                <Button variant="ghost" onClick={() => navigate('/')} className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>
                <div>
                    <h1 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-brand-cyan" />
                        Apposite Content Transformer
                    </h1>
                    <p className="text-sm text-slate-400">
                        {mode === 'quick'
                            ? 'Convert training manuals into 5-minute micro-modules'
                            : 'Create Udemy-style courses with AI-generated visualizations'}
                    </p>
                </div>
            </header>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-8 relative z-10">
                <button
                    onClick={() => setMode('course')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${mode === 'course'
                        ? 'bg-gradient-to-r from-brand-cyan to-purple-500 text-white shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                >
                    <Layers className="w-5 h-5" />
                    Course Builder
                    <span className="text-xs px-2 py-0.5 bg-white/20 rounded">NEW</span>
                </button>
                <button
                    onClick={() => setMode('quick')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${mode === 'quick'
                        ? 'bg-gradient-to-r from-brand-cyan to-purple-500 text-white shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                >
                    <Zap className="w-5 h-5" />
                    Quick Transform
                </button>
            </div>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">

                {/* LEFT: Input Configuration */}
                <div className="space-y-6">

                    {/* NCERT Mode Toggle & Selector */}
                    <div className="bg-slate-900/60 border border-brand-cyan/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 p-2 ${isNcertMode ? 'opacity-100' : 'opacity-20'}`}>
                            <BookOpen className="w-12 h-12 text-brand-cyan -rotate-12 translate-x-4 -translate-y-4" />
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-brand-cyan" />
                                    NCERT RAG Mode
                                </h2>
                                <p className="text-xs text-slate-400">Align content strictly with NCERT syllabus</p>
                            </div>
                            <button
                                onClick={() => setIsNcertMode(!isNcertMode)}
                                className={`w-12 h-6 rounded-full transition-all relative ${isNcertMode ? 'bg-brand-cyan' : 'bg-slate-700'
                                    }`}
                            >
                                <motion.div
                                    animate={{ x: isNcertMode ? 26 : 4 }}
                                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
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
                                    <div className="pt-4 border-t border-white/5">
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
                    <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-bold mb-4 text-cyan-400 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            {mode === 'course' ? 'Upload Course Content' : 'Source Training Content'}
                        </h2>

                        {mode === 'course' ? (
                            /* Course Builder - File Upload */
                            <div className="space-y-4">
                                <FileUploader
                                    onContentExtracted={handleFileContentExtracted}
                                    isProcessing={isTransforming}
                                />

                                {/* Or paste content */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-3 bg-slate-900 text-slate-500 text-sm">or paste content</span>
                                    </div>
                                </div>

                                <Textarea
                                    placeholder="Paste your syllabus, course outline, or teaching content here... (minimum 100 characters)"
                                    value={customContent}
                                    onChange={(e) => {
                                        setCustomContent(e.target.value);
                                        setUseCustomContent(true);
                                    }}
                                    className="bg-slate-900 border-white/10 focus:border-brand-cyan text-slate-200 placeholder:text-slate-600 resize-none h-32"
                                />

                                {customContent && (
                                    <p className="text-xs text-slate-500">
                                        {customContent.length} characters • Ready to generate
                                    </p>
                                )}
                            </div>
                        ) : (
                            /* Quick Transform - Sample Manuals */
                            <>
                                {/* Toggle between sample and custom */}
                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={() => setUseCustomContent(false)}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${!useCustomContent
                                            ? 'bg-brand-cyan text-brand-dark'
                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        Sample Manuals
                                    </button>
                                    <button
                                        onClick={() => setUseCustomContent(true)}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${useCustomContent
                                            ? 'bg-brand-cyan text-brand-dark'
                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        Paste Custom Content
                                    </button>
                                </div>

                                {!useCustomContent ? (
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400">Select from sample training manuals:</label>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                            {SAMPLE_MANUALS.map((manual) => (
                                                <div
                                                    key={manual.id}
                                                    onClick={() => setSelectedManual(manual)}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedManual?.id === manual.id
                                                        ? 'border-brand-cyan bg-brand-cyan/10'
                                                        : 'border-white/10 bg-slate-800/50 hover:border-white/30'
                                                        }`}
                                                >
                                                    <h4 className="font-medium text-white text-sm">{manual.title}</h4>
                                                    <p className="text-xs text-slate-500 mt-1">{manual.source}</p>
                                                    <div className="flex gap-1 mt-2">
                                                        {manual.topics.slice(0, 2).map(topic => (
                                                            <span key={topic} className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-400">
                                                                {topic}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {selectedManual && (
                                            <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-white/5">
                                                <p className="text-xs text-slate-400 mb-1">Preview:</p>
                                                <p className="text-sm text-slate-300 line-clamp-3">{selectedManual.content.substring(0, 200)}...</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Textarea
                                        placeholder="Paste your training manual content here... (minimum 50 characters)"
                                        value={customContent}
                                        onChange={(e) => setCustomContent(e.target.value)}
                                        className="bg-slate-900 border-white/10 focus:border-brand-cyan text-slate-200 placeholder:text-slate-600 resize-none h-48"
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* Teacher Profile */}
                    <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-bold mb-4 text-purple-400 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Target Teacher Profile
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-slate-400 block mb-1">Region/Context</label>
                                <select
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-purple-400 outline-none"
                                >
                                    <option value="rural-chhattisgarh">Rural Chhattisgarh</option>
                                    <option value="tribal-bastar">Tribal Bastar</option>
                                    <option value="semi-urban-raipur">Semi-Urban Raipur</option>
                                    <option value="default">General Context</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-slate-400 block mb-1">School Type</label>
                                <select
                                    value={schoolType}
                                    onChange={(e) => setSchoolType(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-purple-400 outline-none"
                                >
                                    {SCHOOL_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="text-sm text-slate-400 block mb-1 flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Output Language ({showAllLanguages ? SUPPORTED_LANGUAGES.length : INDIAN_LANGUAGES.length + 1} options)
                                </label>
                                <select
                                    value={languageCode}
                                    onChange={(e) => setLanguageCode(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-purple-400 outline-none"
                                >
                                    <option value="en">🌐 English (Default - No Translation)</option>
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
                                    className="text-xs text-brand-cyan hover:text-cyan-300 mt-1"
                                >
                                    {showAllLanguages ? '← Show Indian Languages Only' : `Show All ${SUPPORTED_LANGUAGES.length} Languages →`}
                                </button>
                            </div>

                            <div>
                                <label className="text-sm text-slate-400 block mb-1">Grade Level</label>
                                <select
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-purple-400 outline-none"
                                >
                                    {GRADE_LEVELS.map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-slate-400 block mb-1">Subject</label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-purple-400 outline-none"
                                >
                                    {SUBJECTS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Number of Modules (Course Builder Only) */}
                            {mode === 'course' && (
                                <div className="col-span-2">
                                    <label className="text-sm text-slate-400 block mb-1 flex items-center gap-2">
                                        <Layers className="w-4 h-4" />
                                        Number of Modules
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="3"
                                            max="30"
                                            value={numberOfModules}
                                            onChange={(e) => setNumberOfModules(Number(e.target.value))}
                                            className="flex-1 accent-brand-cyan"
                                        />
                                        <span className="text-lg font-bold text-brand-cyan w-8">{numberOfModules}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Estimated duration: ~{numberOfModules * 7} minutes
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Local Context Preview */}
                        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-white/5">
                            <p className="text-xs text-slate-400 mb-2">Local context that will be applied:</p>
                            <div className="flex flex-wrap gap-1">
                                {getLocalContext().localMetaphors.slice(0, 3).map(m => (
                                    <span key={m} className="text-xs px-2 py-0.5 bg-purple-900/30 border border-purple-500/30 rounded text-purple-300">
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
                            className="w-full h-14 text-lg bg-gradient-to-r from-brand-cyan to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400 font-bold relative overflow-hidden disabled:opacity-50"
                        >
                            {isTransforming || ncertLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    {ncertLoading
                                        ? 'Loading NCERT Context...'
                                        : (mode === 'course' ? 'Generating Course Modules...' : 'Transforming Content...')
                                    }
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {mode === 'course' ? (
                                        <>
                                            <Layers className="w-6 h-6" />
                                            Generate {numberOfModules} Micro-Modules
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-6 h-6" />
                                            Transform to 5-Minute Micro-Module
                                        </>
                                    )}
                                </div>
                            )}
                        </Button>
                    )}
                </div>

                {/* RIGHT: Output */}
                <div className="min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {microModule ? (
                            <motion.div
                                key="output"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-brand-cyan/20 to-purple-500/20 p-6 border-b border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 bg-brand-cyan text-brand-dark text-xs rounded font-bold">
                                            5-MIN MICRO-MODULE
                                        </span>
                                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded font-medium">
                                            {region.replace(/-/g, ' ').toUpperCase()}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-white">From: {microModule.sourceTitle}</h2>
                                    <p className="text-sm text-slate-400 mt-1">
                                        Adapted for {grade} • {subject} • {SUPPORTED_LANGUAGES.find(l => l.code === languageCode)?.name || 'English'}
                                    </p>
                                </div>

                                {/* Content Sections */}
                                <div className="p-6 space-y-6">

                                    {/* Core Idea */}
                                    <div className="bg-slate-800/50 rounded-xl p-5 border border-cyan-500/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                                <Lightbulb className="w-4 h-4 text-cyan-400" />
                                            </div>
                                            <h3 className="font-bold text-cyan-400">One Core Idea</h3>
                                        </div>
                                        <p className="text-slate-200 leading-relaxed">{microModule.coreIdea}</p>
                                    </div>

                                    {/* Classroom Example */}
                                    <div className="bg-slate-800/50 rounded-xl p-5 border border-green-500/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <BookOpen className="w-4 h-4 text-green-400" />
                                            </div>
                                            <h3 className="font-bold text-green-400">One Classroom Example</h3>
                                        </div>
                                        <p className="text-slate-200 leading-relaxed">{microModule.classroomExample}</p>
                                    </div>

                                    {/* Action Step */}
                                    <div className="bg-slate-800/50 rounded-xl p-5 border border-orange-500/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                                                <Target className="w-4 h-4 text-orange-400" />
                                            </div>
                                            <h3 className="font-bold text-orange-400">One Action Step</h3>
                                        </div>
                                        <p className="text-slate-200 leading-relaxed">{microModule.actionStep}</p>
                                    </div>

                                    {/* Reflection Question */}
                                    <div className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                <HelpCircle className="w-4 h-4 text-purple-400" />
                                            </div>
                                            <h3 className="font-bold text-purple-400">One Reflection Question</h3>
                                        </div>
                                        <p className="text-slate-200 leading-relaxed italic">{microModule.reflectionQuestion}</p>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-6 border-t border-white/10 flex gap-4">
                                    <Button
                                        onClick={resetForm}
                                        variant="outline"
                                        className="flex-1 border-white/20 text-slate-300 hover:text-white hover:bg-slate-800"
                                    >
                                        Transform Another
                                    </Button>
                                    <Button className="flex-1 bg-brand-cyan text-brand-dark hover:bg-cyan-400 font-bold">
                                        Save to Library
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-12 text-center text-slate-500"
                            >
                                {mode === 'course' ? (
                                    <>
                                        <Layers className="w-16 h-16 mb-4 opacity-20" />
                                        <h3 className="text-xl font-medium mb-2">Course Builder Ready</h3>
                                        <p className="max-w-md">
                                            Upload your syllabus or course content. AI will create
                                            Udemy-style micro-modules with visualizations for each topic.
                                        </p>
                                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                                <span>Structured Modules</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <span>Visual Diagrams</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                                <span>Quiz Questions</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                                <span>Progress Tracking</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-16 h-16 mb-4 opacity-20" />
                                        <h3 className="text-xl font-medium mb-2">Ready to Transform</h3>
                                        <p className="max-w-md">
                                            Select a training manual, configure the teacher profile, and click transform.
                                            The AI will create a practical 5-minute micro-module adapted to the local context.
                                        </p>
                                        <div className="mt-6 flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                                <span>Core Idea</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <span>Example</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                                <span>Action</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                                <span>Reflection</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default ContentTransformer;
