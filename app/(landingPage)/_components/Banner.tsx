
const Banner = () => {
    return (
        <div>
            <div className="w-full h-[80vh] bg-[linear-gradient(255.49deg,rgba(0,0,0,0)_-2%,rgba(0,0,0,0.54)_58.53%),url('/images/banner-img.png')] bg-center bg-cover relative flex flex-col items-center justify-center text-white">
                <div className="flex flex-col justify-center items-start gap-8 px-8 lg:px-16 xl:px-24 absolute bottom-16 left-10">
                    <h1 className="text-5xl w-full lg:w-10/12 xl:w-8/12">Your Banker for Commercial Real Estate Powered by AI</h1>
                    <p className="w-full lg:w-8/12 xl:w-7/12">Loan Origination, Brokerage and Capital Markets. Faster, Cheaper, Smarter. Create perfect documents in minutes, every time. Let AI handle the paperwork while you build your dreams.</p>
                </div>
            </div>
        </div>
    );
};

export default Banner;


