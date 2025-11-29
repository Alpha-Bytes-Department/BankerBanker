import React from 'react';

type NavbarProps ={
  logo?: React.ReactNode;
  links?: {name: string; href: string}[];
  buttons?: React.ReactNode;
}


const Navbar = ({
    logo,
    links = [],
    buttons,
}:NavbarProps) => {
    return (
        <nav>
            <div>
                {logo}
            </div>
            <div>
                {links && links.map((link, idx)=><a key={idx} href={link.href}>{link.name}</a>)}
            </div>
            <div>
                {buttons && buttons}
            </div>
        </nav>
    );
};

export default Navbar;