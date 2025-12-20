import { CheckCircle } from "lucide-react";

const SubmitSuccess = () => {
  return (
    <div className="flex items-center justify-center p-5 pb-16 mt-20">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          Submission Successful
        </h2>

        <p className="mb-6 text-sm text-gray-600">
          Your information has been submitted successfully.  
          We’ll review it and get back to you shortly.
        </p>

        <button className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 transition">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SubmitSuccess;
