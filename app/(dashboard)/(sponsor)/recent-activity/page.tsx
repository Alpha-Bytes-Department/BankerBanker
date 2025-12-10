import { FaDollarSign } from "react-icons/fa6";
import { LuCircleCheckBig } from "react-icons/lu";
import { IoIosStarOutline } from "react-icons/io";
import { LuMessageCircle } from "react-icons/lu";
import Link from "next/link";

const recentActivityData = [
    {
        id: 1,
        logo: <FaDollarSign />,
        iconColor: "#00A63E",
        iconDivColor: "bg-[#DCFCE7]",
        title: "New Quote Received",
        description: "Argentic Capital submitted a quote based on Financial_Statements_Q3_2024.pdf",
        time: "2 hours ago"
    },
    {
        id: 2,
        logo: <LuCircleCheckBig />,
        iconColor: "#155DFC",
        iconDivColor: "bg-[#DBEAFE]",
        title: "Document Processed",
        description: "AI analysis completed for Property_Appraisal_Downtown.xlsx - 2 quotes generated",
        time: "5 hours ago"
    },
    {
        id: 3,
        logo: <IoIosStarOutline />,
        iconColor: "#D08700",
        iconDivColor: "bg-[#FEF9C2]",
        title: "Quote Updated",
        description: "Prime Commercial revised their quote - rate reduced to SOFR + 3.85%",
        time: "1 day ago"
    },
    {
        id: 4,
        logo: <LuMessageCircle />,
        iconColor: "#F54900",
        iconDivColor: "bg-[#FFEDD4]",
        title: "Lender Message",
        description: "Capital Bank requested additional documents for quote finalization",
        time: "2 days ago"
    }
];

export default function RecentActivity() {
    return (
        <div className="bg-[#FFFFFF] border border-[#0000001A] rounded-lg max-w-[450px] px-8 py-6">
            <h1 className="text-[#101828] text-2xl font-semibold">Recent Activity</h1>
            {
                recentActivityData.map(item => (
                    <div key={item.id} className="flex gap-5 mt-6">
                        <div className={`${item.iconDivColor} flex items-center justify-center w-16 h-9 rounded-lg`}>
                            {item.logo}
                        </div>
                        <div>
                            <h1 className="font-medium text-[#101828] text-xl">{item.title}</h1>
                            <p className="text-[#4A5565] text-sm">{item.description}</p>
                            <p className="text-[#6A7282] text-sm">{item.time}</p>
                        </div>
                    </div>
                ))
            }
            <div className="flex items-center justify-center mt-8">
                <Link href="" className="text-[#155DFC]">View All Activity</Link>
            </div>
        </div>
    );
}




