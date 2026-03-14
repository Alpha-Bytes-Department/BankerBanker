import { Download, FileText, Search, Filter } from 'lucide-react';

const documents = [
    {
        name: "Financial_Statements_Q3_2024.pdf",
        pages: 24,
        date: "10/20/2025",
        tag: "Financial",
        size: "2.4 MB",
    },
    {
        name: "Annual_Report_2023.pdf",
        pages: 48,
        date: "01/15/2025",
        tag: "Report",
        size: "5.1 MB",
    },
    {
        name: "Budget_Forecast_Q4.xlsx",
        pages: 12,
        date: "09/05/2025",
        tag: "Financial",
        size: "1.2 MB",
    },
];

const tagColors: Record<string, string> = {
    Financial: "bg-blue-50 text-blue-700 border-blue-200",
    Report: "bg-green-50 text-green-700 border-green-200",
    Legal: "bg-amber-50 text-amber-700 border-amber-200",
    default: "bg-gray-50 text-gray-700 border-gray-200",
};

const DocumentList = () => {
    return (
        <div className='flex flex-col gap-3 border border-[#0000001A] p-3 sm:p-4 rounded-xl max-h-[45vh] sm:max-h-[50vh] lg:max-h-[35vh] bg-white w-full'>
            {/* Header */}
            <div className='flex items-center justify-between gap-2 shrink-0'>
                <div className='flex items-center gap-2'>
                    <h1 className='text-sm sm:text-base font-semibold'>Documents</h1>
                    <span className='border border-[#0000001A] bg-gray-50 px-2 py-0.5 rounded-full text-xs font-medium text-[#4A5565]'>
                        9
                    </span>
                </div>
                <div className='flex items-center gap-1.5'>
                    <button className='p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 transition-colors cursor-pointer'>
                        <Search className='w-3.5 h-3.5 text-[#4A5565]' />
                    </button>
                    <button className='p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 transition-colors cursor-pointer'>
                        <Filter className='w-3.5 h-3.5 text-[#4A5565]' />
                    </button>
                </div>
            </div>

            {/* Document Rows */}
            <div className='flex flex-col gap-2 overflow-y-auto min-h-0 pr-0.5'>
                {documents.map((doc, i) => (
                    <div
                        key={i}
                        className='flex items-center gap-2 sm:gap-3 border border-[#E5E7EB] p-2 sm:p-3 rounded-xl hover:bg-gray-50/80 transition-colors group'
                    >
                        {/* Icon */}
                        <span className='shrink-0 p-1.5 sm:p-2 rounded-lg bg-primary/10'>
                            <FileText className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
                        </span>

                        {/* Info */}
                        <div className='flex-1 min-w-0'>
                            <p className='text-xs sm:text-sm font-medium truncate leading-tight'>{doc.name}</p>
                            <div className='flex items-center gap-2 mt-0.5 flex-wrap'>
                                <span className='text-[10px] sm:text-xs text-[#6A7282]'>{doc.pages} pages</span>
                                <span className='text-[10px] sm:text-xs text-[#6A7282] hidden xs:inline'>·</span>
                                <span className='text-[10px] sm:text-xs text-[#6A7282] hidden xs:inline'>{doc.date}</span>
                                <span className='text-[10px] sm:text-xs text-[#6A7282] hidden sm:inline'>·</span>
                                <span className='text-[10px] sm:text-xs text-[#6A7282] hidden sm:inline'>{doc.size}</span>
                            </div>
                        </div>

                        {/* Tag */}
                        <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 hidden sm:inline-flex ${tagColors[doc.tag] ?? tagColors.default}`}>
                            {doc.tag}
                        </span>

                        {/* Download */}
                        <button className='cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0 opacity-60 group-hover:opacity-100'>
                            <Download className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4A5565]' />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentList;
