"use client";
import { useRouter } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";

const page = () => {
    const router =useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle className="w-8 h-8 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Panel Route
          </h2>

          <p className="text-gray-600 mb-4">
            This route will take you to the admin panel.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ Not Implemented Yet
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              The admin panel functionality is currently under development.
            </p>
          </div>
          <button onClick={()=>router.push('/')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Go to Home page
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
