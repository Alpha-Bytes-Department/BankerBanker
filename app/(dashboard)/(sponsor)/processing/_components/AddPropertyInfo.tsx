import GMAP from '@/app/(dashboard)/_components/GMAP';
import React from 'react';

type AddPropertyInfoProps = {
    id: number;
    title?: string;
    description?: string;
    setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
};


const AddPropertyInfo = ({
    id,
    title,
    description,
    setCurrentStep,
}: AddPropertyInfoProps) => {
    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-3">
                <div>
                    <h1 className="text-xl">Step {id + 1} : {title}</h1>
                    <p className="text-[#4A5565]">{description}</p>
                </div>
            </div>
            {/* map  */}
            <h1 className='mt-5 mb-2 text-xl '>Select your property Location </h1>
            <GMAP/>
        </div>
    );
};

export default AddPropertyInfo;