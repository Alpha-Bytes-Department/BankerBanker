import { PropertyProps } from "@/types/sponsor";
import Button from "./Button";
import { IoLocationOutline } from "react-icons/io5";
import Image from "next/image";
import { FiDollarSign } from "react-icons/fi";


// type declaration 
type PropertyCardProps = {
    data: PropertyProps,
    size ?: "small" | "large"
}


const sizeStyles = {
    small: "w-[438px] h-auto",
    large: "w-full md: xl:w-[893px] h-auto"
}



const PropertyCard = ({
    data,
    size = "large"
}:PropertyCardProps) => {

    
    return (
        <div className={`border border-[#E5E7EB] rounded-lg flex flex-col gap-5 lg:gap-10 ${sizeStyles[size]}`}>
            {/* image */}
            <div className="w-full h-48 relative">
                <Image src={data?.url || "/images/SponsorDashboard.png"} alt="property image" fill className="rounded-t-lg object-cover object-center"/>
            </div>
            {/* details  */}
            <div className="p-2 lg:p-5">
                <div className="flex justify-between items-center my-2">
                    <h1 className="text-lg">{data?.title}</h1>
                    <span className="bg-[#00A63E] text-white py-2 px-3 rounded-full">{data?.status}</span>
                </div>
                <div className="text-[#4A5565] flex items-center gap-2">
                    <IoLocationOutline className="text-lg"/>
                    <span>{data?.location}</span>
                </div>
                <div className="grid grid-cols-3 gap-5 mt-4">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-[#6A7282]">Loan Request</span>
                        <span>$ {data?.loan_requested}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-[#6A7282]">Loan Type</span>
                        <span>{data?.loan_type}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-[#6A7282]">Units</span>
                        <span>{data?.units}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2">
                        <FiDollarSign className="text-lg text-[#00A63E]" />
                        <span className="text-[#4A5565]">{data?.quotes} quotes</span>
                    </div>
                    <div className="flex gap-2">
                        <Button text="View Document" />
                        <Button text="View Quotes" className="button-outline" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;