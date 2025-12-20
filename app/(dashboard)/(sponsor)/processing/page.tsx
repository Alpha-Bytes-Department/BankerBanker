import React from 'react';
import Step from './_components/Step';


const page = () => {
    return (
        <div>
            <h1 className='text-2xl'>Upload Investment Memo</h1>
            <p className='text-[#4A5565]'>Upload existing documents to help auto-populate your offering memorandum</p>
            <Step/>
            
        </div>
    );
};

export default page;