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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { BsBuildings } from "react-icons/bs";
import { FiShield } from "react-icons/fi";
import { useState, useRef, useCallback } from "react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CompanyInfo from "./CompanyInfo";
import { User } from "@/types/auth";
import api from "@/Provider/api";
import { toast } from "sonner";

const options = [
    {
        title: "Profile",
        icon: <GoPerson className="text-lg" />
    },
    {
        title: "Company",
        icon: <BsBuildings className="text-lg" />
    },
    {
        title: "Security",
        icon: <FiShield className="text-lg" />
    }
]

const ProfilePopUp = (user: User | null) => {
    const [selectedOption, setSelectedOption] = useState("Profile");
    const [profileData, setProfileData] = useState<any>(null);
    const [companyData, setCompanyData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const closeDialogRef = useRef<HTMLButtonElement>(null);

    const handleDataChange = useCallback((data: any) => {
        if (data.profile) {
            setProfileData(data.profile);
        }
        if (data.company) {
            setCompanyData(data.company);
        }
        if (data.profileImage) {
            setProfileData(prev => ({ ...prev, profileImage: data.profileImage }));
        }
    }, []);

    let subsection;
    switch (selectedOption) {
        case "Profile":
            subsection = <ProfileInfo user={user} onDataChange={handleDataChange} />
            break;
        case "Company":
            subsection = <CompanyInfo user={user} onDataChange={handleDataChange} />
            break;
        case "Security":
            subsection = <ChangePassword />
            break;
        default:
            subsection = <ProfileInfo user={user} onDataChange={handleDataChange} />
    }

    // Implement profile update logic here
    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Create FormData for file upload
            const formDataToSend = new FormData();

            if (profileData) {
                formDataToSend.append('first_name', profileData.first_name || '');
                formDataToSend.append('last_name', profileData.last_name || '');
                formDataToSend.append('email', profileData.email || '');
                formDataToSend.append('phone', profileData.phone || '');

                // Add file if it exists
                if (profileData.profileFile && profileData.profileFile instanceof File) {
                    formDataToSend.append('profile_photo', profileData.profileFile);
                }
            }

            if (companyData) {
                formDataToSend.append('company_information', JSON.stringify({
                    company_name: companyData.company_name,
                    position: companyData.position,
                    street_address: companyData.street_address,
                    city: companyData.city,
                    state: companyData.state,
                    zip_code: companyData.zip_code
                }));
            }

            console.log("checking form data......", formDataToSend);



            const response = await api.patch(`/api/accounts/profile/`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data?.message || 'Failed to update profile');
            }

            // Set success message
            setSuccess('Profile updated successfully!');
            toast.success('Profile updated successfully!');
            // Reset data after successful update
            setProfileData(null);
            setCompanyData(null);

            // Close dialog after 2 seconds
            setTimeout(() => {
                if (closeDialogRef.current) {
                    closeDialogRef.current.click();
                }
            }, 2000);
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    }


    const rawBase = process.env.NEXT_PUBLIC_BASE_URL || "";
    const imageSrc = user?.profile_photo
        ? `${rawBase.replace(/\/$/, "")}/${user.profile_photo.replace(/^\//, "")}`
        : null;

    return (
        <DialogContent aria-describedby="profile-description" className="max-w-[350px] sm:max-w-[425px] lg:max-w-[550px] xl:max-w-[750px] bg-white rounded-xl border-0 outline-0 p-0">
            <DialogHeader className="bg-[#0D4DA5] text-white p-3 lg:p-5  rounded-xl flex lg:flex-row items-center">
                <DialogTitle>
                    {imageSrc ? (
                        <Avatar className="h-10 w-10 lg:h-16 lg:w-16">
                            <AvatarImage
                                src={process.env.NEXT_PUBLIC_BASE_URL + (user?.profile_photo || "")}
                                alt="profile"
                            />
                        </Avatar>
                    ) : (
                        <div className="flex items-center justify-center rounded-full bg-white h-12 w-12 lg:h-20 lg:w-20">
                            <GoPerson className="text-[#0D4DA5] text-lg lg:text-2xl" />
                        </div>
                    )}
                </DialogTitle>
                <div>
                    <p className="text-xl">{user?.first_name} {user?.last_name}</p>
                    <p>{user?.company_information?.position || "position"} at {user?.company_information?.company_name || "company name"}</p>
                </div>
            </DialogHeader>
            <div className="px-2 lg:px-5">
                <div className={`inline-flex items-center gap-1 md:gap-3 lg:gap-5 bg-[#ECECF0] rounded-full ${loading ? 'opacity-50 pointer-events-none' : ''}`}>{options.map((option) => <div onClick={() => !loading && setSelectedOption(option.title)} key={option.title} className={`flex flew-row items-center gap-1 ${!loading ? 'cursor-pointer' : 'cursor-not-allowed'} py-2 px-3 ${selectedOption === option.title && "bg-primary text-white px-2 py-1 rounded-full"}`}>
                    <span>{option.icon}</span>
                    {option.title}
                </div>)}</div>
                {/* option are rander here  */}
                <div className={`${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {subsection}
                </div>
                {loading && (
                    <div className="text-center mt-3 p-3 bg-blue-50 rounded">
                        <p className="text-blue-600 text-sm font-medium">Processing your changes...</p>
                    </div>
                )}
                {success && (
                    <div className="text-green-600 text-sm mt-3 p-3 bg-green-50 rounded">
                        <p className="font-medium">{success}</p>
                    </div>
                )}
                {error && (
                    <div className="text-red-500 text-sm mt-3 p-2 bg-red-50 rounded">
                        {error}
                    </div>
                )}
            </div>
            <DialogFooter className={`p-5 ${selectedOption === "Security" ? "hidden" : ""}`}>
                <DialogClose asChild>
                    <button ref={closeDialogRef} style={{ display: 'none' }} />
                </DialogClose>
                <DialogClose asChild disabled={loading}>
                    <Button text="Cancel" className="button-outline" isDisabled={loading} />
                </DialogClose>
                <Button
                    text={loading ? "Processing..." : "Save Changes"}
                    onClick={handleUpdateProfile}
                    type="button"
                    className="button-primary"
                    isDisabled={loading}
                />
            </DialogFooter>
        </DialogContent>

    );
};

export default ProfilePopUp;