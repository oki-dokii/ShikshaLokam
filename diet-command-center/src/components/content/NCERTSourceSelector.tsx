import { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, FileJson, FileText, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { NCERTSource } from '@/types/courseTypes';

interface NCERTSourceSelectorProps {
    onSelect: (source: NCERTSource | null) => void;
    selectedSource: NCERTSource | null;
}

const SOURCES: NCERTSource[] = [
    {
        id: 'science-9-ch1',
        title: 'Science Class 9 - Chapter 1: Matter in Our Surroundings',
        type: 'json',
        subject: 'Science',
        grade: '9',
        path: '/src/data/ncert/science_9.json'
    },
    {
        id: 'science-10-ch1',
        title: 'Science Class 10 - Chapter 1: Chemical Reactions',
        type: 'json',
        subject: 'Science',
        grade: '10',
        path: '/ncert/science_10_ch1.json'
    },
    {
        id: 'math-10-ch1',
        title: 'Math Class 10 - Chapter 1: Real Numbers',
        type: 'json',
        subject: 'Math',
        grade: '10',
        path: '/ncert/math_10_ch1.json'
    },
    {
        id: 'civics-10-ch1',
        title: 'Civics Class 10 - Chapter 1: Power Sharing',
        type: 'json',
        subject: 'Civics',
        grade: '10',
        path: '/ncert/civics_10_ch1.json'
    },
    {
        id: 'history-10-ch1',
        title: 'History Class 10 - Chapter 1: Rise of Nationalism',
        type: 'json',
        subject: 'History',
        grade: '10',
        path: '/ncert/history_10_ch1.json'
    },
    {
        id: 'english-11-hornbill',
        title: 'English Class 11 - Hornbill: The Portrait of a Lady',
        type: 'json',
        subject: 'English',
        grade: '11',
        path: '/src/data/ncert/english_11.json'
    },
    {
        id: 'physics-12-p1',
        title: 'Physics Class 12 - Part 1 (Comprehensive)',
        type: 'pdf',
        subject: 'Physics',
        grade: '12',
        path: '/src/data/ncert/NCERT-Class-12-Physics-Part-1.pdf'
    },
    {
        id: 'physics-12-p2',
        title: 'Physics Class 12 - Part 2 (Comprehensive)',
        type: 'pdf',
        subject: 'Physics',
        grade: '12',
        path: '/src/data/ncert/NCERT-Class-12-Physics-Part-2.pdf'
    }
];

export const NCERTSourceSelector = ({ onSelect, selectedSource }: NCERTSourceSelectorProps) => {
    const [filter, setFilter] = useState<'all' | 'Science' | 'English' | 'Physics'>('all');

    const filteredSources = filter === 'all'
        ? SOURCES
        : SOURCES.filter(s => s.subject === filter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Book className="w-5 h-5 text-brand-cyan" />
                    <h3 className="text-xl font-bold text-white">Select NCERT Source</h3>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['all', 'Science', 'Math', 'Civics', 'History', 'English', 'Physics'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${filter === f
                                ? 'bg-brand-cyan text-brand-dark'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                }`}
                        >
                            {f.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                    {filteredSources.map((source) => {
                        const isSelected = selectedSource?.id === source.id;
                        return (
                            <motion.div
                                key={source.id}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => onSelect(isSelected ? null : source)}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer group flex items-center justify-between ${isSelected
                                    ? 'border-brand-cyan bg-brand-cyan/10'
                                    : 'border-white/5 bg-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${source.type === 'json' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {source.type === 'json' ? <FileJson className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-white group-hover:text-brand-cyan transition-colors">
                                                {source.title}
                                            </h4>
                                            <Badge variant="outline" className="text-[10px] uppercase border-white/10 text-slate-400">
                                                Grade {source.grade}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-400">NCERT Curriculum Aligned Context</p>
                                    </div>
                                </div>
                                {isSelected ? (
                                    <CheckCircle2 className="w-6 h-6 text-brand-cyan" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </ScrollArea>

            {selectedSource && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-brand-cyan/5 border border-brand-cyan/20 rounded-xl flex items-start gap-3"
                >
                    <Info className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-300">
                        AI will use the specific data from <strong>{selectedSource.title}</strong> to generate your modules.
                        This ensures high accuracy and strictly follows the NCERT syllabus.
                    </p>
                </motion.div>
            )}
        </div>
    );
};
