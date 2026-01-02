import { FaAngleRight } from "react-icons/fa6";
const Banner = () => {
    return (
        <div>
            <div className="w-full h-[80vh] bg-[linear-gradient(255.49deg,rgba(0,0,0,0)_-2%,rgba(0,0,0,0.54)_58.53%),url('/images/banner-img.png')] bg-no-repeat bg-[center_65%] bg-cover relative flex flex-col items-center justify-center text-white">
                <div className="flex flex-col justify-center items-start gap-7 px-8 lg:px-16 xl:px-24 absolute bottom-28 left-26">
                    <h1 className="text-5xl w-full lg:w-10/12 xl:w-8/12">Your Banker for Commercial Real Estate Powered by AI</h1>
                    <div className="w-full flex justify-between items-start">
                        <p className="w-full lg:w-8/12 xl:w-7/12">Loan Origination, Brokerage and Capital Markets. Faster, Cheaper, Smarter. Create perfect documents in minutes, every time. Let AI handle the paperwork while you build your dreams.</p>
                        <button className="button-primary px-3 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer"><span>VIEW TRANSACTIONS</span><FaAngleRight /></button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Banner;


