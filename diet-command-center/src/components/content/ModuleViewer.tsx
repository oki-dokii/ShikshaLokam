import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Target, BookOpen, CheckCircle2,
    ChevronRight, Play, Award, Lightbulb,
    Users, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import VisualizationRenderer from './VisualizationRenderer';
import LiveQuizOverlay from './LiveQuizOverlay';
import type { CourseModule, QuizQuestion } from '@/types/courseTypes';

interface ModuleViewerProps {
    module: CourseModule;
    onComplete: () => void;
    onNext: () => void;
    onPrevious: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
    currentIndex: number;
    totalModules: number;
}

const ModuleViewer = ({
    module,
    onComplete,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious,
    currentIndex,
    totalModules
}: ModuleViewerProps) => {
    const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
    const [showResults, setShowResults] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [showLiveQuiz, setShowLiveQuiz] = useState(false);

    const handleQuizAnswer = (questionId: string, answerIndex: number) => {
        setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    };

    const submitQuiz = () => {
        let score = 0;
        module.quiz.forEach(q => {
            if (quizAnswers[q.id] === q.correctIndex) {
                score++;
            }
        });
        setQuizScore(score);
        setShowResults(true);

        // Mark module as complete if score >= 50%
        if (score >= module.quiz.length / 2) {
            onComplete();
        }
    };

    const resetQuiz = () => {
        setQuizAnswers({});
        setShowResults(false);
        setQuizScore(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden"
        >
            {/* Module Header */}
            <div className="bg-gradient-to-r from-brand-cyan/20 to-purple-500/20 p-6 border-b border-white/10">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-brand-cyan text-brand-dark text-xs font-bold rounded-full">
                        MODULE {currentIndex + 1} / {totalModules}
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full">
                        <Clock className="w-3 h-3" />
                        {module.duration}
                    </span>
                    {module.isCompleted && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                        </span>
                    )}
                </div>
                <h2 className="text-2xl font-bold text-white">{module.title}</h2>
            </div>

            {/* Learning Objectives */}
            {module.objectives.length > 0 && (
                <div className="px-6 py-4 bg-slate-800/30 border-b border-white/5">
                    <div className="flex items-center gap-2 text-sm text-purple-400 mb-2">
                        <Target className="w-4 h-4" />
                        <span className="font-medium">Learning Objectives</span>
                    </div>
                    <ul className="space-y-1">
                        {module.objectives.map((obj, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                {obj}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab('content')}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'content'
                        ? 'bg-slate-800 text-white border-b-2 border-brand-cyan'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                >
                    <BookOpen className="w-4 h-4" />
                    Content
                </button>
                <button
                    onClick={() => setActiveTab('quiz')}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'quiz'
                        ? 'bg-slate-800 text-white border-b-2 border-brand-cyan'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                >
                    <Award className="w-4 h-4" />
                    Quiz ({module.quiz.length} Questions)
                </button>
            </div>

            {/* Content Area */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'content' ? (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            {/* Main Content */}
                            <div className="prose prose-invert prose-slate max-w-none">
                                <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                                    {module.content}
                                </div>
                            </div>

                            {/* Key Points */}
                            {module.keyPoints.length > 0 && (
                                <div className="bg-slate-800/50 rounded-xl p-5 border border-cyan-500/20">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                                        <h3 className="font-bold text-yellow-400">Key Takeaways</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {module.keyPoints.map((point, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-slate-300">
                                                <span className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Visualization */}
                            {module.visualization && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-bold text-slate-300 mb-3 flex items-center gap-2">
                                        <Play className="w-5 h-5 text-brand-cyan" />
                                        Visual Summary
                                    </h3>
                                    <VisualizationRenderer
                                        visualization={module.visualization}
                                        className="min-h-[200px]"
                                    />
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {showResults ? (
                                <div className="text-center py-8">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${quizScore >= module.quiz.length / 2
                                        ? 'bg-green-500/20'
                                        : 'bg-orange-500/20'
                                        }`}>
                                        <Award className={`w-10 h-10 ${quizScore >= module.quiz.length / 2
                                            ? 'text-green-400'
                                            : 'text-orange-400'
                                            }`} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {quizScore >= module.quiz.length / 2 ? 'Great Job!' : 'Keep Learning!'}
                                    </h3>
                                    <p className="text-slate-400 mb-4">
                                        You scored {quizScore} out of {module.quiz.length}
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <Button
                                            variant="outline"
                                            onClick={resetQuiz}
                                            className="border-slate-600"
                                        >
                                            Try Again
                                        </Button>
                                        {hasNext && (
                                            <Button
                                                onClick={onNext}
                                                className="bg-brand-cyan text-brand-dark hover:bg-cyan-400"
                                            >
                                                Next Module
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-4">
                                        <div className="p-6 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-brand-cyan/20 flex items-center justify-center">
                                                    <Users className="w-6 h-6 text-brand-cyan" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold">Classroom Mode</h4>
                                                    <p className="text-sm text-slate-400">Launch a live Mentimeter-style quiz for your students.</p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => setShowLiveQuiz(true)}
                                                className="bg-brand-cyan text-brand-dark hover:bg-cyan-400 font-bold"
                                            >
                                                Start Live Quiz
                                                <BarChart3 className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>

                                        <div className="space-y-6">
                                            <h4 className="text-slate-400 text-sm font-bold uppercase tracking-widest pl-2">Individual Practice</h4>
                                            {module.quiz.map((question, qIdx) => (
                                                <QuizQuestionCard
                                                    key={question.id}
                                                    question={question}
                                                    questionNumber={qIdx + 1}
                                                    selectedAnswer={quizAnswers[question.id]}
                                                    onSelectAnswer={(idx) => handleQuizAnswer(question.id, idx)}
                                                />
                                            ))}

                                            <Button
                                                onClick={submitQuiz}
                                                disabled={Object.keys(quizAnswers).length < module.quiz.length}
                                                className="w-full bg-slate-800 text-white hover:bg-slate-700 font-bold h-12 border border-white/10"
                                            >
                                                Submit Practice Quiz
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Live Quiz Overlay */}
            <AnimatePresence>
                {showLiveQuiz && (
                    <LiveQuizOverlay
                        module={module}
                        onClose={() => setShowLiveQuiz(false)}
                    />
                )}
            </AnimatePresence>

            {/* Navigation Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex justify-between">
                <Button
                    variant="outline"
                    onClick={onPrevious}
                    disabled={!hasPrevious}
                    className="border-slate-600 disabled:opacity-30"
                >
                    ← Previous
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!hasNext}
                    className="bg-brand-cyan text-brand-dark hover:bg-cyan-400 disabled:opacity-30"
                >
                    Next →
                </Button>
            </div>
        </motion.div>
    );
};

// Quiz Question Card Component
const QuizQuestionCard = ({
    question,
    questionNumber,
    selectedAnswer,
    onSelectAnswer
}: {
    question: QuizQuestion;
    questionNumber: number;
    selectedAnswer?: number;
    onSelectAnswer: (index: number) => void;
}) => {
    return (
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
            <p className="text-white font-medium mb-4">
                <span className="text-brand-cyan mr-2">Q{questionNumber}.</span>
                {question.question}
            </p>
            <div className="space-y-2">
                {question.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelectAnswer(idx)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${selectedAnswer === idx
                            ? 'border-brand-cyan bg-brand-cyan/10 text-white'
                            : 'border-white/10 bg-slate-900/50 text-slate-300 hover:border-white/30'
                            }`}
                    >
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-xs font-bold ${selectedAnswer === idx
                            ? 'bg-brand-cyan text-brand-dark'
                            : 'bg-slate-700 text-slate-400'
                            }`}>
                            {String.fromCharCode(65 + idx)}
                        </span>
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ModuleViewer;
