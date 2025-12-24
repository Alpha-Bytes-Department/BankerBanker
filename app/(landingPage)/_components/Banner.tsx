// src/app/_components/Banner.tsx
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  Download,
  MessageCircle,
  ArrowLeft,
  FileText,
  Home,
  FileCheck,
  FolderOpen,
  DollarSign,
  Badge,
  ArrowRight,
} from "lucide-react";

const Banner = () => {
  return (
    <div className="relative w-full h-screen min-h-[800px] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `
            linear-gradient(
              255.49deg,
              rgba(0, 0, 0, 0) -2%,
              rgba(0, 0, 0, 0.54) 58.53%
            ),
            url('/images/banner-img.png')
          `,
        }}
      />

      {/* Hero Text Content - Fully readable on top */}
      <div className="relative z-10 flex flex-col justify-center items-start h-full px-8 lg:px-16 xl:px-32 text-white pointer-events-none">
        <div className="max-w-7xl w-full">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight drop-shadow-2xl">
            Your Banker for Commercial Real Estate Powered by AI
          </h1>
          <p className="mt-6 text-lg sm:text-xl lg:text-2xl max-w-4xl opacity-95 drop-shadow-lg">
            Loan Origination, Brokerage and Capital Markets. Faster, Cheaper, Smarter. 
            Create perfect documents in minutes, every time. Let AI handle the paperwork 
            while you build your dreams.
          </p>
          <Button className="mt-10 bg-white text-black rounded-full px-8 py-6 text-lg font-medium hover:bg-gray-100 transition shadow-xl pointer-events-auto">
            VIEW TRANSACTIONS <ArrowRight className="ml-4 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Dashboard Overlay - Starts 20% from bottom, extends full width with no side gaps */}
      <div className="absolute  inset-x-0 top-30 h-[90%] pointer-events-none ">
        <div className="h-full pointer-events-auto flex flex-col">
          {/* Dashboard Card - Rounded top, full width, no side padding gaps */}
          <div className="h-full bg-white rounded-t-3xl lg:rounded-t-[40px] shadow-2xl flex flex-col lg:flex-row overflow-hidden">
            {/* Left Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-80 bg-black text-white flex-shrink-0">
              <div className="p-8 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold">BANCRe</h2>
                  <span className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">
                    F
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 px-6 pt-6 pb-8">
                {/* User Info */}
                <div className="flex items-center gap-4 mb-8">
                  <Avatar className="w-12 h-12 border-2 border-gray-600">
                    <AvatarFallback className="text-lg">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-400">john@example.com</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg bg-blue-600 text-white">
                    <Home className="w-5 h-5" />
                    <span>Sponsor Dashboard</span>
                  </a>
                  <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg bg-blue-900/50 text-white font-semibold">
                    <FileText className="w-5 h-5" />
                    <span>Docview & AI Analyst</span>
                  </a>
                  <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-800 transition">
                    <FolderOpen className="w-5 h-5" />
                    <span>Offering Memorandum</span>
                  </a>
                  <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-800 transition">
                    <FileCheck className="w-5 h-5" />
                    <span>Document Processing</span>
                  </a>
                  <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-800 transition relative">
                    <DollarSign className="w-5 h-5" />
                    <span>Loan Quotes</span>
                    <Badge className="absolute right-3 bg-blue-600 text-white text-xs px-2">12</Badge>
                  </a>
                </nav>
              </div>
            </aside>

            {/* Main Dashboard Area - Full width, no side gaps */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="lg:hidden">
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                      <h1 className="text-xl font-semibold">Document Viewer & AI Analyst</h1>
                      <p className="text-sm text-gray-500">Review documents and get AI-powered insights</p>
                    </div>
                  </div>

                  {/* Center */}
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">
                      Sponsor
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full px-6 border-gray-300">
                      Lender
                    </Button>
                    <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                      F
                    </span>
                  </div>

                  {/* Right */}
                  <div className="flex justify-end">
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        8
                      </span>
                    </Button>
                  </div>
                </div>
              </header>

              {/* Main Body */}
              <main className="flex-1 flex flex-col lg:flex-row gap-8 p-8">
                {/* Documents List */}
                <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-medium text-lg">Documents</h2>
                    <Badge variant="secondary">9</Badge>
                  </div>

                  <div className="space-y-4 flex-1">
                    {[
                      { name: "Financial_Statements_Q3_2024.pdf", pages: 24, date: "10/20/2024", category: "Financial", active: true },
                      { name: "Property_Appraisal_Downtown.pdf", pages: 15, date: "10/19/2024", category: "Appraisal" },
                      { name: "Lease_Agreement_Unit_24.pdf", pages: 8, date: "10/23/2024", category: "Legal" },
                      { name: "Offering_Memorandum.pdf", pages: 24, date: "10/20/2025", category: "Memorandum" },
                      { name: "Property_Inspection_Report.pdf", pages: 15, date: "10/19/2025", category: "Inspection" },
                    ].map((doc, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border ${doc.active ? "bg-blue-50 border-blue-300 shadow-sm" : "bg-gray-50 border-transparent hover:bg-gray-100"} transition`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3 flex-1 min-w-0">
                            <FileText className="w-10 h-10 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{doc.name}</p>
                              <p className="text-xs text-gray-500 mt-1">{doc.pages} pages • {doc.date}</p>
                              <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full bg-gray-200 text-gray-700">
                                {doc.category}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="flex-shrink-0">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Preview + AI Analyst */}
                <div className="flex-1 flex flex-col lg:flex-row gap-8">
                  {/* Document Preview */}
                  <div className="flex-1 bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center justify-center">
                    <FileText className="w-32 h-32 text-gray-300 mb-8" />
                    <p className="text-xl font-medium text-gray-700">Document Preview</p>
                    <p className="text-sm text-gray-500 mt-3">
                      Viewing: <span className="font-medium">Financial_Statements_Q3_2024.pdf</span>
                    </p>
                  </div>

                  {/* AI Analyst Bubble */}
                  <div className="w-full lg:w-96 bg-white rounded-2xl shadow-sm p-6 relative">
                    <div className="flex items-center gap-3 mb-5">
                      <MessageCircle className="w-7 h-7 text-blue-600" />
                      <h3 className="font-semibold text-lg">AI Analyst</h3>
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-6 text-sm leading-relaxed">
                      Hello! I'm the Team AI Analyst. I've analyzed all uploaded documents for this deal. 
                      You can ask me questions about the property, financials, market conditions, or any specific details from the offering memorandum.
                    </div>
                    <div className="absolute top-14 -right-4 w-8 h-8 bg-gray-100 rotate-45" />
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;