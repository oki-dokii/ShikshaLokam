import React, { useEffect } from 'react';

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: any;
    }
}

const GoogleTranslate = () => {
    useEffect(() => {
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                },
                'google_translate_element'
            );
        };

        const existingScript = document.getElementById('google-translate-script');
        if (!existingScript) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div className="hidden">
            <div id="google_translate_element"></div>
            <style>{`
                .goog-te-banner-frame.skiptranslate {
                    display: none !important;
                }
                body {
                    top: 0px !important;
                }
                .goog-logo-link {
                    display: none !important;
                }
                .goog-te-gadget {
                    color: transparent !important;
                }
            `}</style>
        </div>
    );
};

export default GoogleTranslate;
