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
        title: 'Total Property Value',
        status: 'Avg 93% occupancy',
        icon: <FaArrowTrendUp className="text-xl" />,
        statusIcon: <FaRegStar />
    },
}

const StatusCard = ({
    type,
    data
}:StatusCardProps) => {
    return (
        <div className="flex flex-col gap-5 p-5 border border-[#0000001A] w-[344px] rounded-lg">
            <div className="flex justify-between items-center">
                <p className="text-xl">{CardTypes[type].title}</p>
                <span>{CardTypes[type].icon}</span>
            </div>
            <div className="text-3xl">
                {data?.value}
            </div>
            <div className="flex items-center gap-2">
                <span>{CardTypes[type].statusIcon}</span>
                <span className="text-sm">{data?.status} {CardTypes[type].status}</span>
            </div>
        </div>
    );
};

export default StatusCard;