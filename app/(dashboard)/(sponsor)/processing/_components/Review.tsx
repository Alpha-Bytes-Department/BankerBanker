import Button from '@/components/Button';
import { Check } from 'lucide-react';
import React from 'react';

type ReviewProps = {
    id: number;
    title?: string;
    description?: string;
    setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
};

const Review = ({
    id,
    title,
    description,
    setCurrentStep,
}: ReviewProps) => {
    return (
        <div className="rounded-xl bg-white shadow-md border border-[#E5E7EB] mt-6 p-5 pb-16 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-semibold">
                    <Check stroke="#0D4DA5" />
                </div>
                <div>
                    <h1 className="text-xl">Step {id}: {title}</h1>
                    <p className="text-[#4A5565]">{description}</p>
                </div>
            </div>

            <div className="w-full rounded-xl border border-gray-200  bg-white">
                {/* Extracted Information */}
                <div className="p-6">
                    <h3 className="mb-4 text-sm font-medium text-gray-900">
                        Extracted Information
                    </h3>

                    <div className="grid grid-cols-1 gap-y-4 gap-x-12 md:grid-cols-2">
                        <div>
                            <p className="text-xs text-gray-500">Property Type</p>
                            <p className="text-sm font-medium text-gray-900">Multifamily</p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">Units</p>
                            <p className="text-sm font-medium text-gray-900">24 Units</p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">Square Footage</p>
                            <p className="text-sm font-medium text-gray-900">18,500 SF</p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">Year Built</p>
                            <p className="text-sm font-medium text-gray-900">1985</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200" />

                {/* Financial Metrics */}
                <div className="p-6">
                    <h3 className="mb-4 text-sm font-medium text-gray-900">
                        Financial Metrics
                    </h3>

                    <div className="grid grid-cols-1 gap-y-4 gap-x-12 md:grid-cols-2">
                        <div>
                            <p className="text-xs text-gray-500">Purchase Price</p>
                            <p className="text-sm font-medium text-gray-900">$4,800,000</p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">NOI</p>
                            <p className="text-sm font-medium text-gray-900">$336,000</p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">Cap Rate</p>
                            <p className="text-sm font-medium text-gray-900">7.0%</p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">Occupancy</p>
                            <p className="text-sm font-medium text-gray-900">95%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4">
                <Button text="Back" className="button-outline text-sm rounded-md"
                    onClick={() => {
                        if (!setCurrentStep) return;
                        setCurrentStep(id - 1);
                    }} />
                <Button text="Continue" className="button-primary text-sm rounded-md"
                    onClick={() => {
                        if (!setCurrentStep) return;
                        setCurrentStep(id + 1);
                    }} />

            </div>
        </div>
    );
};

export default Review;