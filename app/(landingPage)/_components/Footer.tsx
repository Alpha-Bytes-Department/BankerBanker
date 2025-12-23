
"use client";
import Image from "next/image";
import Link from "next/link";
import { FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa6";



export default function Footer() {
    return (
        <footer className="bg-[#000000] py-12 px-4 font-inter border-t border-gray-200">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <div className="col-span-2 space-y-4">
                    <div className="flex items-center space-x-2">
                        <Link href="/"><Image src={"/logo/BANCre.png"} alt={'logo'} width={150} height={50} className='hidden lg:flex' /></Link>
                    </div>
                    <div>
                        <p className="text-[#9CA3AF] text-sm leading-relaxed">
                            Transforming commercial real estate financing with
                        </p>
                        <p className="text-[#9CA3AF] text-sm leading-relaxed">
                            AI- powered document analysis and lender connections.
                        </p>
                    </div>
                    <div className="flex space-x-8 pt-2">
                        <a
                            href="#"
                            className="text-gray-500 hover:text-blue-600 transition-transform transform hover:scale-110"
                        >
                            <FaLinkedin className="text-xl" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-500 hover:text-blue-600 transition-transform transform hover:scale-110"
                        >
                            <FaTwitter className="text-xl" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-500 hover:text-blue-600 transition-transform transform hover:scale-110"
                        >
                            <FaYoutube className="text-xl" />
                        </a>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[#FFFFFF]">
                        Quick Links
                    </h3>
                    <ul className="space-y-3">
                        <li>
                            <a
                                href="#"
                                className="text-[#9CA3AF] hover:text-blue-600 transition-colors duration-300"
                            >
                                Features
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-[#9CA3AF] hover:text-blue-600 transition-colors duration-300"
                            >
                                Pricing
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-[#9CA3AF] hover:text-blue-600 transition-colors duration-300"
                            >
                                About
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-[#9CA3AF] hover:text-blue-600 transition-colors duration-300"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[#FFFFFF]">
                        Legal
                    </h3>
                    <ul className="space-y-3">
                        <li>
                            <a
                                href="#"
                                className="text-[#9CA3AF] hover:text-blue-600 transition-colors duration-300"
                            >
                                Terms of Service
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-[#9CA3AF] hover:text-blue-600 transition-colors duration-300"
                            >
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-[#9CA3AF] hover:text-blue-600 transition-colors duration-300"
                            >
                                Cookie Policy
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="text-[#9CA3AF] hover:text-blue-600 transition-colors duration-300"
                            >
                                Security
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="text-center text-[#9CA3AF] text-sm pt-10 mt-10 border-gray-200">
                <p>
                    &copy; {new Date().getFullYear()} BANCRE CORPORATION. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

