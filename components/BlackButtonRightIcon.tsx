// Fahim
import { IconType } from "react-icons";

interface BlackButtonRightIconProps {
    buttonName: string;
    iconName: IconType; // react-icons component type
    width?: string;
    rounded?: string;
}

export default function BlackButtonRightIcon({ buttonName, iconName: Icon, width, rounded }: BlackButtonRightIconProps) {
    return (
        <button className={`bg-primary text-[#FFFFFF] flex items-center justify-center gap-2 
        px-4 py-2 mt-8 cursor-pointer hover:scale-105 ${width} ${rounded}`}>
            {buttonName}
            <Icon className="w-4 h-4" />
        </button>
    );
}
