"use client"
import { useState } from 'react';
import { Step } from './Step';
import FileUpload from './FileUpload';
import SubmitSuccess from './SubmitSuccess';
import AddPropertyInfo from './AddPropertyInfo';
import Processing from './Processing';



const MakingMemorandumPage = () => {
    const steps = [
        { id: 0, title: "Enter Information", description: "Select the location and enter property details" },
        { id: 1, title: "Upload", description: "Upload your property documents" },
        { id: 2, title: "Processing", description: "Your data is being processed by our AI" },
        { id: 3, title: "Review", description: "Ensure all data is accurate and complete" },
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [propertyId, setPropertyId] = useState<number | null>(null);

    

    return (
        <div className='w-full'>
            
            

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