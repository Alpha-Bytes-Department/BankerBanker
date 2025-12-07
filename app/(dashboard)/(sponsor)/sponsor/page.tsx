import PropertyCard from "@/components/PropertyCard";
import StatusCard from "@/components/StatusCard";
import { PropertyProps } from "@/types/sponsor";





const page = () => {

    const propertyData:PropertyProps = {
        url: "/images/SponsorDashboard.png",
        title: "Downtown Office Complex",
        status: "Active",
        location: "123 Business Ave, Chicago, IL 60601",
        loan_requested: "500,000",
        loan_type: "Fixed",
        units: "10",
        quotes: "5"
    };


    return (
        <div>
            <PropertyCard data={propertyData}/>
            <StatusCard type="Properties" />
        </div>
    );
};

export default page;