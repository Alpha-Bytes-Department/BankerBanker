// Fahim
import Image from "next/image";

const howItWorksOneData = [{
    id: 1,
    title: "Upload Documents",
    subtitle: "Upload rent rolls, leases, financials and property documents to our secure platform.",
    imagePath: "/images/Landing_Page/HowItWorksOne/1.png"
},
{
    id: 2,
    title: "AI Analysis",
    subtitle: "Our AI structures data, creates Excel models and generates offering memorandums instantly.",
    imagePath: "/images/Landing_Page/HowItWorksOne/2.png"
},
{
    id: 3,
    title: "Connect with Lenders",
    subtitle: "Receive, compare and choose the best loan quotes from our network of lenders.",
    imagePath: "/images/Landing_Page/HowItWorksOne/3.png"
}];

export default function HowItWorksOne() {
    return (
        <div className="flex flex-col xl:flex-row gap-12 items-center justify-center mt-12">
            {
                howItWorksOneData.map(item => (
                    // Card
                    <div key={item.id} className="flex flex-col items-center justify-center gap-6 
                    max-w-[362px] h-[420px] bg-[#FFFFFF] shadow-2xl rounded-2xl p-6">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 
                            bg-primary text-[#FFFFFF] font-semibold">{item.id}</div>
                        <div className="text-[#111827] font-semibold">{item.title}</div>
                        <div className="text-[#4B5563]">{item.subtitle}</div>
                        <div className="relative w-[300px] h-[150px]">
                            <Image src={item.imagePath} alt={item.imagePath} fill className="rounded-lg object-cover object-center" />
                        </div>
                    </div>
                ))
            }
        </div>
    );
}
