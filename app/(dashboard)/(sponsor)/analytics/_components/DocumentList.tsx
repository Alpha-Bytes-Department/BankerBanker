"use client";

import { Download, FileText, Search, Filter } from 'lucide-react';
import type { DocviewDocument } from './docview-types';

interface DocumentListProps {
    documents: DocviewDocument[];
    selectedDocumentId: number | null;
    loading: boolean;
    error: string | null;
    onSelectDocument: (id: number) => void;
    onDownloadDocument: (document: DocviewDocument) => void;
}

const getFileNameFromUrl = (url: string) => {
    const safeUrl = url.split('?')[0];
    return decodeURIComponent(safeUrl.substring(safeUrl.lastIndexOf('/') + 1));
};

const getDocumentTag = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (!extension) return 'Document';
    if (extension === 'pdf') return 'PDF';
    if (extension === 'doc' || extension === 'docx') return 'Word';
    if (extension === 'xls' || extension === 'xlsx' || extension === 'csv') return 'Sheet';
    if (extension === 'ppt' || extension === 'pptx') return 'Slides';
    return extension.toUpperCase();
};

const tagColors: Record<string, string> = {
    PDF: "bg-red-50 text-red-700 border-red-200",
    Word: "bg-blue-50 text-blue-700 border-blue-200",
    Sheet: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Slides: "bg-orange-50 text-orange-700 border-orange-200",
    default: "bg-gray-50 text-gray-700 border-gray-200",
};

const DocumentList = ({
    documents,
    selectedDocumentId,
    loading,
    error,
    onSelectDocument,
    onDownloadDocument,
}: DocumentListProps) => {
    return (
        <div className='flex flex-col gap-3 border border-[#0000001A] p-3 sm:p-4 rounded-xl max-h-[45vh] sm:max-h-[50vh] lg:max-h-[35vh] bg-white w-full'>
            {/* Header */}
            <div className='flex items-center justify-between gap-2 shrink-0'>
                <div className='flex items-center gap-2'>
                    <h1 className='text-sm sm:text-base font-semibold'>Documents</h1>
                    <span className='border border-[#0000001A] bg-gray-50 px-2 py-0.5 rounded-full text-xs font-medium text-[#4A5565]'>
                        {documents.length}
                    </span>
                </div>
                <div className='flex items-center gap-1.5'>
                    <button type="button" className='p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 transition-colors cursor-pointer'>
                        <Search className='w-3.5 h-3.5 text-[#4A5565]' />
                    </button>
                    <button type="button" className='p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 transition-colors cursor-pointer'>
                        <Filter className='w-3.5 h-3.5 text-[#4A5565]' />
                    </button>
                </div>
            </div>

            {/* Document Rows */}
            <div className='flex flex-col gap-2 overflow-y-auto min-h-0 pr-0.5'>
                {loading ? (
                    <p className='text-sm text-[#6A7282] text-center py-8'>Loading documents...</p>
                ) : error ? (
                    <p className='text-sm text-red-600 text-center py-8'>{error}</p>
                ) : documents.length === 0 ? (
                    <p className='text-sm text-[#6A7282] text-center py-8'>No documents found for this property.</p>
                ) : (
                    documents.map((doc) => {
                        const fileName = getFileNameFromUrl(doc.file_url);
                        const docTag = getDocumentTag(fileName);
                        const isSelected = selectedDocumentId === doc.id;

                        return (
                            <button
                                key={doc.id}
                                type="button"
                                onClick={() => onSelectDocument(doc.id)}
                                className={`w-full text-left flex items-center gap-2 sm:gap-3 border p-2 sm:p-3 rounded-xl transition-colors group ${
                                    isSelected
                                        ? 'border-primary/40 bg-primary/5'
                                        : 'border-[#E5E7EB] hover:bg-gray-50/80'
                                }`}
                            >
                                {/* Icon */}
                                <span className='shrink-0 p-1.5 sm:p-2 rounded-lg bg-primary/10'>
                                    <FileText className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
                                </span>

                                {/* Info */}
                                <div className='flex-1 min-w-0'>
                                    <p className='text-xs sm:text-sm font-medium truncate leading-tight'>{fileName}</p>
                                    <div className='flex items-center gap-2 mt-0.5 flex-wrap'>
                                        <span className='text-[10px] sm:text-xs text-[#6A7282]'>Uploaded</span>
                                        <span className='text-[10px] sm:text-xs text-[#6A7282] hidden xs:inline'>·</span>
                                        <span className='text-[10px] sm:text-xs text-[#6A7282]'>
                                            {new Date(doc.uploaded_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Tag */}
                                <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 hidden sm:inline-flex ${tagColors[docTag] ?? tagColors.default}`}>
                                    {docTag}
                                </span>

                                {/* Download */}
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onDownloadDocument(doc);
                                    }}
                                    className='cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0 opacity-60 group-hover:opacity-100'
                                >
                                    <Download className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4A5565]' />
                                </button>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DocumentList;
