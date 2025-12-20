import Button from "@/components/Button";
import { Check, FileText } from "lucide-react";


const documents = [
    { name: "Frame 115.jpg", size: "375.11 KB", type: "image" },
    { name: "Home screen.png", size: "956.97 KB", type: "image" },
    { name: "1697 Marmont Avenue, Los Angeles, CA 90069.pdf", size: "347.9 KB", type: "pdf" },
    { name: "Team Ari Questions - 10-9-25 (1).docx", size: "876.62 KB", type: "doc" },
];

type AddConnectionProps = {
    id: number;
    title?: string;
    description?: string;
    setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
};


const AddConnection = ({
    id,
    title,
    description,
    setCurrentStep,
}: AddConnectionProps) => {
    return (
        <div className="rounded-xl bg-white shadow-sm  mt-6 p-5 pb-16 space-y-6">
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
            {/* AI Document Analysis */}
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-5">
                <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <FileText stroke="#0D4DA5" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                            AI Document Analysis
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Our AI will analyze your uploaded documents to automatically extract:
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {[
                                "Property details",
                                "Market analysis",
                                "Financial metrics",
                                "Investment highlights",
                            ].map(item => (
                                <div key={item} className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                    <span className="text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Uploaded Documents */}
            <div className="border border-[#E5E7EB] rounded-lg p-5">
                <div className="px-4 py-3 text-sm font-medium text-gray-700">
                    Uploaded Documents (4)
                </div>

                <div className="">
                    {documents.map((doc, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between px-4 py-3 bg-[#F9FAFB] rounded-lg mb-3"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    {doc.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {doc.size}
                                </p>
                            </div>

                            <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600">
                                Processing
                            </span>
                        </div>
                    ))}
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

export default AddConnection;