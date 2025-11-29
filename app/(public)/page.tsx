import React from 'react';
import Banner from './components/Banner/Banner';
import Headline from '../components/Headline';
import Description from '../components/Description';

const page = () => {
    
    return (
        <div>
            <Banner/>
            <div className='text-center'><Headline text="How It Works" /></div>
            <Description text="Simple 3-step process to transform your CRE financing" />
        </div>
    );
};

export default page;