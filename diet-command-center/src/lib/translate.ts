// Translation utility using MyMemory Free Translation API
// No API key required - supports 100+ languages

export interface Language {
    code: string;
    name: string;
    nativeName: string;
}

// Comprehensive list of languages supported by MyMemory API
// Focused on Indian languages + major world languages
export const SUPPORTED_LANGUAGES: Language[] = [
    // English (Default - no translation needed)
    { code: "en", name: "English", nativeName: "English" },

    // Indian Languages
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
    { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
    { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
    { code: "ur", name: "Urdu", nativeName: "اردو" },
    { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्" },
    { code: "ne", name: "Nepali", nativeName: "नेपाली" },
    { code: "si", name: "Sinhala", nativeName: "සිංහල" },

    // Major World Languages
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "pt", name: "Portuguese", nativeName: "Português" },
    { code: "ru", name: "Russian", nativeName: "Русский" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "ko", name: "Korean", nativeName: "한국어" },
    { code: "zh", name: "Chinese (Simplified)", nativeName: "中文" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
    { code: "th", name: "Thai", nativeName: "ไทย" },
    { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
    { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
    { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
    { code: "tl", name: "Filipino", nativeName: "Filipino" },
    { code: "tr", name: "Turkish", nativeName: "Türkçe" },
    { code: "pl", name: "Polish", nativeName: "Polski" },
    { code: "uk", name: "Ukrainian", nativeName: "Українська" },
    { code: "nl", name: "Dutch", nativeName: "Nederlands" },
    { code: "it", name: "Italian", nativeName: "Italiano" },
    { code: "el", name: "Greek", nativeName: "Ελληνικά" },
    { code: "he", name: "Hebrew", nativeName: "עברית" },
    { code: "sv", name: "Swedish", nativeName: "Svenska" },
    { code: "da", name: "Danish", nativeName: "Dansk" },
    { code: "no", name: "Norwegian", nativeName: "Norsk" },
    { code: "fi", name: "Finnish", nativeName: "Suomi" },
    { code: "cs", name: "Czech", nativeName: "Čeština" },
    { code: "hu", name: "Hungarian", nativeName: "Magyar" },
    { code: "ro", name: "Romanian", nativeName: "Română" },
    { code: "bg", name: "Bulgarian", nativeName: "Български" },
    { code: "sr", name: "Serbian", nativeName: "Српски" },
    { code: "hr", name: "Croatian", nativeName: "Hrvatski" },
    { code: "sk", name: "Slovak", nativeName: "Slovenčina" },
    { code: "sl", name: "Slovenian", nativeName: "Slovenščina" },
    { code: "et", name: "Estonian", nativeName: "Eesti" },
    { code: "lv", name: "Latvian", nativeName: "Latviešu" },
    { code: "lt", name: "Lithuanian", nativeName: "Lietuvių" },
    { code: "fa", name: "Persian", nativeName: "فارسی" },
    { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
    { code: "af", name: "Afrikaans", nativeName: "Afrikaans" },
    { code: "zu", name: "Zulu", nativeName: "isiZulu" },
    { code: "am", name: "Amharic", nativeName: "አማርኛ" },
    { code: "my", name: "Myanmar (Burmese)", nativeName: "မြန်မာ" },
    { code: "km", name: "Khmer", nativeName: "ភាសាខ្មែរ" },
    { code: "lo", name: "Lao", nativeName: "ລາວ" },
];

// Get Indian languages only (for quick access)
export const INDIAN_LANGUAGES = SUPPORTED_LANGUAGES.filter(lang =>
    ['hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 'ur', 'sa', 'ne'].includes(lang.code)
);

/**
 * Translate text using MyMemory Free Translation API
 * @param text - Text to translate
 * @param targetLang - Target language code (e.g., 'hi' for Hindi)
 * @param sourceLang - Source language code (default: 'en' for English)
 * @returns Translated text
 */
export async function translateText(
    text: string,
    targetLang: string,
    sourceLang: string = 'en'
): Promise<string> {
    // If target is English or same as source, return original
    if (targetLang === 'en' || targetLang === sourceLang) {
        return text;
    }

    try {
        const encodedText = encodeURIComponent(text);
        const langPair = `${sourceLang}|${targetLang}`;

        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`
        );

        if (!response.ok) {
            console.error('Translation API error:', response.status);
            return text; // Return original on error
        }

        const data = await response.json();

        if (data.responseStatus === 200 && data.responseData?.translatedText) {
            // MyMemory sometimes returns HTML entities, decode them
            const translated = data.responseData.translatedText
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');
            return translated;
        } else {
            console.warn('Translation failed:', data);
            return text;
        }
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original on error
    }
}

/**
 * Translate multiple texts in batch (with rate limiting)
 * @param texts - Array of texts to translate
 * @param targetLang - Target language code
 * @param sourceLang - Source language code
 * @returns Array of translated texts
 */
export async function translateBatch(
    texts: string[],
    targetLang: string,
    sourceLang: string = 'en'
): Promise<string[]> {
    if (targetLang === 'en' || targetLang === sourceLang) {
        return texts;
    }

    const results: string[] = [];

    for (const text of texts) {
        // Add a small delay between requests to avoid rate limiting
        if (results.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        const translated = await translateText(text, targetLang, sourceLang);
        results.push(translated);
    }

    return results;
}

/**
 * Get language by code
 */
export function getLanguageByCode(code: string): Language | undefined {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

/**
 * Get language code from language name (for backward compatibility)
 */
export function getLanguageCode(languageName: string): string {
    const lang = SUPPORTED_LANGUAGES.find(
        l => l.name.toLowerCase() === languageName.toLowerCase() ||
            l.nativeName === languageName
    );
    return lang?.code || 'en';
}
