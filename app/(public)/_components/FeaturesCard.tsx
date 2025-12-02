import React from 'react';

type FeaturesCardProps = {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    iconBgColor?: string;
};

const FeaturesCard = ({
    title = "Feature Title",
    description = "Feature description goes here.",
    icon,
    iconBgColor = "#E5E7EB",

}: FeaturesCardProps) => {
    return (
        <div className='bg-[#E5E7EB] p-8 rounded-xl flex flex-col gap-4 w-[363px]'>
            <div>
                <div style={{ backgroundColor: iconBgColor }} className='p-4 rounded-lg inline-block'>
                    {icon}
                </div>
            </div>
            <div className='text-[#111827] font-semibold text-xl'>
                {title}
            </div>
            <div className='text-[#4B5563]'>
                {description}
            </div>
        </div>
    );
};

export default FeaturesCard;