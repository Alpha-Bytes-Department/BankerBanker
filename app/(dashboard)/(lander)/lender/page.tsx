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

// Sample marker data for GMAP

const customIcons = {
    red: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    blue: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    green: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
};

const markers = [
    { id: 1, position: { lat: 40.6892, lng: -74.0445 }, title: 'Statue of Liberty', color: 'red', icon: customIcons.red },
    { id: 2, position: { lat: 40.7484, lng: -73.9857 }, title: 'Empire State Building', color: 'red', icon: customIcons.red },
    { id: 3, position: { lat: 40.7580, lng: -73.9855 }, title: 'Times Square', color: 'red', icon: customIcons.red },
    { id: 4, position: { lat: 40.7794, lng: -73.9632 }, title: 'The Met Museum', color: 'blue', icon: customIcons.blue },
    { id: 5, position: { lat: 40.7530, lng: -73.9772 }, title: 'Grand Central Terminal', color: 'blue', icon: customIcons.blue },
    { id: 6, position: { lat: 40.7052, lng: -73.9967 }, title: 'Brooklyn Bridge', color: 'blue', icon: customIcons.blue },
    { id: 7, position: { lat: 40.7115, lng: -74.0126 }, title: '9/11 Memorial', color: 'blue', icon: customIcons.blue },
    { id: 8, position: { lat: 40.7648, lng: -73.9723 }, title: 'Central Park (South)', color: 'green', icon: customIcons.green },
    { id: 9, position: { lat: 40.7466, lng: -74.0055 }, title: 'High Line Park', color: 'green', icon: customIcons.green },
    { id: 10, position: { lat: 40.8504, lng: -73.8763 }, title: 'The Bronx Zoo', color: 'green', icon: customIcons.green },
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
               
            </div>
        </div>
    );
};

export default page;