import Image from 'next/image';
import {  useRef, useState } from 'react';
import { MdOutlineFileUpload } from 'react-icons/md';

const ProfileInfo = () => {
    const [preview, setPreview] = useState<string | null>(null)
    const [isEdit, setEdit] = useState<boolean>(true);
    const inputRef = useRef<HTMLInputElement | null>(null)


    const handleImageButton = (e: React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault();
        inputRef?.current?.click()
    }

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreview(url);
    };


    return (
        <div className='flex flex-col gap-5 mt-5'>
            <h1>Personal Information</h1>
            <form action="submit" className='grid grid-cols-2 gap-5'>
                {/* form  */}
                <div className='flex flex-col'>
                    <label htmlFor="firstName">
                        First Name</label>
                    <input type="text" id='firstName' placeholder='John' disabled={isEdit} className='border border-[#00000000] bg-[#F3F3F5] py-2 px-3 rounded-full' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="lastName">
                        Last Name</label>
                    <input type="text" id='lastName' placeholder='Doe' disabled={isEdit} className='border border-[#00000000] bg-[#F3F3F5] py-2 px-3 rounded-full' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="email"> Email Address </label>
                    <input type="text" id='email' placeholder='John' disabled={isEdit} className='border border-[#00000000] bg-[#F3F3F5] py-2 px-3 rounded-full' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="phone">Phone Number </label>
                    <input type="text" id='phone' placeholder='John' disabled={isEdit} className='border border-[#00000000] bg-[#F3F3F5] py-2 px-3 rounded-full' />
                </div>
                {/* image  */}
                <div className='flex w-full items-center gap-3'>
                    {<Image src={preview || "/images/img2.jpg"} alt="preview" width={100} height={100} className="object-center object-cover rounded-full h-20 w-20" />}
                    <div><button type='button' onClick={handleImageButton} className='py-2 px-3 border border-[#0000001A] outline-[#0000001A] flex items-center gap-2 rounded-full cursor-pointer'><MdOutlineFileUpload /> <span>Upload Photo</span></button></div>
                    {preview && <button type='button' onClick={(e)=>{
                        e.preventDefault();
                        setPreview(null)
                    }}  className='py-2 px-3 border border-[#0000001A] outline-[#0000001A] rounded-full cursor-pointer'>Remove</button>}
                    <input ref={inputRef} type="file" accept='image/*' className='hidden' alt="image" onChange={handleImage} />
                </div>
            </form>
        </div>
    );
};

export default ProfileInfo;