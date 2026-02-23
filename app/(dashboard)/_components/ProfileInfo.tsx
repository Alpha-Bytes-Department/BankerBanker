import Image from 'next/image';
import {  useRef, useState } from 'react';
import { CiMail } from 'react-icons/ci';
import { FiPhone } from 'react-icons/fi';
import { MdOutlineFileUpload } from 'react-icons/md';

const ProfileInfo = () => {
    const [preview, setPreview] = useState<string | null>(null)
    const [isEdit, setEdit] = useState<boolean>(false);
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
            <form action="submit" className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                {/* form  */}
                <div className='flex flex-col'>
                    <label htmlFor="firstName">
                        First Name</label>
                    <input type="text" id='firstName' placeholder='John' disabled={isEdit} className='border-0 focus:outline-0 bg-[#F3F3F5] py-2 px-3 rounded-xl' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="lastName">
                        Last Name</label>
                    <input type="text" id='lastName' placeholder='Doe' disabled={isEdit} className='border-0 focus:outline-0 bg-[#F3F3F5] py-2 px-3 rounded-xl' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="email"> Email Address </label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl'><CiMail className='text-lg text-[#99A1AF]' /><input type="text" id='email' placeholder='john.doe@example.com' disabled={isEdit} className='border-0 focus:outline-0' /></span>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="phone">Phone Number </label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl'><FiPhone className='text-lg text-[#99A1AF]' /><input type="text" id='email' placeholder='+1 (555) 123-4567' disabled={isEdit} className='border-0 focus:outline-0' /></span>
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