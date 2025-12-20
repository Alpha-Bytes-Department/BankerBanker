import Button from "@/components/Button";
import { Upload, Lightbulb } from "lucide-react";



type FileUploadProps = {
    id: number;
    title?: string;
    description?: string;
    setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
};


const FileUpload = ({
    id,
    title,
    description,
    setCurrentStep,
}: FileUploadProps) => {
    return (
        <div className="space-y-6 mt-6 p-5 pb-16 border border-[#E5E7EB] rounded-lg shadow-lg">
            <div>
                <h1 className="text-xl">Step {id}: {title}</h1>
                <p className="text-[#4A5565]">{description}</p>
            </div>
            {/* File upload input */}
            <div className="w-full mx-auto">
                <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#D1D5DC]  bg-white p-10 text-center cursor-pointer hover:bg-gray-50 transition"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                        <Upload className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                        Drag files or click to select
                    </p>
                    <p className="text-xs text-gray-500">
                        PDFs, spreadsheets, images, and more
                    </p>
                    <span className="mt-2 rounded-md bg-black px-4 py-2 text-sm text-white">
                        Choose Files
                    </span>
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                    />
                </label>
            </div>
            <div>
                {/* recommendations  */}
                <div className="w-full rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <p className="text-sm font-medium text-gray-800">
                            Recommended documents to upload:
                        </p>
                    </div>

                    <ul className="space-y-1 pl-6 text-sm text-gray-700 list-disc marker:text-blue-600">
                        <li>Existing investment memorandums or offering documents</li>
                        <li>Financial statements and rent rolls</li>
                        <li>Property photos and floor plans</li>
                        <li>Market analysis reports</li>
                    </ul>
                </div>
                {/* file upload suggestions  */}
                <div className="w-full border-t-2 border-[#E5E7EB] mt-4 pt-4">
                    {/* Header */}
                    <button className="mb-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                        See supported file types
                    </button>

                    {/* Content */}
                    <div className="grid grid-cols-1 gap-6 text-sm text-gray-700 md:grid-cols-2">
                        <div>
                            <p className="mb-2 font-medium text-gray-900">Documents</p>
                            <ul className="space-y-1">
                                <li>PDF (.pdf)</li>
                                <li>Word (.doc, .docx)</li>
                                <li>Text (.txt)</li>
                            </ul>
                        </div>

                        <div>
                            <p className="mb-2 font-medium text-gray-900">Spreadsheets</p>
                            <ul className="space-y-1">
                                <li>Excel (.xls, .xlsx)</li>
                                <li>CSV (.csv)</li>
                            </ul>
                        </div>

                        <div>
                            <p className="mb-2 font-medium text-gray-900">Images</p>
                            <ul className="space-y-1">
                                <li>JPEG (.jpg, .jpeg)</li>
                                <li>PNG (.png)</li>
                            </ul>
                        </div>

                        <div>
                            <p className="mb-2 font-medium text-gray-900">Other</p>
                            <ul className="space-y-1">
                                <li>PowerPoint (.ppt, .pptx)</li>
                                <li>ZIP (.zip)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t-2 border-[#E5E7EB] my-4 flex justify-end gap-4 pt-4">
                <Button
                    onClick={() => {
                        if (!setCurrentStep) return;
                        setCurrentStep(id + 1);
                    }}
                    text="Continue"
                    className="button-primary text-sm rounded-md"
                />
            </div>
        </div>
    );
};

export default FileUpload;