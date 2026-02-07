import { Download, FileText } from 'lucide-react';

const DocumentList = () => {
    return (
        <div className='flex-1 flex flex-col gap-5 border border-[#0000001A] p-3 rounded-lg max-h-[60vh] lg:flex-1'>
            <div className='flex justify-between items-center'>
                <h1>Documents</h1>
                <p className='border border-[#0000001A] px-2 rounded-lg'>9</p>
            </div>
            <div className='flex flex-col overflow-y-auto'>
                <div className='flex flex-col gap-2 border border-[#E5E7EB] p-2 rounded-lg'>
                    <div className='flex justify-between items-center gap-3'>
                        <div className='flex gap-2'>
                            <FileText />
                            <div className=''>
                                <div>Financial_Statements_Q3_2024.pdf</div>
                                <p className='text-[#4A5565] flex items-center gap-3'><span>24 pages</span><span>10/20/2025</span></p>
                            </div>
                        </div>
                        <button className='cursor-pointer'><Download /></button>
                    </div>
                    <div>
                        <p className=' text-[#0A0A0A] border border-[#0000001A] p-2 rounded-lg inline-block ms-10'>Financial</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentList;