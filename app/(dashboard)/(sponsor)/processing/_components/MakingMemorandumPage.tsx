"use client";
import { useState } from "react";
import { Step } from "./Step";
import FileUpload from "./FileUpload";
import SubmitSuccess from "./SubmitSuccess";
import AddPropertyInfo from "./AddPropertyInfo";
import Processing from "./Processing";
import PickPropertyLocation from "./PickPropertyLocation";
import type { PlaceData, PropertyData, UploadedFileItem } from "./place-types";

const MakingMemorandumPage = () => {
  const steps = [
    { id: 0, title: "Location", description: "Search or pin the property address" },
    { id: 1, title: "Property Details", description: "Review and edit the property information" },
    { id: 2, title: "Upload", description: "Upload your property documents" },
    { id: 3, title: "Review & Generate", description: "Review property details and generate memorandum" },
    { id: 4, title: "Completed", description: "Memorandum generated successfully" },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [placeData, setPlaceData] = useState<PlaceData | null>(null);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedFileItem[]>([]);
  const [memorandumId, setMemorandumId] = useState<number | null>(null);

  const handleReset = () => {
    setCurrentStep(0);
    setPropertyId(null);
    setPlaceData(null);
    setPropertyData(null);
    setUploadedDocuments([]);
    setMemorandumId(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-2">
      {currentStep <= 4 && (
        <Step
          steps={steps}
          value={currentStep}
          loading={false}
          onChange={setCurrentStep}
        />
      )}

      {currentStep === 0 && (
        <PickPropertyLocation
          id={steps[currentStep].id}
          title={steps[currentStep].title}
          description={steps[currentStep].description}
          setCurrentStep={setCurrentStep}
          setPlaceData={setPlaceData}
        />
      )}

      {currentStep === 1 && (
        <AddPropertyInfo
          id={steps[currentStep].id}
          title={steps[currentStep].title}
          description={steps[currentStep].description}
          setCurrentStep={setCurrentStep}
          setPropertyId={setPropertyId}
          setPropertyData={setPropertyData}
          placeData={placeData}
          propertyData={propertyData}
        />
      )}

      {currentStep === 2 && (
        <FileUpload
          id={steps[currentStep].id}
          title={steps[currentStep].title}
          description={steps[currentStep].description}
          setCurrentStep={setCurrentStep}
          propertyId={propertyId}
          setUploadedDocuments={setUploadedDocuments}
        />
      )}

      {currentStep === 3 && (
        <Processing
          id={steps[currentStep].id}
          title={steps[currentStep].title}
          description={steps[currentStep].description}
          setCurrentStep={setCurrentStep}
          propertyId={propertyId}
          propertyData={propertyData}
          uploadedDocuments={uploadedDocuments}
          setMemorandumId={setMemorandumId}
          onEditProperty={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 4 && (
        <SubmitSuccess
          propertyData={propertyData}
          memorandumId={memorandumId}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default MakingMemorandumPage;

