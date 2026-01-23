import React, { useEffect, useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LANGUAGES = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'kn', label: 'Kannada', native: 'ay' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export function LanguageSwitcher() {
    const [currentLang, setCurrentLang] = useState('en');

    useEffect(() => {
        // Parse the googtrans cookie to set the initial state
        // Cookie format: "googtrans=/en/hi" or similar
        const cookies = document.cookie.split(';');
        const googtransCookie = cookies.find(c => c.trim().startsWith('googtrans='));

        if (googtransCookie) {
            const val = googtransCookie.split('=')[1]; // "/en/hi"
            const parts = val.split('/');
            if (parts.length === 3) {
                setCurrentLang(parts[2]);
            }
        }
    }, []);

    const changeLanguage = (langCode: string) => {
        // 1. Set the cookie that Google Translate looks for
        // Format: /sourceLang/targetLang
        document.cookie = `googtrans=/en/${langCode}; path=/`;

        // 2. Reload the page - Google Translate script will pick up the cookie and translate
        window.location.reload();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-sm hover:scale-105 transition-all">
                    <Globe className="h-[1.2rem] w-[1.2rem] text-slate-700 dark:text-slate-200" />
                    <span className="sr-only">Switch Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200 dark:border-white/10 shadow-2xl">
                {LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        className="flex items-center justify-between cursor-pointer focus:bg-slate-100 dark:focus:bg-white/10"
                        onClick={() => changeLanguage(lang.code)}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{lang.label}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{lang.native}</span>
                        </div>
                        {currentLang === lang.code && <Check className="h-4 w-4 text-brand-blue" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
