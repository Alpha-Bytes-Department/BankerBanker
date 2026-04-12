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

const page = () => {
  return (
    <div>
      <Banner />
      <ComponentAnimation />
      <div className="text-center flex flex-col gap-5 my-20">
        <Headline text="Our Network of Partners" />
        <Partners />
      </div>
      <section className="relative z-0 bg-slate-100/40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#D1D5DB_0.8px,transparent_0.8px)] bg-size-[24px_24px] opacity-45" />
        <Features />
      </section>
      <div className="text-center">
        <Headline text="How It Works" />
      </div>
      <Description text="Simple 3-step process to transform your CRE financing" />
      <HowItWorksOne />
      <HowItWorksTwo />

      <section className="relative py-5 z-0 bg-slate-100/40">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#D1D5DB_0.8px,transparent_0.8px)] bg-size-[24px_24px] opacity-45" />
        <Carousel />
      <div className="my-16">
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
