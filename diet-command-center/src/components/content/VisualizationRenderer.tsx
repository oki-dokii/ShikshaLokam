import { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';
import { Loader2, AlertCircle, RefreshCw, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ModuleVisualization } from '@/types/courseTypes';

interface VisualizationRendererProps {
    visualization: ModuleVisualization;
    className?: string;
}

// Initialize mermaid once with config
let mermaidInitialized = false;

const initMermaid = () => {
    if (mermaidInitialized) return;

    mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        themeVariables: {
            primaryColor: '#06b6d4',
            primaryTextColor: '#f8fafc',
            primaryBorderColor: '#0891b2',
            lineColor: '#64748b',
            secondaryColor: '#8b5cf6',
            tertiaryColor: '#1e293b',
            background: '#0f172a',
            mainBkg: '#1e293b',
        }
    });
    mermaidInitialized = true;
};

const VisualizationRenderer = ({ visualization, className = '' }: VisualizationRendererProps) => {
    const uniqueId = useId().replace(/:/g, '');
    const [svgContent, setSvgContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        initMermaid();
        renderDiagram();
    }, [visualization.mermaidCode]);

    const cleanMermaidCode = (code: string): string => {
        if (!code) return '';

        return code
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/`/g, '')
            .replace(/^\s*```mermaid\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();
    };

    const getFallbackDiagram = (): string => {
        const desc = (visualization.description || 'Module Overview')
            .replace(/[^\w\s]/g, '')
            .substring(0, 30);

        return `flowchart TD
    A["${desc}"]
    A --> B["Summary"]
    A --> C["Details"]`;
    };

    const renderDiagram = async () => {
        setIsLoading(true);
        setError(null);

        let codeToRender = cleanMermaidCode(visualization.mermaidCode);

        if (!codeToRender || codeToRender.length < 5) {
            codeToRender = getFallbackDiagram();
        }

        try {
            const diagramId = `mermaid-${uniqueId}-${Date.now()}`;

            // Clear any previous element with same ID
            const existingEl = document.getElementById(diagramId);
            if (existingEl) existingEl.remove();

            const { svg } = await mermaid.render(diagramId, codeToRender);
            setSvgContent(svg);
            setIsLoading(false);
        } catch (err) {
            console.error('Mermaid error:', err);

            try {
                const fallbackId = `mermaid-fallback-${uniqueId}`;
                const { svg } = await mermaid.render(fallbackId, getFallbackDiagram());
                setSvgContent(svg);
            } catch (e) {
                setError('Diagram rendering failed');
            }
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className={`flex items-center justify-center p-8 bg-slate-800/50 rounded-xl ${className}`}>
                <Loader2 className="w-6 h-6 text-brand-cyan animate-spin" />
                <span className="ml-2 text-sm text-slate-400">Loading diagram...</span>
            </div>
        );
    }

    if (error || !svgContent) {
        return (
            <div className={`flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-xl border border-slate-700 ${className}`}>
                <BarChart3 className="w-10 h-10 text-slate-500 mb-2" />
                <p className="text-sm text-slate-400 mb-3">Visualization unavailable</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={renderDiagram}
                    className="border-slate-600"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            <div
                className="bg-slate-800/50 rounded-xl p-4 overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            {visualization.description && (
                <p className="text-xs text-slate-500 mt-2 text-center italic">
                    {visualization.description}
                </p>
            )}
        </div>
    );
};

export default VisualizationRenderer;
