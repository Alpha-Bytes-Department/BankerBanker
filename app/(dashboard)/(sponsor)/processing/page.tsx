"use client"
import { useState } from 'react';
import { Step } from './_components/Step';


const Page = () => {
    const steps = [
        { id: 1, title: "Upload Investment Memo" },
        { id: 2, title: "Add Connections" },
        { id: 3, title: "Review and Add Connections" },
    ];

    const [currentStep, setCurrentStep] = useState(2);
    const [loading, setLoading] = useState(false);


    return (
        <div>
            <h1 className='text-2xl'>Upload Investment Memo</h1>
            <p className='text-[#4A5565]'>Upload existing documents to help auto-populate your offering memorandum</p>
            <Step
                steps={steps}
                value={currentStep}
                loading={loading}
                onChange={setCurrentStep}
            />

        </div>
    );
};

export default Page;