"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import { BiSolidContact } from "react-icons/bi";
import Button from '@/components/Button';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CiGrid42, CiSearch, CiSettings } from "react-icons/ci";
import { FiFileText, FiLogOut, FiUpload } from "react-icons/fi";
import { FaRegChartBar } from "react-icons/fa";



type NavbarProps = {
    links?: { text: string; href: string }[];
    children?: React.ReactNode;
}

type LinkProps = {
    text: string;
    href: string;
    icon?: React.ReactNode;
}[];

type UserData = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
};

const Links: LinkProps = [
    {
        text: 'Sponsor Dashboard',
        href: '/sponsor',
        icon: <CiGrid42  className='text-lg' />
    },
    {
        text: 'Docview & AI Analytics',
        href: '/analytics',
        icon: <CiSearch className='text-lg' />
    },
    {
        text: 'Offering Memorandum',
        href: '/memorandum',
        icon: <FiFileText  className='text-lg' />

    },
    {
        text: 'Document Processing',
        href: '/processing',
        icon: <FiUpload  className='text-lg' />
    },
    {
        text: 'Loan Quotes',
        href: '/loan',
        icon: <FaRegChartBar className='text-lg' />
    },
];


const DashboardNavigation = ({
    children
}: NavbarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [userData, setUserData] = useState<UserData | null>({
        id: '1',
        email: 'john@example.com',
        first_name: 'John',
        last_name: 'Doe'
    });
    const pathName = usePathname();




    return (
        <nav className='flex items-start'>
            <div className={`fixed top-0 left-0 h-screen w-72 z-50 bg-black shadow-xl transform transition-transform duration-300 ease-in-out  ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`} >
                <div className="flex flex-col h-full">
                    {/* Menu Header */}
                    <div className="flex items-center justify-between p-4">
                        {/* Logo Section */}
                        <div className="shrink-0 px-7 py-1">
                            <a href="#">
                                <Image src={"/White_BANCre.png"} alt="logo" width={120} height={50} />
                            </a>
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500  rounded-md hover:bg-gray-100 md:hidden" aria-label="Close menu">
                            <MdClose className="h-6 w-6" />
                        </button>
                    </div>
                    <div className='text-white flex gap-5 px-8 py-3 items-center border-y border-[#314158]'>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className='overflow-y-hidden' title={userData?.first_name + " " + userData?.last_name}>{userData?.first_name + " " + userData?.last_name}</p>
                            <p className='overflow-y-hidden' title={userData?.email}>{userData?.email}</p>
                        </div>
                    </div>
                    {/* Navigation Links */}
                    <nav className="grow p-4">
                        <div className="flex flex-col space-y-2 text-white">
                            {Links && Links.map((link, idx) => <div className={`flex items-center gap-5 py-2 px-5 rounded-lg cursor-pointer ${link.href === pathName ? "button-primary" : ""}`} key={idx}>{link.icon && <span>{link.icon}</span>}<Link href={link.href}>{link.text}</Link></div>)}
                        </div>
                    </nav>
                    {/* Mobile Footer */}
                    <div className="p-4 border border-[#314158] flex flex-col gap-2  text-white">
                        <div className={`flex items-center gap-5 py-2 px-5 rounded-lg cursor-pointer ${pathName === "/settings" ? "button-primary" : ""}`}><CiSettings className='text-lg'/><Link href={"/settings"}>Settings</Link></div>
                        <div className={`flex items-center gap-5 py-2 px-5 rounded-lg cursor-pointer `}><FiLogOut className='text-lg'/><span >Logout</span></div>
                    </div>
                </div>
            </div>
            {/* top section with children*/}
            <div className='flex-1 flex flex-col md:ml-72 min-h-screen'>
                <div className={` flex justify-between items-center px-5 lg:px-8 py-3 sticky top-0 z-30 bg-white border-b border-[#314158] text-black `}>
                    <div>
                        <div className='hidden lg:flex' >
                            Sponsor Dashboard
                        </div>
                        <RxHamburgerMenu onClick={() => setIsMenuOpen(true)} className='text-xl flex lg:hidden' />
                    </div>
                    <div className='flex items-center gap-5 bg-[#0D4DA5] text-white  px-4 py-2 rounded-full'>
                        Sponsor
                    </div>
                    <div className='flex gap-5 items-center'>
                        notifications
                    </div>
                </div>
                {/* main content  */}
                <div className='flex-1 overflow-y-auto px-5 py-2'>
                    {children}
                </div>
            </div>
        </nav>
    );
};

export default DashboardNavigation;