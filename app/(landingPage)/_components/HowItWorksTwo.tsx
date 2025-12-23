"use client";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { FaAngleRight, FaBuilding, FaBuildingColumns, FaCheck } from "react-icons/fa6";

const howItWorksTwoData = [{
    id: 1,
    logo: FaBuilding,
    title: "For Sponsors",
    subtitle: `Manage properties, upload documents, generate offering memorandums, and connect 
    with the right lenders for your deals.`,
    property: [
        "Property portfolio management",
        "AI-powered document analysis",
        "Instant OM generation",
        "Lender quote comparison"
    ],
    buttonName: "Sponsor Sign Up",
    iconName: FaAngleRight
},
{
    id: 2,
    logo: FaBuildingColumns,
    title: "For Lenders",
    subtitle: `Access quality deals, query data with AI assistance, and submit competitive quotes 
    directly through our platform.`,
    property: [
        "Curated deal pipeline",
        "AI-powered deal analysis",
        "Direct quote submission",
        "Deal tracking & CRM"
    ],
    buttonName: "Lender Sign Up",
    iconName: FaAngleRight
}];

export default function HowItWorksTwo() {
    const router = useRouter();

    // Navigate to sign-up page
    const handleGoToSignUp = () => {
        router.push("/signup");
    }

    return (
        <div className="flex flex-col xl:flex-row items-center justify-center gap-20 px-4 py-16">
            {howItWorksTwoData.map(item => (
                // Card
                <div key={item.id} className="bg-[#F3F3F3] max-w-[550px] rounded-3xl p-12">
                    <div className="w-16 h-16 flex items-center justify-center bg-primary rounded-lg">
                        <item.logo className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-[#111827] text-2xl font-bold mt-5">{item.title}</h1>
                    <h1 className="text-[#4B5563] mt-5">{item.subtitle}</h1>
                    <div className="flex flex-col gap-3 mt-4">
                        {
                            item.property.map(prope => (
                                <div key={prope} className="flex items-center gap-2">
                                    <FaCheck />
                                    <p className="text-[#374151] text-sm">{prope}</p>
                                </div>
                            ))
                        }
                    </div>
                    <Button onClick={handleGoToSignUp} text={item.buttonName} arrow={true} className="button-primary w-full mt-5" />
                </div>
            ))}
        </div>
    );
}