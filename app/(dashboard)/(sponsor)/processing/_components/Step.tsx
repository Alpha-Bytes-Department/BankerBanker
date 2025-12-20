import React from 'react';


const steps = [
    {
        id: 1,
        title: "Upload Investment Memo"
    },
]

const Step = () => {
    return (
        <div className='flex items-center gap-3'>
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-primary text-[#FFFFFF] font-semibold">1</div>
            <p>Upload Investment Memo</p>
            {/* line */}
            <div className='flex-1 h-1 bg-[#E5E7EB] '/>
        </div>
    );
};

export default Step;