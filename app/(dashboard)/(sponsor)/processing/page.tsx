"use client"
import { useState } from 'react';
import { Step } from './_components/Step';
import FileUpload from './_components/FileUpload';
import AddConnection from './_components/AddConnection';
import Review from './_components/Review';
import SubmitSuccess from './_components/SubmitSuccess';


const Page = () => {
    const steps = [
        { id: 1, title: "Upload", description: "Choose a method for how you'd like to upload your data" },
        { id: 2, title: "Processing", description: "Connect your data sources securely" },
        { id: 3, title: "Review", description: "Ensure all data is accurate and complete" },
    ];

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);


    return (
        <div>
            <h1 className='text-2xl'>Upload Investment Memo</h1>
            <p className='text-[#4A5565]'>Upload existing documents to help auto-populate your offering memorandum</p>
            {currentStep <= 3 && <Step
                steps={steps}
                value={currentStep}
                loading={loading}
                onChange={setCurrentStep}
            />}
            {currentStep === 1 ? <FileUpload id={1} title={steps[currentStep-1].title} description={steps[currentStep-1].description} setCurrentStep={setCurrentStep}/> : currentStep === 2 ? <AddConnection id={2} title={steps[currentStep-1].title} description={steps[currentStep-1].description} setCurrentStep={setCurrentStep} /> : currentStep === 3 ? <Review id={3} title={steps[currentStep-1].title} description={steps[currentStep-1].description} setCurrentStep={setCurrentStep} /> : <SubmitSuccess />}
        </div>
    );
};

export default Page;