"use client";
import React, { useState } from "react";
import { FiPhone, FiMail } from "react-icons/fi";
import { FaFax as HiOutlineFax } from "react-icons/fa";
const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 md:py-16 lg:py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto relative">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* ====== Left Section - Contact Form ====== */}
            <div className="p-6 md:p-8 lg:p-12 xl:p-16 col-span-3">
              <div className=" max-w-lg  mx-auto lg:mx-0">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
                  Get in <span className="text-blue-900">Touch</span>
                </h1>

                <p className="text-gray-600 text-sm md:text-base mb-8 md:mb-10 lg:mb-12">
                  Enim tempor eget pharetra facilisis sed maecenas adipiscing.
                  Eu leo molestie vel, ornare non id blandit netus.
                </p>

                {/* ====== Contact Form ====== */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 md:space-y-5"
                >
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name *"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number *"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 md:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base text-gray-700 bg-white"
                    >
                      <option value="">How did you find us?</option>
                      <option value="google">Google Search</option>
                      <option value="social">Social Media</option>
                      <option value="referral">Referral</option>
                      <option value="advertisement">Advertisement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 md:py-4 rounded-lg transition-colors duration-200 text-sm md:text-base"
                  >
                    Send
                  </button>
                </form>

                {/* ====== Contact Information ====== */}
                <div className="mt-8 md:mt-10 lg:mt-12 pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <FiPhone className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          PHONE
                        </p>
                        <p className="text-sm md:text-base font-medium text-gray-900">
                          03 5432 1234
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <HiOutlineFax className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          FAX
                        </p>
                        <p className="text-sm md:text-base font-medium text-gray-900">
                          03 5432 1234
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <FiMail className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          EMAIL
                        </p>
                        <p className="text-sm md:text-base font-medium text-blue-900 break-all">
                          info@marcc.com.au
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ====== Right Section - Map ====== */}
            <div className=" bg-[#2C5F6F]  p-6 md:p-8 lg:p-10 xl:p-12 min-h-[400px] col-span-2 lg:min-h-full  rounded-r-3xl">
              <div className="bg-white max-h-150 min-w-md absolute overflow-hidden h-full right-[7%] top-[12%]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.194302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1629794729807!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "400px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full  "
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
