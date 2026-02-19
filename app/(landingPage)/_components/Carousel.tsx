// Fahim
"use client"
import ReviewCard from "./ReviewCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Headline from "@/components/Headline";
import Description from "@/components/Description";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const reviews = [
    {
        id: 1,
        image: "/images/Landing_Page/ReviewPhoto/1.png",
        name: "Floyd Miles",
        review: `Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim 
        velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non.`
    },
    {
        id: 2,
        image: "/images/Landing_Page/ReviewPhoto/2.png",
        name: "Ronald Richards",
        review: `ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam 
        consequat sunt nostrud amet.`
    },
    {
        id: 3,
        image: "/images/Landing_Page/ReviewPhoto/3.png",
        name: "Savannah Nguyen",
        review: `Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim 
        velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt.`
    },
    {
        id: 4,
        image: "/images/Landing_Page/ReviewPhoto/1.png",
        name: "Floyd Miles",
        review: `Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim 
        velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non.`
    },
    {
        id: 5,
        image: "/images/Landing_Page/ReviewPhoto/2.png",
        name: "Ronald Richards",
        review: `ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam 
        consequat sunt nostrud amet.`
    },
    {
        id: 6,
        image: "/images/Landing_Page/ReviewPhoto/3.png",
        name: "Savannah Nguyen",
        review: `Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim 
        velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt.`
    },
];

export default function Carousel() {
    return (
        <div className="mt-18 max-w-[1400px] mx-auto">
            {/* <div className="flex justify-between items-center">
                <div>
                    <Headline text="Our Customers Feedback" />
                    <Description position="left" text="Don’t take our word for it. Trust our customers" />
                </div>

                <div className="flex justify-end items-center gap-6 mt-6">
                    <button className="custom-prev border rounded-full flex items-center justify-center gap-1 px-4 py-1 bg-white 
                        cursor-pointer">
                        <FiChevronLeft className="text-blue-600" />
                        <p className="text-[#133240]">Previous</p>
                    </button>
                    <button className="custom-next border rounded-full flex items-center justify-center gap-1 px-4 py-1 bg-white
                        cursor-pointer">
                        <p className="text-[#133240]">Next</p>
                        <FiChevronRight className="text-blue-600" />
                    </button>
                </div>
            </div> */}

            <div className="pl-8">
                <Headline text="Our Customers Feedback" />
                <Description position="left" text="Don’t take our word for it. Trust our customers" />
            </div>

            <div className="mt-12">
                <Swiper
                    modules={[Navigation, Scrollbar, Pagination]}
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
                        // 1536: {
                        //     slidesPerView: 4,
                        // },
                        // 1920: {
                        //     slidesPerView: 5,
                        // },
                    }}
                    navigation={{
                        prevEl: '.custom-prev', // the name prevEl can not be changed. it is fixed.
                        nextEl: '.custom-next', // the name nextEl can not be changed. it is fixed.
                    }}
                    pagination={{ clickable: true }}
                    // scrollbar={{ draggable: true }}
                    className="">
                    {reviews.map((item) => (
                        <SwiperSlide key={item.id} className="pb-9 !flex !items-center !justify-center">
                            <ReviewCard
                                image={item.image}
                                name={item.name}
                                review={item.review}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="flex justify-end items-center gap-6 mt-6 pr-8">
                    <button className="custom-prev border rounded-full flex items-center justify-center gap-1 px-4 py-1 bg-white 
                cursor-pointer text-[#133240]">
                        <FiChevronLeft />
                        <p>Previous</p>
                    </button>
                    <button className="custom-next border rounded-full flex items-center justify-center gap-1 px-4 py-1 bg-white
                cursor-pointer text-[#133240]">
                        <p>Next</p>
                        <FiChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
}