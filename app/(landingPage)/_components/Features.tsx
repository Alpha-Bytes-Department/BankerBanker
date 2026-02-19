
import FeaturesCard from './FeaturesCard';
import { FaRobot } from "react-icons/fa6";
import { SiGoogledocs } from "react-icons/si";
import { FaHandshake } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { FaShieldAlt } from "react-icons/fa";
import Headline from '@/components/Headline';
import Description from '@/components/Description';
import Button from '@/components/Button';


type Feature = {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    iconBgColor: string;
};



const Features = () => {

    const features: Feature[] = [
        {
            id: 1,
            title: "Lender Tools fo Faster Quotes",
            description: "Lender view deals with Interactive Offering Memordums and can export rent rolls, operating statements, and property information directly into their own excel models to make quoting deals faster.",
            icon: <FaRobot className='text-[#2563EB]' size={40} />,
            iconBgColor: '#DBEAFE',
        },
        {
            id: 2,
            title: "Instant Offering Memorandums",
            description: "Upload rent rolls, leases or financials and let AI structure them to generate professional offering memorandums ready to distribute to Lenders. Go to market in minutes instead of weeks.",
            icon: <SiGoogledocs className='text-[#16A34A]' size={40} />,
            iconBgColor: '#DCFCE7',
        },
        {
            id: 3,
            title: "View Documents with BANCre AI Analyst",
            description: "View deals and do Q&A about property documents with our intelligent AI chatbot BANCre analyst 24/7.",
            icon: <FaHandshake className='text-[#9333EA]' size={40} />,
            iconBgColor: '#F3E8FF',
        },
        {
            id: 4,
            title: "Save Time & Costs",
            description: "AI and BANCre partnerships will enable time and cost savings in origination and closing including, due diligence, KYC, third-party reports and legal.",
            icon: <GoGraph className='text-[#EA580C]' size={40} />,
            iconBgColor: '#FFEDD5',
        },
        {
            id: 5,
            title: "Real-Time Loan Quote Comparison",
            description: "Receive and compare loan quotes from multiple qualified lenders in one centralized platform",
            icon: <FaShieldAlt className='text-[#DC2626]' size={40} />,
            iconBgColor: '#FEE2E2',
        },
        {
            id: 6,
            title: "Save Time & Costs",
            description: "AI technologies combined with actual CRE experience accelerate going to market for the optimal financing. BANCre's network includes thousands of real lender relationships developed over years of closing deals.",
            icon: <FaHandshake className='text-[#9333EA]' size={40} />,
            iconBgColor: '#F3E8FF',
        },
    ];

    return (
        <div className='mt-20 mx-auto max-w-7xl'>
            <div className='my-20'>
                <Headline text="Why BANCre?" className='text-4xl text-center'/>
                <Description text="BANCre leverages technology to revolutionize the origination and closing process of commercial real estate loans." />
            </div>
            {/* Feature cards would go here */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 justify-items-center'>
                {/* feature cards 1  */}
                {features.map((feature, idx)=><FeaturesCard
                    key={idx}
                    icon={feature.icon}
                    iconBgColor={feature.iconBgColor}
                    title={feature.title}
                    description={feature.description}
                />)}
            </div>
            <Button text='Get started' className='button-primary mx-auto my-20' arrow={true}/>
        </div>
    );
};

export default Features;