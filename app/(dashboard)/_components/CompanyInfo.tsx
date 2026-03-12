import { User } from '@/types/auth';
import { useState, useEffect } from 'react';
import { BsBuildings } from 'react-icons/bs';
import { CiLocationOn } from 'react-icons/ci';
import { MdEdit } from 'react-icons/md';

const CompanyInfo = ({ user, onDataChange }: { user: User | null; onDataChange?: (data: any) => void }) => {
    const [isEdit, setEdit] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        company_name: user?.company_information?.company_name || '',
        position: user?.company_information?.position || '',
        street_address: user?.company_information?.street_address || '',
        city: user?.company_information?.city || '',
        state: user?.company_information?.state || '',
        zip_code: user?.company_information?.zip_code || ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSave = () => {
        setEdit(false);
    };

    // Send updated data to parent whenever formData changes
    useEffect(() => {
        if (isEdit && onDataChange) {
            onDataChange({ company: formData });
        }
    }, [formData, isEdit]);
    
    return (
        <div className='flex flex-col gap-5 mt-5'>
            <form action="submit" className={`grid grid-cols-1 gap-5 p-4 rounded-lg transition-all ${
                isEdit ? 'bg-blue-50 border-2 border-blue-300' : 'bg-transparent border-2 border-transparent'
            }`}>
                <div className='flex items-center justify-between'>
                    <h1>Company Information</h1>
                    <button
                        type='button'
                        onClick={() => {
                            if (isEdit) {
                                handleSave();
                            } else {
                                setEdit(true);
                            }
                        }}
                        className={`p-2 rounded-full cursor-pointer transition-all ${
                            isEdit 
                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        <MdEdit className='text-lg' />
                    </button>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="company_name">Company Name</label>
                    <span className='flex items-center gap-2 border border-[#99A1AF]  py-2 px-3 rounded-xl'><BsBuildings className='text-lg text-[#99A1AF]' /><input 
                        type="text" 
                        id='company_name' 
                        value={formData.company_name}
                        onChange={handleInputChange}
                        placeholder='Acme Properties LLC' 
                        disabled={!isEdit} 
                        className='border-0 focus:outline-0' 
                    /></span>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="position">
                        Position/Title</label>
                    <input 
                        type="text" 
                        id='position' 
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder='Managing Partner' 
                        disabled={!isEdit} 
                        className='border border-[#99A1AF] focus:outline-[#99A1AF] py-2 px-3 rounded-xl' 
                    />
                </div>
                <hr className='text-[#0000001A]' />
                <h1>Business Address</h1>
                <div className='flex flex-col'>
                    <label htmlFor="street_address">Street Address </label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl'><CiLocationOn  className='text-lg text-[#99A1AF]' /><input 
                        type="text" 
                        id='street_address' 
                        value={formData.street_address}
                        onChange={handleInputChange}
                        placeholder='123 Business Ave, Suite 500' 
                        disabled={!isEdit} 
                        className='border-0 focus:outline-0' 
                    /></span>
                </div>
                <div className='grid grid-cols-3 gap-3'>
                    <div className='flex flex-col'>
                        <label htmlFor="city">
                            City</label>
                        <input 
                            type="text" 
                            id='city' 
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder='New York' 
                            disabled={!isEdit} 
                            className='border-0 focus:outline-0 bg-[#F3F3F5] py-2 px-3 rounded-xl' 
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="state">
                            State</label>
                        <input 
                            type="text" 
                            id='state' 
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder='NY' 
                            disabled={!isEdit} 
                            className='border-0 focus:outline-0 bg-[#F3F3F5] py-2 px-3 rounded-xl' 
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="zip_code">
                            ZIP Code</label>
                        <input 
                            type="text" 
                            id='zip_code' 
                            value={formData.zip_code}
                            onChange={handleInputChange}
                            placeholder='10001' 
                            disabled={!isEdit} 
                            className='border-0 focus:outline-0 bg-[#F3F3F5] py-2 px-3 rounded-xl' 
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CompanyInfo;