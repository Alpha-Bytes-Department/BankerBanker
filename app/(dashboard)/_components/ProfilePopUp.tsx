'use client'
import Button from "@/components/Button";
import { GoPerson } from "react-icons/go";
import {
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image";
import { BsBuildings } from "react-icons/bs";
import { FiShield } from "react-icons/fi";
import { useState } from "react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CompanyInfo from "./CompanyInfo";

const options = [
    {
        title: "Profile",
        icon: <GoPerson className="text-lg"/>
    },
    {
        title: "Company",
        icon: <BsBuildings className="text-lg"/>
    },
    {
        title: "Security",
        icon: <FiShield className="text-lg" />
    }
]

const ProfilePopUp = () => {
    const [selectedOption, setSelectedOption] = useState("Profile");
    let subsection;
     switch(selectedOption){
        case "Profile":
            subsection = <ProfileInfo/>
            break;
        case "Company":
            subsection = <CompanyInfo/>
            break;
        case "Security":
            subsection = <ChangePassword/>
            break;
        default:
            subsection = <ProfileInfo/>
    }

    return (
        <DialogContent className="max-w-[350px] sm:max-w-[425px] lg:max-w-[550px] xl:max-w-[750px] bg-white rounded-xl border-0 outline-0 p-0">
            <DialogHeader className="bg-[#0D4DA5] text-white p-3 lg:p-5  rounded-xl flex lg:flex-row items-center">
                <DialogTitle>
                    <Image src={"/images/img2.jpg"} alt="profile" width={100} height={100} className="object-center object-cover rounded-full h-12 w-12 lg:h-20 lg:w-20" />
                </DialogTitle>
                <div>
                    <p className="text-xl">John Doe</p>
                    <p>Managing Partner at Acme Properties LLC</p>
                </div>
            </DialogHeader>
            <div className="px-2 lg:px-5">
                <div className={`inline-flex items-center gap-1 md:gap-3 lg:gap-5 bg-[#ECECF0] rounded-full`}>{options.map((option)=><div onClick={()=>setSelectedOption(option.title)} key={option.title} className={`flex flew-row items-center gap-1 cursor-pointer py-2 px-3 ${selectedOption === option.title && "bg-primary text-white px-2 py-1 rounded-full"}`}>
                    <span>{option.icon}</span>
                    {option.title}
                </div>)}</div>
                {/* option are rander here  */}
                <div>
                    {subsection}
                </div>
            </div>
            <DialogFooter className="p-5">
                <DialogClose asChild>
                    <Button text="Cancel" className="button-outline" />
                </DialogClose>
                <Button text="Save Changes" type="submit" className="button-primary" />
            </DialogFooter>
        </DialogContent>

    );
};

export default ProfilePopUp;