import { Download, FileText } from "lucide-react";


const Preview = () => {
    return (
        <div className="flex flex-col gap-5 p-5 flex-1 border border-[#0000001A] rounded-lg h-[90vh]">
            <div className="flex items-center justify-between">
                <div className="flex gap-2 w-[250px] truncate">
                    <FileText/>
                    <h1>Financial_Statements_fasdfdfaf_Q3_2024.pdf</h1>
                </div>
                <button className='cursor-pointer flex gap-2 border border-[#0000001A] px-3 py-1 rounded-full'><Download /> </button>
            </div>
            <div className="flex flex-col justify-center items-center border-[#E5E7EB] my-auto">
                <FileText size={42}/>
                <p className="text-[#4A5565]">Document Preview</p>
                <p className="text-[#6A7282]">Viewing: Financial_Statements_Q3_2024.pdf</p>
            </div>
        </div>
    );
};

export default Preview;