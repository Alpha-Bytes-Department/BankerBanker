"use client";
import Button from '@/app/components/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";
import { FaCircleUser, FaHandshakeSimple } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { BsBank, BsGraphUpArrow } from "react-icons/bs";
import { BiSolidContact } from "react-icons/bi";


type NavbarProps = {
    links?: { text: string; href: string }[];
    className?: string;
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
            text: 'Home',
            href: '#home',
            icon: <FaHome className='text-lg' />
        },
        {
            text: 'Sponsor',
            href: '#sonsor',
            icon: <FaHandshakeSimple className='text-lg' />
        },
        {
            text: 'Lender',
            href: '#lender',
            icon: <BsBank className='text-lg' />

        },
        {
            text: 'Broker',
            href: '#broker',
            icon: <BsGraphUpArrow className='text-lg' />
        },
        {
            text: 'Contact',
            href: '#contact',
            icon: <BiSolidContact className='text-lg' />
        },
    ];


const Navbar = ({
    className = "",
}: NavbarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);




    return (
        <>
            {/* nav for desktop  */}
            <nav className={`flex justify-between items-center px-5 lg:px-8 py-3 sticky top-0 z-30 bg-white ${className}`}>
                <div>
                    <Image src={"/BANCre.png"} alt={'logo'} width={150} height={50} className='hidden lg:flex' />
                    <RxHamburgerMenu onClick={() => setIsMenuOpen(true)} className='text-xl flex lg:hidden' />
                </div>
                <div className='hidden lg:flex gap-5 '>
                    {Links && Links.map((link, idx) => <Link key={idx} href={link.href}>{link.text}</Link>)}
                </div>
                <div className='flex gap-5 items-center'>
                    {userData ? (<></>) : <Button text='Sign in' className='button-none hidden lg:flex' />}
                    <Button text='Get Started Free' className='button-primary' />
                </div>
            </nav>
            {/* navbar for mobile */}
            <nav className={`fixed inset-0 z-40 bg-black/70 bg-opacity-50 transition-opacity md:hidden ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMenuOpen(false)}>
                {/* Mobile Sidebar */}
                <div
                    className={`fixed top-0 left-0 h-full w-4/5 max-w-sm z-50 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`} >
                    <div className="flex flex-col h-full">
                        {/* Mobile Menu Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            {/* Logo Section */}
                            <div className="shrink-0">
                                <a href="#">
                                    <Image src={"/BANCre.png"} alt="logo" width={150} height={50} />
                                </a>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500  rounded-md hover:bg-gray-100 " aria-label="Close menu">
                                <MdClose className="h-6 w-6" />
                            </button>
                        </div>
                        {/* Mobile Navigation Links */}
                        <nav className="grow p-4">
                            <div className="flex flex-col space-y-2">
                            {Links && Links.map((link, idx) => <div className={`flex items-center gap-5 py-2 px-5 rounded-lg ${link.href === "#home"? "button-primary" : ""}`} key={idx}>{link.icon && <span>{link.icon}</span>}<Link href={link.href}>{link.text}</Link></div>)}
                            </div>
                        </nav>
                        {/* Mobile Footer */}
                        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                            {userData ? <><Link href="#" className="rounded-full shadow-sm">
                                <FaCircleUser title={userData?.first_name} className="h-10 w-10" />   
                            </Link> 
                            <Button text='Log out' className='button-primary w-full ' /></> : <><Button text='Log in' className='button-primary w-full ' /> <Button text='Sign up' className='button-primary w-full ' /></>}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;