"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const transactions = [
  {
    id: 1,
    title: "Sheraton Miami Freedom Park",
    location: "Miami, FL",
    image: "/images/img2.jpg",
  },
  {
    id: 2,
    title: "Sheraton Miami Freedom Park",
    location: "Miami, FL",
    image: "/images/img3.jpg",
  },
  {
    id: 3,
    title: "945 Bryant",
    location: "San Francisco, CA",
    image: "/images/img2.jpg",
  },
  {
    id: 4,
    title: "Marram Montauk",
    location: "Montauk, NY",
    image: "/images/img3.jpg",
  },
  {
    id: 5,
    title: "Pioneer Building",
    location: "San Francisco, CA",
    image: "/images/img2.jpg",
  },
  {
    id: 6,
    title: "Sycamore Haus",
    location: "West Hollywood, CA",
    image: "/images/img3.jpg",
  },
];

const Transaction = () => {
  return (
    <section id="transactions" className="bg-white py-12 px-4 lg:px-8 overflow-hidden">
      <div className="mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
          Our Transactions
        </h2>
        <p className="italic text-gray-800 text-sm md:text-base mb-10">
          Includes transactions previously completed by employees of BANCre.com
        </p>

        {/* Swiper slider for transactions */}
        <div className="relative mt-8 max-w-5xl mx-auto px-4">
          {/* Left slight blur overlay */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-24 z-20 bg-gradient-to-r from-white via-white/80 to-transparent backdrop-blur-[2px]" />
          {/* Right slight blur overlay */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-24 z-20 bg-gradient-to-l from-white via-white/80 to-transparent backdrop-blur-[2px]" />

          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={3}
            loop={true}
            speed={900}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="w-full py-4"
          >
            {transactions.map((tx) => (
              <SwiperSlide key={tx.id}>
                <div className="flex flex-col gap-2.5 text-left transition-all duration-700 hover:scale-[1.02]">
                  <div className="relative w-full h-44 md:h-52 lg:h-60 rounded-2xl overflow-hidden shadow-xs">
                    <Image
                      src={tx.image}
                      alt={tx.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-sm text-black px-1">
                    <span className="font-semibold text-xs md:text-sm">{tx.title}</span>
                    <span className="text-gray-500 text-xs">{tx.location}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Transaction;
