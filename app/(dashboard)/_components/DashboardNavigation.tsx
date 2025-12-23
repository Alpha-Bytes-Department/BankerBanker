"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CiGrid42, CiSearch } from "react-icons/ci";
import {
  FiFileText,
  FiLogOut,
  FiMessageCircle,
  FiUpload,
} from "react-icons/fi";
import { FaRegChartBar } from "react-icons/fa";
import { IoBagHandleOutline } from "react-icons/io5";
import Notifications from "../(sponsor)/notifications/page";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProfilePopUp from "./ProfilePopUp";
import ChatWidget from "./ChatWidget";
import { MapPin, School } from "lucide-react";

type NavbarProps = {
  links?: { text: string; href: string }[];
  children?: React.ReactNode;
};

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

type UserRole = "Sponsor" | "Lender";

const sponsor: LinkProps = [
  {
    text: "Sponsor Dashboard",
    href: "/sponsor",
    icon: <CiGrid42 className="text-lg" />,
  },
  {
    text: "Docview & AI Analytics",
    href: "/analytics",
    icon: <CiSearch className="text-lg" />,
  },
  {
    text: "Offering Memorandum",
    href: "/memorandum",
    icon: <FiFileText className="text-lg" />,
  },
  {
    text: "Document Processing",
    href: "/processing",
    icon: <FiUpload className="text-lg" />,
  },
  {
    text: "Loan Quotes",
    href: "/loan",
    icon: <FaRegChartBar className="text-lg" />,
  },
  {
    text: "Message",
    href: "/message",
    icon: <FiMessageCircle className="text-lg" />,
  },
];

const lander: LinkProps = [
  {
    text: "Lender Dashboard",
    href: "/sponsor",
    icon: <CiGrid42 className="text-lg" />,
  },
  {
    text: "Loan Requests",
    href: "/loan-requests",
    icon: <FiFileText className="text-lg" />,
  },
  {
    text: "My Quotes",
    href: "/my-quotes",
    icon: <FaRegChartBar className="text-lg" />,
  },
  {
    text: "Property Map",
    href: "/property-map",
    icon: <MapPin size={18} />,
  },
  {
    text: "Market Analytics",
    href: "/market-analytics",
    icon: <FaRegChartBar className="text-lg" />,
  },
  {
    text: "Message",
    href: "/message",
    icon: <FiMessageCircle className="text-lg" />,
  },
];

const DashboardNavigation = ({ children }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [userData, setUserData] = useState<UserData | null>({
    id: "1",
    email: "john@example.com",
    first_name: "John",
    last_name: "Doe",
  });
  const pathName = usePathname();
  const [user, setUser] = useState<UserRole>("Sponsor");

  return (
    <nav className="flex items-start">
      <div
        className={`fixed top-0 left-0 h-screen w-72 z-50 bg-black shadow-xl transform transition-transform duration-300 ease-in-out  ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-center  flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4">
            {/* Logo Section */}
            <div className="shrink-0 px-7 py-1">
              <Link href="/">
                <Image
                  src={"/logo/White_BANCre.png"}
                  alt="logo"
                  width={120}
                  height={50}
                />
              </Link>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-500  rounded-md hover:bg-gray-100 md:hidden"
              aria-label="Close menu"
            >
              <MdClose className="h-6 w-6" />
            </button>
          </div>
          {/*---------- profile pop up -------------*/}
          <div className="text-white flex gap-5 px-8 py-3 items-center border-y border-[#314158] ">
            <div className="cursor-pointer">
              <Dialog>
                <DialogTrigger asChild>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DialogTrigger>
                <ProfilePopUp />
              </Dialog>
            </div>
            <div>
              <p
                className="overflow-y-hidden"
                title={userData?.first_name + " " + userData?.last_name}
              >
                {userData?.first_name + " " + userData?.last_name}
              </p>
              <p className="overflow-y-hidden" title={userData?.email}>
                {userData?.email}
              </p>
            </div>
          </div>
          {/* Navigation Links */}
          <nav className="grow p-4">
            <div className="flex flex-col space-y-2 text-white">
              {user === "Lender"
                ? lander.map((link, idx) => (
                    <div
                      className={`flex items-center gap-5 py-2 px-5 rounded-lg cursor-pointer ${
                        link.href === pathName ? "button-primary" : ""
                      }`}
                      key={idx}
                    >
                      {link.icon && <span>{link.icon}</span>}
                      <Link href={link.href}>{link.text}</Link>
                    </div>
                  ))
                : sponsor.map((link, idx) => (
                    <div
                      className={`flex items-center gap-5 py-2 px-5 rounded-lg cursor-pointer ${
                        link.href === pathName ? "button-primary" : ""
                      }`}
                      key={idx}
                    >
                      {link.icon && <span>{link.icon}</span>}
                      <Link href={link.href}>{link.text}</Link>
                    </div>
                  ))}
            </div>
          </nav>
          {/* bottom */}
          <div className="p-4 border border-[#314158] flex flex-col gap-2  text-white">
            {/* <div className={`flex items-center gap-5 py-2 px-5 rounded-lg cursor-pointer ${pathName === "/settings" ? "button-primary" : ""}`}><CiSettings className='text-lg' /><Link href={"/settings"}>Settings</Link></div> */}
            <div
              className={`flex items-center gap-5 py-2 px-5 rounded-lg cursor-pointer `}
            >
              <FiLogOut className="text-lg" />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>
      {/* top section with children*/}
      <div className="flex-1 flex flex-col md:ml-72 min-h-screen">
        <div
          className={` flex justify-between items-center px-5 lg:px-8 py-3 sticky top-0 z-30 bg-white border-b border-[#E5E7EB] text-black `}
        >
          <div>
            <div className="hidden lg:flex">
              {user === "Lender"
                ? lander.map((Link) => {
                    if (Link.href === pathName) {
                      return Link.text;
                    }
                  })
                : sponsor.map((Link) => {
                    if (Link.href === pathName) {
                      return Link.text;
                    }
                  })}
            </div>
            <RxHamburgerMenu
              onClick={() => setIsMenuOpen(true)}
              className="text-xl flex lg:hidden"
            />
          </div>
          <div className="flex justify-center items-center gap-2 bg-[#0D4DA5] text-white  px-4 py-2 rounded-full cursor-pointer">
            {user === "Lender" ? (
              <>
                <School size={18} />
                <span>Lender</span>
              </>
            ) : (
              <>
                <IoBagHandleOutline className="text-lg" />
                <span>Sponsor</span>
              </>
            )}
          </div>
          {/*----------- notification -------- */}
          <Notifications />
        </div>
        {/* main content  */}
        <div className="flex-1 overflow-y-auto px-3 md:px-5 py-2 relative">
          {children}
          {pathName === "/message" || pathName === "/analytics" ? (
            <></>
          ) : (
            <ChatWidget />
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;
