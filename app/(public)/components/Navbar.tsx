"use client";
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import React from 'react';

type NavbarProps ={
    logo?: {
        name?: string;
        Link?: string | StaticImageData;
    };
  links?: {text: string; href: string}[];
  buttons?: React.ReactNode;
  className?: string;
}



const Navbar = ({
    logo = {
        name: 'name',
        Link: '/',
    },
    links = [],
    buttons,
    className = "",
}:NavbarProps) => {
    return (
        <nav className={`flex justify-around items-center py-2 ${className}`}>
            <div>
                {logo && <Image src={logo?.Link ?? '/'} alt={logo?.name ?? 'logo'} width={150} height={50} />}
            </div>
            <div className='flex gap-8'>
                {links && links.map((link, idx)=><Link key={idx} href={link.href}>{link.text}</Link>)}
            </div>
            <div>
                {buttons && buttons}
            </div>
        </nav>
    );
};

export default Navbar;