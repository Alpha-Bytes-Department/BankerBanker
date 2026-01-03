import Image from 'next/image';
import Marquee from "react-fast-marquee"

const images = [
    { src: '/images/Companies/AEW_logo.png', alt: 'Partner 1' },
    { src: '/images/Companies/ashland_pacific_management_logo.png', alt: 'Partner 2' },
    { src: '/images/Companies/bridgeton_holdings_logo.png', alt: 'Partner 3' },
    { src: '/images/Companies/CIM_Logo.png', alt: 'Partner 4' },
    { src: '/images/Companies/Deutsche-Bank-logo.png', alt: 'Partner 5' },
    { src: '/images/Companies/FiveSquares_logo.png', alt: 'Partner 6' },
    { src: '/images/Companies/GoodlifeHousing_logo.png', alt: 'Partner 7' },
    { src: '/images/Companies/Hines_logo.png', alt: 'Partner 8' },
    { src: '/images/Companies/Jamison_logo.png', alt: 'Partner 9' },
    { src: '/images/Companies/Koar_logo.png', alt: 'Partner 10' },
    { src: '/images/Companies/Miami Freedom Park_Logo.png', alt: 'Partner 11' },
    { src: '/images/Companies/Oaktree_logo.png', alt: 'Partner 12' },
    { src: '/images/Companies/pacific_castle_logo.png', alt: 'Partner 13' },
    { src: '/images/Companies/PalatineCapital_logo.png', alt: 'Partner 14' },
    { src: '/images/Companies/Redcar_logo.png', alt: 'Partner 15' },
];

const Partners = () => {
    return (
        <div >
            
            <Marquee>
                {images.map((image, index) => (
                    <div key={index} className="mx-8 flex items-center">
                        <Image src={image.src} alt={image.alt} width={100} height={100} className="h-8 md:h-12 w-full object-contain object-center" />
                    </div>
                ))}
            </Marquee>
        </div>
    );
};

export default Partners;