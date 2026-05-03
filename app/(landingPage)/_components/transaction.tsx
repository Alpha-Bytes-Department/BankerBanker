"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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
    <section className="bg-white py-12 px-4 lg:px-8 overflow-hidden">
      <div className="mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
          Our Transactions
        </h2>
        <p className="italic text-gray-800 text-sm md:text-base mb-10">
          Includes transactions previously completed by employees of BANCre.com
        </p>

        {/* Swiper slider for transactions */}
        <div className="mt-8">
          <Swiper
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1.2 },
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 },
              1280: { slidesPerView: 4.2 },
            }}
            className="w-full"
          >
            {transactions.map((tx) => (
              <SwiperSlide key={tx.id}>
                <div className="flex flex-col gap-3">
                  <div className="relative w-full h-56 md:h-64 lg:h-80 rounded-3xl overflow-hidden shadow-sm">
                    <Image
                      src={tx.image}
                      alt={tx.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-sm text-black">
                    <span className="font-semibold">{tx.title}</span>
                    <span>{tx.location}</span>
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
