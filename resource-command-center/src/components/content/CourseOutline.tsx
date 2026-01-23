import { motion } from 'framer-motion';
import {
    CheckCircle2, Circle, PlayCircle, Clock,
    BookOpen, Award, ChevronDown, ChevronRight
} from 'lucide-react';
import type { CourseModule, GeneratedCourse } from '@/types/courseTypes';

interface CourseOutlineProps {
    course: GeneratedCourse;
    activeModuleIndex: number;
    onSelectModule: (index: number) => void;
}

const CourseOutline = ({ course, activeModuleIndex, onSelectModule }: CourseOutlineProps) => {
    const completedCount = course.modules.filter(m => m.isCompleted).length;
    const progressPercent = (completedCount / course.totalModules) * 100;

    return (
        <div className="bg-slate-900/80 rounded-2xl border border-white/10 overflow-hidden h-full flex flex-col">
            {/* Course Header */}
            <div className="p-5 border-b border-white/10 bg-gradient-to-r from-brand-cyan/10 to-purple-500/10">
                <h2 className="text-lg font-bold text-white mb-1 line-clamp-2">{course.title}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course.totalModules} Modules
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.totalDuration}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-brand-cyan font-medium">{completedCount}/{course.totalModules}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-brand-cyan to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            </div>

            {/* Module List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {course.modules.map((module, index) => (
                    <ModuleListItem
                        key={module.id}
                        module={module}
                        index={index}
                        isActive={index === activeModuleIndex}
                        onClick={() => onSelectModule(index)}
                    />
                ))}
            </div>

            {/* Course Stats Footer */}
            <div className="p-4 border-t border-white/10 bg-slate-800/30">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span>Complete all to earn certificate</span>
                    </div>
                    {completedCount === course.totalModules && (
                        <span className="text-green-400 text-xs font-medium">🎉 Completed!</span>
                    )}
                </div>
            </div>
        </div>
    );
};

// Individual Module List Item
const ModuleListItem = ({
    module,
    index,
    isActive,
    onClick
}: {
    module: CourseModule;
    index: number;
    isActive: boolean;
    onClick: () => void;
}) => {
    const getStatusIcon = () => {
        if (module.isCompleted) {
            return <CheckCircle2 className="w-5 h-5 text-green-400" />;
        }
        if (isActive) {
            return <PlayCircle className="w-5 h-5 text-brand-cyan" />;
        }
        return <Circle className="w-5 h-5 text-slate-600" />;
    };

    return (
        <motion.button
            onClick={onClick}
            className={`w-full text-left p-3 rounded-xl transition-all group ${isActive
                    ? 'bg-brand-cyan/10 border border-brand-cyan/30'
                    : 'hover:bg-slate-800/50 border border-transparent'
                }`}
            whileHover={{ x: isActive ? 0 : 4 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className="mt-0.5 flex-shrink-0">
                    {getStatusIcon()}
                </div>

                {/* Module Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${isActive ? 'text-brand-cyan' : 'text-slate-500'
                            }`}>
                            {String(index + 1).padStart(2, '0')}
                        </span>
                        {isActive && (
                            <span className="text-xs px-1.5 py-0.5 bg-brand-cyan text-brand-dark rounded font-medium">
                                NOW
                            </span>
                        )}
                    </div>
                    <h4 className={`text-sm font-medium mt-0.5 line-clamp-2 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}>
                        {module.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{module.duration}</span>
                        <span className="text-slate-600">•</span>
                        <span>{module.quiz.length} questions</span>
                    </div>
                </div>

                {/* Chevron */}
                <div className="flex-shrink-0 mt-2">
                    {isActive ? (
                        <ChevronDown className="w-4 h-4 text-brand-cyan" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                    )}
                </div>
            </div>

            {/* Objectives Preview (only for active) */}
            {isActive && module.objectives.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-white/10"
                >
                    <p className="text-xs text-slate-500 mb-1">You'll learn:</p>
                    <ul className="space-y-1">
                        {module.objectives.slice(0, 2).map((obj, idx) => (
                            <li key={idx} className="text-xs text-slate-400 flex items-start gap-1">
                                <span className="text-brand-cyan">•</span>
                                <span className="line-clamp-1">{obj}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </motion.button>
    );
};

export default CourseOutline;
