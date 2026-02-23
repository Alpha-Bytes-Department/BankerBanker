"use client";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from 'framer-motion';
import { FaDollarSign, FaRegBuilding, FaRegStar } from "react-icons/fa";
import { FaArrowTrendUp, FaRegClock } from "react-icons/fa6";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

type StatusCardProps = {
    type: 'Properties' | 'quotes' | 'documents' | 'value';
    data?: {
        status?: number | string;
        value?: number;
    };
};


const CardTypes = {
    Properties: {
        title: 'Total Properties',
        status: 'active listings',
        icon: <FaRegBuilding className="text-xl" />,
        statusIcon: <FiArrowUpRight />
    },
    quotes: {
        title: 'Total Quotes',
        status: 'pending review',
        icon: <FaDollarSign className="text-xl" />,
        statusIcon: <FaRegClock />
    },
    documents: {
        title: 'Total Documents',
        status: 'All processed',
        icon: <IoDocumentTextOutline className="text-xl" />,
        statusIcon: <IoMdCheckmarkCircleOutline />
    },
    value: {
        title: 'Total Property',
        status: 'Avg 93% occupancy',
        icon: <FaArrowTrendUp className="text-xl" />,
        statusIcon: <FaRegStar />
    },
}

const StatusCard = ({
    type,
    data,
}:StatusCardProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [count, setCount] = useState<number>(0);

    // Animate count when in view and data.value is a number
    useEffect(() => {
        const target = typeof data?.value === 'number' ? data.value : 0;
        if (!isInView || target <= 0) return;

        const duration = 700; // total animation duration in ms
        const start = performance.now();
        let rafId: number;

        const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * target);
            setCount(current);
            if (progress < 1) {
                rafId = requestAnimationFrame(step);
            } else {
                setCount(target);
            }
        };

        rafId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId);
    }, [isInView, data?.value]);

    const display = typeof data?.value === 'number' ? new Intl.NumberFormat().format(count) : data?.value ?? '-';

    return (
        <div className={`flex flex-col border border-[#0000001A] rounded-lg w-[240px] 2xl:w-[344px] gap-5 p-5 h-auto`}>
            <div className="flex justify-between items-center">
                <p className="text-base xl:text-lg 2xl:text-xl">{CardTypes[type].title}</p>
                <span>{CardTypes[type].icon}</span>
            </div>
            <div ref={ref} className="text-3xl">
                {display}
            </div>
            <div className="flex items-center gap-2">
                <span>{CardTypes[type].statusIcon}</span>
                <span className="text-sm">{data?.status} {CardTypes[type].status}</span>
            </div>
        </div>
    );
};

export default StatusCard;