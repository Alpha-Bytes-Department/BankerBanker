import PropertyCard from "@/components/PropertyCard";
import StatusCard from "@/components/StatusCard";
import { PropertyProps } from "@/types/sponsor";
import { FaPlus } from "react-icons/fa6";
import GMAP from "../../_components/GMAP";
import ChatCard from "@/components/ChatCard";
import RecentActivity from "../../(sponsor)/recent-activity/page";

const propertyData: PropertyProps[] = [
    {
        url: "/images/SponsorDashboard.png",
        title: "Downtown Office Complex",
        status: "active",
        location: "123 Business Ave, Chicago, IL 60601",
        loan_requested: "$500,000",
        loan_type: "Commercial",
        units: "10",
        quotes: "5"
    },
    {
        url: "/images/img2.jpg",
        title: "Downtown Office Complex",
        status: "active",
        location: "123 Business Ave, Chicago, IL 60601",
        loan_requested: "$750,000",
        loan_type: "Residential",
        units: "20",
        quotes: "8"
    },
    {
        url: "/images/img3.jpg",
        title: "Downtown Office Complex",
        status: "active",
        location: "123 Business Ave, Chicago, IL 60601",
        loan_requested: "750,000",
        loan_type: "Residential",
        units: "20",
        quotes: "8"
    }
];

const page = () => {




    return (
        <div>
            <h1 className="text-xl lg:text-2xl my-2">Sponsor Dashboard</h1>
            <p className="text-[#4A5565] my-2">Manage your commercial real estate portfolio and generate professional offering memorandums</p>
           {/* status card  */}
            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-5 lg:gap-7 xl:gap-10 my-10">
                <StatusCard type="Properties" data={{ value: 3, status: 2 }} />
                <StatusCard type="quotes" data={{ value: 20, status: 12 }} />
                <StatusCard type="documents" data={{ value: 156 }} />
                <StatusCard type="value" data={{ value: 3, }} />
            </div>
             {/* google map  */}
            <div className="my-5">
                <GMAP />
            </div>
            
            <div className="flex flex-col-reverse xl:flex-row gap-5">
                <div className=" rounded-xl bg-white p-3 lg:p-5 border border-[#0000001A] flex-1">
                    <div className="flex items-center gap-2 lg:justify-between">
                        <div className="grow">
                            <h1 className="text-lg">Property Portfolio</h1>
                            <p className="text-[#6A7282]">Manage and track your properties</p>
                        </div>
                        <div className="flex gap-2 button-primary rounded-full py-2 px-3 cursor-pointer justify-center items-center">
                            <FaPlus className="hidden md:flex" />
                            <button className="text-xs sm:text-sm lg:text-base">Add property</button>
                        </div>
                    </div>
                    {/* property block  */}
                    <div className="my-10 flex flex-col gap-5">
                        {propertyData.map((property, index) => (
                            <PropertyCard key={index} data={property} />
                        ))}
                    </div>
                </div>
                {/* notification block  */}
                <div className="flex flex-col lg:flex-row xl:flex-col gap-10 mx-auto">
                    <div className="flex flex-col items-center gap-5">
                        <ChatCard type="message" link="/message" />
                        <ChatCard type="aiChat" />
                    </div>
                    <RecentActivity />
                </div>
            </div>
        </div>
    );
};

export default page;