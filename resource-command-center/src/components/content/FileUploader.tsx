import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Image, X, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { extractTextFromImage } from '@/lib/gemini';
import { SUPPORTED_FILE_TYPES, FILE_TYPE_LABELS } from '@/types/courseTypes';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker for v3.11.174
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface FileUploaderProps {
    onContentExtracted: (content: string, fileName: string) => void;
    isProcessing?: boolean;
}

// Render a PDF page to a base64 image
async function renderPDFPageToImage(pdf: any, pageNum: number): Promise<string> {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 }); // Reasonable scale for OCR
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) throw new Error('Could not get canvas context');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };

    await page.render(renderContext).promise;
    return canvas.toDataURL('image/jpeg', 0.8);
}

// Extract text from PDF using PDF.js with Vision OCR fallback
async function extractTextFromPDF(file: File, onProgress?: (msg: string) => void): Promise<string> {
    console.log('Starting PDF extraction for:', file.name);

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: '/cmaps/',
        cMapPacked: true,
    });

    const pdf = await loadingTask.promise;
    console.log('PDF loaded, pages:', pdf.numPages);

    let fullText = '';
    const totalPages = pdf.numPages;

    // Phase 1: Try standard text extraction
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (onProgress) onProgress(`Reading text from page ${pageNum}/${totalPages}...`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item: any) => item.str || '')
            .join(' ');
        fullText += pageText + '\n\n';
    }

    // Phase 2: If text is missing or very sparse (handwritten/scanned), use Vision OCR on samples
    const cleanedText = fullText.trim().replace(/\s+/g, ' ');
    if (cleanedText.length < 100) {
        console.log('Sparse text detected, falling back to Vision OCR for first 3 pages');
        if (onProgress) onProgress('Handwriting detected. Running Vision OCR...');

        fullText = ''; // Reset and use OCR text
        const pagesToOCR = Math.min(totalPages, 3);

        for (let pageNum = 1; pageNum <= pagesToOCR; pageNum++) {
            if (onProgress) onProgress(`OCR processing page ${pageNum}/${pagesToOCR}...`);
            const imageData = await renderPDFPageToImage(pdf, pageNum);
            const pageText = await extractTextFromImage(imageData);
            fullText += `[Page ${pageNum} OCR]:\n${pageText}\n\n`;
        }

        if (totalPages > 3) {
            fullText += `\n(Note: OCR performed on first 3 pages only for performance)`;
        }
    }

    return fullText.trim();
}

const FileUploader = ({ onContentExtracted, isProcessing = false }: FileUploaderProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [extracting, setExtracting] = useState(false);
    const [extracted, setExtracted] = useState(false);
    const [extractionProgress, setExtractionProgress] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processFile = async (selectedFile: File) => {
        console.log('Processing file:', selectedFile.name, selectedFile.type);

        if (!SUPPORTED_FILE_TYPES.includes(selectedFile.type) && !selectedFile.name.endsWith('.txt')) {
            toast.error('Unsupported file type. Please upload PDF, DOCX, TXT, or image files.');
            return;
        }

        setFile(selectedFile);
        setExtracting(true);
        setExtracted(false);
        setExtractionProgress('Reading file...');

        try {
            let extractedContent = '';

            if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
                setExtractionProgress('Extracting text...');
                extractedContent = await selectedFile.text();
            } else if (selectedFile.type.startsWith('image/')) {
                setExtractionProgress('Running OCR on image...');
                const base64 = await fileToBase64(selectedFile);
                extractedContent = await extractTextFromImage(base64);
            } else if (selectedFile.type === 'application/pdf') {
                setExtractionProgress('Analyzing PDF structure...');
                extractedContent = await extractTextFromPDF(selectedFile, (msg) => {
                    setExtractionProgress(msg);
                });

                if (!extractedContent.trim()) {
                    toast.warning('PDF has no extractable content.');
                }
            } else if (selectedFile.type.includes('wordprocessingml')) {
                toast.warning('DOCX not supported. Please save as PDF or TXT.');
            }

            console.log('Extracted content length:', extractedContent.length);

            if (extractedContent.trim()) {
                onContentExtracted(extractedContent, selectedFile.name);
                setExtracted(true);
                const wordCount = extractedContent.split(/\s+/).length;

                if (extractedContent.includes('[Page 1 OCR]')) {
                    toast.success(`OCR Complete! Extracted content from handwritten slides.`);
                } else {
                    toast.success(`Extracted ${wordCount.toLocaleString()} words!`);
                }
            } else {
                toast.error('Could not extract text from file.');
            }
        } catch (error) {
            console.error('File processing error:', error);
            toast.error('PDF parsing failed. Try pasting text directly.');
        } finally {
            setExtracting(false);
            setExtractionProgress('');
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) processFile(droppedFile);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) processFile(selectedFile);
    };

    const clearFile = () => {
        setFile(null);
        setExtracted(false);
        setExtractionProgress('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-4">
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
            />

            <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
                className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                    transition-all duration-300
                    ${isDragging
                        ? 'border-primary bg-primary/10 scale-[1.02]'
                        : file
                            ? extracted
                                ? 'border-green-500/50 bg-green-500/5'
                                : 'border-primary/50 bg-primary/5'
                            : 'border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/30'
                    }
                `}
                whileHover={{ scale: file ? 1 : 1.01 }}
            >
                <AnimatePresence mode="wait">
                    {extracting ? (
                        <motion.div
                            key="extracting"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <Loader2 className="w-12 h-12 text-brand-cyan animate-spin" />
                            <div>
                                <p className="text-slate-300 font-medium">{file?.name}</p>
                                <p className="text-sm text-cyan-400">{extractionProgress}</p>
                            </div>
                        </motion.div>
                    ) : file ? (
                        <motion.div
                            key="file-selected"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center gap-3"
                        >
                            {extracted ? (
                                <CheckCircle className="w-12 h-12 text-green-400" />
                            ) : (
                                <FileText className="w-12 h-12 text-cyan-400" />
                            )}
                            <div>
                                <p className="text-white font-medium">{file.name}</p>
                                <p className="text-sm text-slate-400">
                                    {FILE_TYPE_LABELS[file.type] || 'Document'} • {(file.size / 1024).toFixed(1)} KB
                                </p>
                                {extracted && (
                                    <p className="text-sm text-green-400 mt-1">✓ Content extracted</p>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                                className="text-slate-400 hover:text-red-400"
                            >
                                <X className="w-4 h-4 mr-1" /> Remove
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <Upload className={`w-12 h-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                            <div>
                                <p className="text-foreground font-medium">
                                    {isDragging ? 'Drop your file here' : 'Drag & drop your course content'}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    PDF, TXT, or Images
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-slate-900/80 rounded-xl flex items-center justify-center"
                    >
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 text-brand-cyan animate-spin mx-auto mb-2" />
                            <p className="text-slate-300 text-sm">Generating modules...</p>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default FileUploader;
