import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, BookOpen, Clock, ExternalLink, Filter, X } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { trainingModules, categoryIcons, categoryColors } from '../data/modulesData';
import type { TrainingModule } from '../data/modulesData';

type Category = TrainingModule['category'] | 'All';

export const ModulesPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') as Category || 'All';

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
    const [showFilters, setShowFilters] = useState(false);

    const categories: Category[] = ['All', 'Cyber Safety', 'Assessment', 'Policy', 'Pedagogy', 'Resources', 'Physical Education', 'Regional'];

    const filteredModules = trainingModules.filter(module => {
        const matchesSearch =
            module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            module.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModule = (module: TrainingModule) => {
        // Navigate to AI-powered module detail page
        navigate(`/modules/${module.id}`);
    };

    return (
        <MainLayout>
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-xl font-orbitron font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-brand-cyan" />
                        TRAINING <span className="text-brand-cyan">MODULES</span>
                    </h2>
                    <p className="text-sm text-slate-500">{filteredModules.length} modules available</p>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search modules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan/50"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${showFilters ? 'bg-brand-cyan/10 border-brand-cyan/50 text-brand-cyan' : 'bg-slate-900/50 border-white/10 text-slate-300 hover:bg-white/5'
                        }`}
                >
                    <Filter className="w-4 h-4" />
                    Filters
                    {selectedCategory !== 'All' && (
                        <span className="px-2 py-0.5 text-xs bg-brand-cyan/20 rounded-full">{selectedCategory}</span>
                    )}
                </button>
            </div>

            {/* Category Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-6"
                    >
                        <div className="flex flex-wrap gap-2 p-4 glass-panel rounded-xl">
                            {categories.map((category) => {
                                const isActive = selectedCategory === category;
                                const style = category !== 'All' ? categoryColors[category] : null;

                                return (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? style ? `${style.bg} ${style.text} ${style.glow}` : 'bg-white/10 text-white'
                                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredModules.map((module, index) => {
                        const style = categoryColors[module.category];
                        const Icon = categoryIcons[module.category];

                        return (
                            <motion.div
                                key={module.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.03 }}
                                className={`glass-panel rounded-xl p-5 hover:border-white/20 transition-all cursor-pointer group ${style.glow}`}
                                onClick={() => handleOpenModule(module)}
                            >
                                {/* Category Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md ${style.bg} ${style.text} text-xs font-semibold`}>
                                        <Icon className="w-3 h-3" />
                                        {module.category}
                                    </div>
                                    {module.language === 'Kannada' && (
                                        <span className="px-2 py-0.5 text-[10px] bg-pink-500/20 text-pink-400 rounded">ಕನ್ನಡ</span>
                                    )}
                                </div>

                                {/* Title & Description */}
                                <h3 className="font-orbitron font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors line-clamp-2">
                                    {module.title}
                                </h3>
                                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                    {module.description}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                        <Clock className="w-3 h-3" />
                                        {module.duration}
                                    </div>
                                    <button className={`p-1.5 rounded-md ${style.bg} ${style.text} group-hover:bg-opacity-30 transition-colors`}>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredModules.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-lg font-orbitron text-white mb-2">No modules found</h3>
                    <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
                </div>
            )}
        </MainLayout>
    );
};
