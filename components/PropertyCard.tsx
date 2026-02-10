"use client";
import { PropertyProps } from "@/types/sponsor";
import Button from "./Button";
import { IoLocationOutline } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/navigation";

// type declaration 
type PropertyCardProps = {
    data: PropertyProps,
    size ?: "small" | "large"
}


const sizeStyles = {
    small: "w-[380px] lg:w-full xl:w-[438px] h-auto",
    large: "w-full h-auto"
}



const PropertyCard = ({
    data,
    size = "large"
}:PropertyCardProps) => {

    const router = useRouter();
    
    
    return (
        <div className={`border border-[#E5E7EB] rounded-lg flex flex-col gap-3 2xl:gap-5 ${sizeStyles[size]}`}>
            {/* image */}
            <div className="w-full h-48 relative">
                <Image src={data?.url || "/images/SponsorDashboard.png"} alt="property image" fill className="rounded-t-lg object-cover object-center"/>
            </div>
            {/* details  */}
            <div className="p-3 2xl:p-5">
                <div className="flex justify-between items-center my-2">
                    <h1 className="text-lg">{data?.title}</h1>
                    <span className="bg-[#00A63E] text-white py-2 px-3 rounded-full">{data?.status}</span>
                </div>
                <div className="text-[#4A5565] flex items-center gap-2">
                    <IoLocationOutline className="text-lg"/>
                    <span>{data?.location}</span>
                </div>
                <div className="flex flex-wrap justify-between gap-3 mt-4">
                    <div className="flex flex-col col-span-2 gap-2">
                        <span className="text-sm text-[#6A7282]">Loan Request</span>
                        <span>$ {data?.loan_requested}</span>
                    </div>
                    <div className="flex flex-col col-span-2 gap-2">
                        <span className="text-sm text-[#6A7282]">Loan Type</span>
                        <span>{data?.loan_type}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-[#6A7282]">Units</span>
                        <span>{data?.units}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm text-[#6A7282]">Quotes</span>
                        <span>{data?.quotes}</span>
                    </div>                                  
                    
                </div>
                <div className="flex justify-between items-center mt-4">      
                    <Button text="View Document" size="medium" onClick={()=>router.push("/memorandum/1")} />
                    <Button text="View Quotes" size="medium" className="button-outline" onClick={()=>router.push("/loan")} />
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;

                    