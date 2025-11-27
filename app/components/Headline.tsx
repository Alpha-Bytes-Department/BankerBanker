import React from 'react';
type HeadlineProps = {
    className?: string;
    text?: string;
}


const Headline = ({
    className="text-4xl",
    text="Add your headline here",
}:HeadlineProps) => {
    return (
        <h1 className={`font-bold my-2 text-[#4A5568] ${className}`}>
            {text}
        </h1>
    );
};

export default Headline;