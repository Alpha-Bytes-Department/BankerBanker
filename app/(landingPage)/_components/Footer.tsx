"use client";
import React from "react";

const LinkedInIcon = ({ size = 24, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const TwitterIcon = ({ size = 24, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.594 0-6.492 2.901-6.492 6.492 0 .512.057 1.01.173 1.496-5.405-.271-10.187-2.86-13.387-6.795-.56.96-.883 2.077-.883 3.256 0 2.254 1.147 4.243 2.887 5.419-.847-.025-1.649-.26-2.35-.647-.029.749.208 1.45.746 2.005.679.679 1.574 1.186 2.603 1.307-.207.056-.424.086-.647.086-.159 0-.315-.015-.467-.045.767 2.405 2.989 4.168 5.636 4.217-2.868 2.247-6.49 3.586-10.462 3.586-.681 0-1.35-.039-2.006-.118 3.692 2.378 8.016 3.766 12.692 3.766 15.232 0 23.52-12.69 23.52-23.52 0-.357-.012-.71-.031-1.063z" />
    </svg>
);

const YouTubeIcon = ({ size = 24, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M23.498 6.186a2.974 2.974 0 0 0-2.09-2.103C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.408.583a2.974 2.974 0 0 0-2.09 2.103A31.19 31.19 0 0 0 .5 12a31.19 31.19 0 0 0 .002 5.814 2.974 2.974 0 0 0 2.09 2.103C4.495 20.5 12 20.5 12 20.5s7.505 0 9.408-.583a2.974 2.974 0 0 0 2.09-2.103A31.19 31.19 0 0 0 23.5 12a31.19 31.19 0 0 0-.002-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="bg-[#000000] py-12 px-4 font-inter border-t border-gray-200">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <div className="col-span-2 space-y-4">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-4xl font-extrabold text-[#FFFFFF]">
                            BANCre
                        </h3>
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
                            <LinkedInIcon size={28} />
                        </a>
                        <a
                            href="#"
                            className="text-gray-500 hover:text-blue-600 transition-transform transform hover:scale-110"
                        >
                            <TwitterIcon size={28} />
                        </a>
                        <a
                            href="#"
                            className="text-gray-500 hover:text-blue-600 transition-transform transform hover:scale-110"
                        >
                            <YouTubeIcon size={28} />
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

