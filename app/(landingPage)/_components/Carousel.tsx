"use client"
import {Swiper,SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar } from "swiper/modules";
import ReviewCard from "./ReviewCard";

const reviews=[
    {
        id:1,
        image:"",
        name:"Floyd Miles",
        review:`Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim 
        velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non.`
    },
    {
        id:2,
        image:"",
        name:"Ronald Richards",
        review:`ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam 
        consequat sunt nostrud amet.`
    },
    {
        id:3,
        image:"",
        name:"Savannah Nguyen",
        review:`Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim 
        velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt.`
    },
];

export default function Carousel() {
    return (
        <div className="mt-18">
            <h1 className="text-center text-[#07484A] text-5xl font-playFairDisplay font-semibold">Best Sellers</h1>
            <div className="w-full mt-12 px-8 md:px-16 lg:px-24">
                {/* <Image src="/best-sellers-images/wire.png" alt="wire" width={250} height={100}/> */}
                <Swiper
                    modules={[Navigation, Scrollbar]}
                    spaceBetween={10}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        1280: {
                            slidesPerView: 3,
                        },
                        1536: {
                            slidesPerView: 4,
                        },
                        1920: {
                            slidesPerView: 5,
                        },
                    }}
                    navigation={{
                        prevEl: '.custom-prev', // the name prevEl can not be changed. it is fixed.
                        nextEl: '.custom-next', // the name nextEl can not be changed. it is fixed.
                    }}
                    //pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    className="bg-[url(/best-sellers-images/wire.png)]">
                    {reviews.map((item) => (
                        <SwiperSlide key={item.id} className="pb-9 !flex !items-center !justify-center">
                            <ReviewCard
                                //imageName={item.imageName}
                                name={item.name}
                                review={item.review}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="flex justify-end items-center gap-6 mt-6">
                    <button className="custom-prev w-10 h-10 rounded-full flex items-center justify-center bg-[#E0EFF6] 
                        transition cursor-pointer">
                        Left
                    </button>
                    <button className="custom-next w-10 h-10 rounded-full flex items-center justify-center bg-[#F9D9DA] 
                        transition cursor-pointer">
                        Right
                    </button>
                </div>
            </div>
        </div>
    );
}