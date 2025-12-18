import Image from 'next/image';
import React from 'react';

const messageList = () => {
    return (
        <div>
            <div>
                <Image src={"/"} alt='profile' />
            </div>
            <div>
                <h1 className='font-semibold'>Argentic Capita</h1>
                <p>RE: Downtown Office Complex</p>
                <p>We have prepared the final loan documents for your review</p>
            </div>
        </div>
    );
};

export default messageList;