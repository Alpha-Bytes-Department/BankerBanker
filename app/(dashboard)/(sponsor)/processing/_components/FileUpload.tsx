import { useState } from "react";
import Button from "@/components/Button";
import { Upload, Lightbulb, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/Provider/api";

type FileUploadProps = {
    id: number;
    title?: string;
    description?: string;
    setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
    propertyId: number | null;
};

const FileUpload = ({
    id,
    title,
    description,
    setCurrentStep,
    propertyId,
}: FileUploadProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
            setError(null);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleContinue = async () => {
        if (!setCurrentStep) return;

        // Skip upload step if no files selected
        if (files.length === 0) {
            setCurrentStep(id + 1);
            return;
        }

        if (!propertyId) {
            setError("Property ID is missing.");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            //  API expects "files" as the form field key
            files.forEach((file) => formData.append("files", file));

            const response = await api.post(
                `/api/properties/${propertyId}/documents/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // API returns { success: true, statusCode: 201, message: "...", data: [...] }
            if (response?.data?.success) {
                console.log("checking response",response)
                toast.success(response.data.message || "Files uploaded successfully");
                setCurrentStep(id + 1);
            }

        } catch (err: any) {
            const apiError =
                err?.response?.data?.message ||
                err?.response?.data?.errors ||
                err?.message ||
                "Something went wrong.";
            setError(typeof apiError === "string" ? apiError : JSON.stringify(apiError));
            toast.error("Upload failed. Please try again.");
            console.error("Upload error:", err?.response?.data);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6 mt-6 p-5 pb-16 border border-[#E5E7EB] rounded-lg shadow-lg">
            <div>
                <h1 className="text-xl">Step {id + 1} : {title}</h1>
                <p className="text-[#4A5565]">{description}</p>
            </div>

            {/* File upload input */}
            <div className="w-full mx-auto">
                <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#D1D5DC] bg-white p-10 text-center cursor-pointer hover:bg-gray-50 transition"
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
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            </div>

            {/* Selected files list */}
            {files.length > 0 && (
                <ul className="space-y-2">
                    {files.map((file, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="truncate max-w-xs">{file.name}</span>
                                <span className="text-gray-400 text-xs">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className="text-gray-400 hover:text-red-500 transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Inline error message */}
            {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                    {error}
                </p>
            )}

            <div>
                {/* Recommendations */}
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

                {/* File type suggestions */}
                <div className="w-full border-t-2 border-[#E5E7EB] mt-4 pt-4">
                    <button className="mb-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                        See supported file types
                    </button>
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
                    onClick={handleContinue}
                    text={isUploading ? "Uploading..." : "Continue"}
                    isDisabled={isUploading}
                    className="button-primary text-sm rounded-md"
                />
            </div>
        </div>
    );
};

export default FileUpload;