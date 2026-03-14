import { Download, FileText, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

const Preview = () => {
    return (
        <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-5 w-full border border-[#0000001A] rounded-xl h-[55vh] sm:h-[65vh] lg:h-[calc(90vh-1rem)] bg-white">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 shrink-0">
                <div className="flex gap-2 items-center min-w-0 flex-1">
                    <span className="shrink-0 p-1.5 rounded-lg bg-primary/10">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </span>
                    <div className="min-w-0">
                        <h1 className="text-sm sm:text-base font-semibold truncate leading-tight">
                            Financial_Statements_Q3_2024.pdf
                        </h1>
                        <p className="text-xs text-[#6A7282]">24 pages · 2.4 MB</p>
                    </div>
                </div>
                <button className='cursor-pointer flex items-center gap-1.5 border border-[#0000001A] px-2.5 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors shrink-0'>
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Download</span>
                </button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 flex flex-col justify-center items-center border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] min-h-0 relative overflow-hidden">
                {/* Decorative grid background */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Content */}
                <div className="relative flex flex-col items-center gap-2 sm:gap-3 px-4 text-center">
                    <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm sm:text-base font-medium text-[#4A5565]">Document Preview</p>
                        <p className="text-xs sm:text-sm text-[#6A7282] mt-0.5 max-w-[200px] sm:max-w-xs truncate">
                            Financial_Statements_Q3_2024.pdf
                        </p>
                    </div>
                    <button className="mt-1 px-4 py-1.5 bg-primary text-white text-xs sm:text-sm rounded-full font-medium hover:opacity-90 transition-opacity cursor-pointer">
                        Open Document
                    </button>
                </div>
            </div>

            {/* Pagination / Controls */}
            <div className="flex items-center justify-between shrink-0">
                <button className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 transition-colors cursor-pointer">
                    <ChevronLeft className="w-4 h-4 text-[#4A5565]" />
                </button>
                <div className="flex items-center gap-2 sm:gap-3">
                    <button className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 transition-colors cursor-pointer">
                        <ZoomOut className="w-3.5 h-3.5 text-[#4A5565]" />
                    </button>
                    <span className="text-xs text-[#6A7282] font-medium">Page 1 / 24</span>
                    <button className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 transition-colors cursor-pointer">
                        <ZoomIn className="w-3.5 h-3.5 text-[#4A5565]" />
                    </button>
                </div>
                <button className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 transition-colors cursor-pointer">
                    <ChevronRight className="w-4 h-4 text-[#4A5565]" />
                </button>
            </div>
        </div>
    );
};

export default Preview;
