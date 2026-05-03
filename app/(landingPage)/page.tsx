import Banner from "./_components/Banner";
import HowItWorksOne from "./_components/HowItWorksOne";
import HowItWorksTwo from "./_components/HowItWorksTwo";
import BlackButtonRightIcon from "../../components/BlackButtonRightIcon";
import { FaArrowRight } from "react-icons/fa6";
import Headline from "@/components/Headline";
import Description from "@/components/Description";
import Features from "./_components/Features";
import Carousel from "./_components/Carousel";
import ComponentAnimation from "./_components/Animation";
import Partners from "./_components/Partners";
import Transaction from "./_components/transaction";

const page = () => {
  return (
    <div>
      <Banner />
      <ComponentAnimation />
      <Transaction />

      <section className="relative z-0 bg-[#111111]/90">
        <Features />
      </section>
      <div className="py-16">
        <Headline text="How It Works"  className=" text-center text-4xl "/>
         <Description text="Simple 3-step process to transform your CRE financing" />
      <HowItWorksOne />
      </div>
     
      <div className=" bg-[#111111]/90">
        <HowItWorksTwo />
      </div>

      <div className="text-center bg-slate-100/40 flex flex-col gap-5 py-20">
        <Headline text="Our Network of Partners" />
        <Partners />
      </div>

      <section className="relative py-5 z-0 bg-white">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#D1D5DB_0.8px,transparent_0.8px)] bg-size-[24px_24px] opacity-45" />

        <div className="my-16 ">
          <div className="text-center">
            <Headline text="Join the BANCre Capital Markets Network" />
          </div>
          <Description
            text="Become a BANCre broker and leverage technology to build your own capital markets 
                origination business."
          />
          <div className="flex items-center justify-center">
            <BlackButtonRightIcon
              buttonName="Contact Us"
              iconName={FaArrowRight}
              width="w-[200px]"
              rounded="rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
