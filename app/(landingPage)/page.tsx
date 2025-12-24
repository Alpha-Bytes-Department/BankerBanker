import Banner from './_components/Banner';
import HowItWorksOne from './_components/HowItWorksOne';
import HowItWorksTwo from './_components/HowItWorksTwo';
import BlackButtonRightIcon from '../../components/BlackButtonRightIcon';
import { FaArrowRight } from 'react-icons/fa6';
import Footer from './_components/Footer';
import Headline from '@/components/Headline';
import Description from '@/components/Description';
import Navbar from './_components/Navbar';
import Features from './_components/Features';
import Carousel from './_components/Carousel';


const page = () => {
    return (
        <div>
            <Navbar />
            <Banner />
            <Features />
            <div className='text-center'>
                <Headline text="How It Works" />
            </div>
            <Description text="Simple 3-step process to transform your CRE financing" />
            <HowItWorksOne />
            <HowItWorksTwo />
            <Carousel />

            <div className='my-16'>
                <div className='text-center'>
                    <Headline text="Join the BANCre Capital Markets Network" />
                </div>
                <Description text="Become a BANCre broker and leverage technology to build your own capital markets 
                origination business." />
                <div className='flex items-center justify-center'>
                    <BlackButtonRightIcon buttonName='Contact Us' iconName={FaArrowRight} width="w-[200px]" rounded="rounded-lg" />
                </div>
            </div>
            <div className='mt-12'>
                <Footer />
            </div>
        </div>
    );
};

export default page;