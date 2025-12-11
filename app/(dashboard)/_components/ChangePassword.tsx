import Button from '@/components/Button';
import React from 'react';

const ChangePassword = () => {
    return (
        <div className='flex flex-col gap-5 mt-5'>
            <h1>Change Password</h1>
            <form action="submit" className='grid grid-cols-1 gap-5'>
                {/* form  */}
                <div className='flex flex-col'>
                    <label htmlFor="email"> Current Password </label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl'><input type="text" id='email' placeholder='Enter current password' className='border-0 focus:outline-0'/></span>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="email"> New Password </label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl'><input type="text" id='email' placeholder='Enter new password' className='border-0 focus:outline-0'/></span>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="email"> Confirm Password </label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl'><input type="text" id='email' placeholder='Confirm new password' className='border-0 focus:outline-0'/></span>
                </div>
                <Button text='Update Password' type='submit'/>
            </form>
        </div>
    );
};

export default ChangePassword;