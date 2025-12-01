import React from 'react';
import Banner from './components/Banner';
import Features from './components/Features';
import Navbar from './components/Navbar';
import Button from '../components/Button';
import LogoLink from "@/public/BANCre.png"


type LinkProps = {
    text : string;
    href : string;
}[];


const page = () => {

    const Links:LinkProps = [
        {text: 'Home', href: '#home'},
        {text: 'Sponsor', href: '#sonsor'},
        {text: 'Lender', href: '#lender'},
        {text: 'Broker', href: '#broker'},
        {text: 'Contact', href: '#contact'},
    ];


    const Logo = {
        name: 'BANCre',
        Link: LogoLink
    };


    const Navbuttons = <div className='flex gap-5'>
        <Button text='Sign in'  className='btn-primary'/>
        <Button text='Get Started Free'  className='btn-primary'/>
    </div>

    return (
        <div>
            <Navbar buttons={Navbuttons} links={Links} logo={Logo} />
            <Banner />
            <Features />
        </div>
    );
};

export default page;