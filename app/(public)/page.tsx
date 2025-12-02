import Banner from './_components/Banner';
import Features from './components/Features';
import Navbar from './components/Navbar';
import HowItWorksOne from './components/HowItWorksOne';
import HowItWorksTwo from './components/HowItWorksTwo';
import BlackButtonRightIcon from '../components/BlackButtonRightIcon';
import { FaArrowRight } from 'react-icons/fa6';
import Footer from './components/Footer';
import Carousel from './components/Carousel';
import Headline from '@/components/Headline';
import Description from '@/components/Description';

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
            <div className='text-center'>
                <Headline text="Join the BANCre Capital Markets Network" />
            </div>
            <Description text="Become a BANCre broker and leverage technology to build your own capital markets 
            origination business." />
            <div className='flex items-center justify-center'>
                <BlackButtonRightIcon buttonName='Contact Us' iconName={FaArrowRight} width="w-[200px]" rounded="rounded-lg" />
            </div>
            <div className='mt-12'>
                <Footer/>
            </div>
            <Carousel/>
        </div>
    );
};

export default page;