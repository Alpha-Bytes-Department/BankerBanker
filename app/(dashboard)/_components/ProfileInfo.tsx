import { User } from '@/types/auth';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRef, useState, useEffect } from 'react';
import { CiMail } from 'react-icons/ci';
import { FiPhone } from 'react-icons/fi';
import { MdOutlineFileUpload, MdEdit } from 'react-icons/md';

const ProfileInfo = ({ user, onDataChange }: { user: User | null; onDataChange?: (data: any) => void }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const isMounted = useRef(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // default values come from user prop
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    // only sync to parent after user makes a change, not on initial mount
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        if (onDataChange) {
            const dataToSend: any = { profile: formData };
            if (selectedFile) dataToSend.profileFile = selectedFile;
            onDataChange(dataToSend);
        }
    }, [formData, selectedFile]);

    return (
        <div className='flex flex-col gap-5 mt-5'>
            <div className='flex items-center justify-between'>
                <h1>Personal Information</h1>
                <button
                    type='button'
                    onClick={() => setEdit(prev => !prev)}
                    className={`p-2 rounded-full cursor-pointer transition-all ${
                        isEdit ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                >
                    <MdEdit className='text-lg' />
                </button>
            </div>

            <form action="submit" className={`grid grid-cols-1 lg:grid-cols-2 gap-5 p-4 rounded-lg transition-all ${
                isEdit ? 'bg-blue-50 border-2 border-blue-300' : 'bg-transparent border-2 border-transparent'
            }`}>
                <div className='flex flex-col'>
                    <label htmlFor="first_name">First Name</label>
                    <input
                        type="text"
                        id='first_name'
                        placeholder='enter your first name'
                        defaultValue={user?.first_name}
                        onChange={handleInputChange}
                        disabled={!isEdit}
                        className='border-0 focus:outline-0 bg-[#F3F3F5] py-2 px-3 rounded-xl'
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        type="text"
                        id='last_name'
                        placeholder='Doe'
                        defaultValue={user?.last_name}
                        onChange={handleInputChange}
                        disabled={!isEdit}
                        className='border-0 focus:outline-0 bg-[#F3F3F5] py-2 px-3 rounded-xl'
                    />
                </div>

                {/* email and phone are read-only — shown from user prop directly */}
                <div className='flex flex-col'>
                    <label>Email Address</label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl opacity-60 cursor-not-allowed'>
                        <CiMail className='text-lg text-[#99A1AF]' />
                        <span>{user?.email || 'email address'}</span>
                    </span>
                </div>
                <div className='flex flex-col'>
                    <label>Phone Number</label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl opacity-60 cursor-not-allowed'>
                        <FiPhone className='text-lg text-[#99A1AF]' />
                        <span>{user?.phone || 'phone number'}</span>
                    </span>
                </div>

                <div className='flex w-full items-center gap-3'>
                    {preview && (
                        <Avatar className="h-10 w-10 lg:h-16 lg:w-16">
                            <AvatarImage src={preview} alt="profile preview" />
                        </Avatar>
                    )}
                    <button
                        type='button'
                        onClick={() => inputRef.current?.click()}
                        className='py-2 px-3 border border-[#0000001A] flex items-center gap-2 rounded-full cursor-pointer'
                    >
                        <MdOutlineFileUpload /> <span>Upload Photo</span>
                    </button>
                    {preview && (
                        <button
                            type='button'
                            onClick={() => { setPreview(null); setSelectedFile(null); }}
                            className='py-2 px-3 border border-[#0000001A] rounded-full cursor-pointer'
                        >
                            Remove
                        </button>
                    )}
                    <input ref={inputRef} type="file" accept='image/*' className='hidden' onChange={handleImage} />
                </div>
            </form>
        </div>
    );
};

export default ProfileInfo;