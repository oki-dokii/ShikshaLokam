import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Loader2, BookOpen, Lightbulb, Target, HelpCircle, FileText, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    transformManualContent,
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

const ContentTransformer = () => {
    const navigate = useNavigate();

    // Source content state
    const [selectedManual, setSelectedManual] = useState<ManualChunk | null>(null);
    const [customContent, setCustomContent] = useState("");
    const [useCustomContent, setUseCustomContent] = useState(false);

    // Teacher profile state
    const [region, setRegion] = useState("rural-chhattisgarh");
    const [schoolType, setSchoolType] = useState(SCHOOL_TYPES[0]);
    const [languageCode, setLanguageCode] = useState("en"); // Language code for translation
    const [grade, setGrade] = useState(GRADE_LEVELS[1]);
    const [subject, setSubject] = useState(SUBJECTS[6]);
    const [showAllLanguages, setShowAllLanguages] = useState(false); // Toggle for showing all languages

    // Output state
    const [isTransforming, setIsTransforming] = useState(false);
    const [microModule, setMicroModule] = useState<MicroModuleOutput | null>(null);

    const getLocalContext = (): LocalContext => {
        return REGION_CONTEXTS[region] || REGION_CONTEXTS["default"];
    };

    const handleTransform = async () => {
        const sourceContent = useCustomContent ? customContent : selectedManual?.content;
        const sourceTitle = useCustomContent ? "Custom Content" : selectedManual?.title || "";

        if (!sourceContent || sourceContent.trim().length < 50) {
            toast.error("Please select a training manual or enter source content (at least 50 characters).");
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
                languageCode // Pass the language code for translation
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

    const resetForm = () => {
        setMicroModule(null);
        setSelectedManual(null);
        setCustomContent("");
    };

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
                    <p className="text-sm text-slate-400">Convert training manuals into 5-minute micro-modules</p>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">

                {/* LEFT: Input Configuration */}
                <div className="space-y-6">

                    {/* Source Content Selection */}
                    <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-bold mb-4 text-cyan-400 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Source Training Content
                        </h2>

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

                            <div className="col-span-2">
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
                            onClick={handleTransform}
                            disabled={isTransforming || (!selectedManual && !customContent)}
                            className="w-full h-14 text-lg bg-gradient-to-r from-brand-cyan to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400 font-bold relative overflow-hidden disabled:opacity-50"
                        >
                            {isTransforming ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Transforming Content...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-6 h-6" />
                                    Transform to 5-Minute Micro-Module
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default ContentTransformer;
