"use client"
import { useState } from 'react';
import { Step } from './Step';
import FileUpload from './FileUpload';
import SubmitSuccess from './SubmitSuccess';
import AddPropertyInfo from './AddPropertyInfo';
import Processing from './Processing';



const MakingMemorandumPage = () => {
    const steps = [
        { id: 0, title: "Select location", description: "Select the location where your property is located" },
        { id: 1, title: "Upload", description: "Choose a method for how you'd like to upload your data" },
        { id: 2, title: "Processing", description: "Connect your data sources securely" },
        { id: 3, title: "Review", description: "Ensure all data is accurate and complete" },
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [propertyId, setPropertyId] = useState<number | null>(null);

    

    return (
        <div className='w-full'>
            <h1 className='text-2xl'>Upload Investment Memo</h1>
            <p className='text-[#4A5565]'>Upload existing documents to help auto-populate your offering memorandum</p>
            {currentStep <= 3 && <Step steps={steps} value={currentStep} loading={loading} onChange={setCurrentStep}/>}
            {/* passing the current steps  */}
            {currentStep === 0 && <AddPropertyInfo id={steps[currentStep].id} title={steps[currentStep].title} description={steps[currentStep].description} setCurrentStep={setCurrentStep} setPropertyId={setPropertyId} />}
            {currentStep === 1 && <FileUpload id={steps[currentStep].id} title={steps[currentStep].title} description={steps[currentStep].description} setCurrentStep={setCurrentStep} propertyId={propertyId} />}
            {currentStep === 2 && <Processing id={steps[currentStep].id} title={steps[currentStep].title} description={steps[currentStep].description} setCurrentStep={setCurrentStep} propertyId={propertyId}/>}
            {currentStep === 3 && <SubmitSuccess />}
        </div>
    );
};

export default MakingMemorandumPage;