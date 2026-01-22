import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Globe, Settings2, X, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import GoogleTranslate from "./GoogleTranslate"

export function GlobalSettings() {
    const { theme, setTheme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="mb-4 space-y-4"
                    >
                        {/* Theme Toggle Widget */}
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-3 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col gap-2 min-w-[200px]">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">
                                <Monitor className="w-3 h-3" /> Appearance
                            </div>
                            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-black/20 p-1 rounded-xl">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${theme === 'light' ? 'bg-white shadow-sm text-amber-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                >
                                    <Sun className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setTheme("system")}
                                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${theme === 'system' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                >
                                    <Monitor className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setTheme("dark")}
                                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-slate-800 shadow-sm text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                >
                                    <Moon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`h-14 w-14 rounded-full shadow-2xl flex items-center justify-center backdrop-blur-md border transition-all ${isOpen
                    ? 'bg-red-500 text-white border-red-400 rotate-90'
                    : 'bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 border-white/10 dark:border-slate-200'
                    }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Settings2 className="w-6 h-6" />}
            </motion.button>
        </div>
    )
}
