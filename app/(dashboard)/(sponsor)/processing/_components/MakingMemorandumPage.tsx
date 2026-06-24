"use client"
import { useState } from 'react';
import { Step } from './Step';
import FileUpload from './FileUpload';
import SubmitSuccess from './SubmitSuccess';
import AddPropertyInfo from './AddPropertyInfo';
import Processing from './Processing';
import PickPropertyLocation from './PickPropertyLocation';
import type { PlaceData } from './place-types';



const MakingMemorandumPage = () => {
    const steps = [
        { id: 0, title: "Location", description: "Search or pin the property address" },
        { id: 1, title: "Property Details", description: "Review and edit the property information" },
        { id: 2, title: "Upload", description: "Upload your property documents" },
        { id: 3, title: "Processing", description: "Your data is being processed by our AI" },
        { id: 4, title: "Review", description: "Ensure all data is accurate and complete" },
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const loading = false;
    const [propertyId, setPropertyId] = useState<number | null>(null);
    const [placeData, setPlaceData] = useState<PlaceData | null>(null);

    

    return (
        <div className='w-full'>
            
            

            {currentStep <= 4 && <Step steps={steps} value={currentStep} loading={loading} onChange={setCurrentStep}/>}
            {/* passing the current steps  */}
            {currentStep === 0 && <PickPropertyLocation id={steps[currentStep].id} title={steps[currentStep].title} description={steps[currentStep].description} setCurrentStep={setCurrentStep} setPlaceData={setPlaceData} />}
            {currentStep === 1 && <AddPropertyInfo id={steps[currentStep].id} title={steps[currentStep].title} description={steps[currentStep].description} setCurrentStep={setCurrentStep} setPropertyId={setPropertyId} placeData={placeData} />}
            {currentStep === 2 && <FileUpload id={steps[currentStep].id} title={steps[currentStep].title} description={steps[currentStep].description} setCurrentStep={setCurrentStep} propertyId={propertyId} />}
            {currentStep === 3 && <Processing id={steps[currentStep].id} title={steps[currentStep].title} description={steps[currentStep].description} setCurrentStep={setCurrentStep} propertyId={propertyId}/>}
            {currentStep === 4 && <SubmitSuccess />}
            
        </div>
    );
};

export default MakingMemorandumPage;
