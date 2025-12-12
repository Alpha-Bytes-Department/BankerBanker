import { useState } from 'react';
import { BsBuildings } from 'react-icons/bs';
import { CiLocationOn } from 'react-icons/ci';

const CompanyInfo = () => {
    const [isEdit, setEdit] = useState<boolean>(false);
    return (
        <div className='flex flex-col gap-5 mt-5'>
            <form action="submit" className='grid grid-cols-1 gap-5'>
                <h1>Conpany Information</h1>
                <div className='flex flex-col'>
                    <label htmlFor="company">Company Name</label>
                    <span className='flex items-center gap-2 border border-[#99A1AF]  py-2 px-3 rounded-xl'><BsBuildings className='text-lg text-[#99A1AF]' /><input type="text" id='company' placeholder='Acme Properties LLC' disabled={isEdit} className='border-0 focus:outline-0' /></span>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="title">
                        Position/Title</label>
                    <input type="text" id='title' placeholder='Managing Partner' disabled={isEdit} className='border border-[#99A1AF] focus:outline-[#99A1AF] py-2 px-3 rounded-xl' />
                </div>
                <hr className='text-[#0000001A]' />
                <h1>Business Address</h1>
                <div className='flex flex-col'>
                    <label htmlFor="address">Street Address </label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl'><CiLocationOn  className='text-lg text-[#99A1AF]' /><input type="text" id='address' placeholder='123 Business Ave, Suite 500' disabled={isEdit} className='border-0 focus:outline-0' /></span>
                </div>
                <div className='grid grid-cols-3 gap-3'>
                    <div className='flex flex-col'>
                        <label htmlFor="city">
                            City</label>
                        <input type="text" id='city' placeholder='New York' disabled={isEdit} className='border-0 focus:outline-0 bg-[#F3F3F5] py-2 px-3 rounded-xl' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="state">
                            State</label>
                        <input type="text" id='state' placeholder='NY' disabled={isEdit} className='border-0 focus:outline-0 bg-[#F3F3F5] py-2 px-3 rounded-xl' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="zipCode">
                            ZIP Code</label>
                        <input type="text" id='zipCode' placeholder='10001' disabled={isEdit} className='border-0 focus:outline-0 bg-[#F3F3F5] py-2 px-3 rounded-xl' />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CompanyInfo;