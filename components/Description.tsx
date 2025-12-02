import React from 'react';
type DescriptionProps = {
    className?: string;
    position?: "left" | "right" | "center" | "justify";
    text?: string;
}

const Description = ({
    className="text-xl text-center",
    position="center",
    text="Add your description here",
}:DescriptionProps) => {
    return (
        <div style={{ textAlign:position }} className={`text-[#4B5563] my-2 ${className}`}>
            {text}
        </div>
    );
};

export default Description;