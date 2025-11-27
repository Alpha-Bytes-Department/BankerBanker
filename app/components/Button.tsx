import React from 'react';
type ButtonProps = {
    text?: string;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    icon?: React.ReactNode;
}


const Button = ({
text,
onClick,
className="bg-primaryC",
type = "button",
icon,
}:ButtonProps) => {
    return (
        <div className={`${icon ? 'flex items-center gap-2' : ''}`}>
            {icon && icon}
            <button onClick={onClick} className={`  ${className}`} type={type}>{text}</button>
        </div>
    );
};

export default Button;