import { User } from '@/types/auth';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRef, useState, useEffect } from 'react';
import { CiMail } from 'react-icons/ci';
import { FiPhone } from 'react-icons/fi';
import { MdOutlineFileUpload } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';

const ProfileInfo = ({ user, onDataChange }: { user: User | null; onDataChange?: (data: any) => void }) => {
    const [preview, setPreview] = useState<string | null>(null)
    const [isEdit, setEdit] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });
    const inputRef = useRef<HTMLInputElement | null>(null)


    const handleImageButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        inputRef?.current?.click()
    }

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (!file) return;

        // Store the selected file
        setSelectedFile(file);

        // Create blob URL for preview
        const url = URL.createObjectURL(file);
        setPreview(url);
    };

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

    // Send updated data to parent whenever formData or file changes
    useEffect(() => {
        if (isEdit && onDataChange) {
            const dataToSend: any = { profile: formData };
            if (selectedFile) {
                dataToSend.profileFile = selectedFile;
            }
            onDataChange(dataToSend);
        }
    }, [formData, selectedFile, isEdit]);


    return (
        <div className='flex flex-col gap-5 mt-5'>
            <div className='flex items-center justify-between'>
                <h1>Personal Information</h1>
                <button
                    type='button'
                    onClick={() => {
                        if (isEdit) {
                            handleSave();
                        } else {
                            setEdit(true);
                        }
                    }}
                    className={`p-2 rounded-full cursor-pointer transition-all ${isEdit
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                >
                    <MdEdit className='text-lg' />
                </button>
            </div>
            <form action="submit" className={`grid grid-cols-1 lg:grid-cols-2 gap-5 p-4 rounded-lg transition-all ${isEdit ? 'bg-blue-50 border-2 border-blue-300' : 'bg-transparent border-2 border-transparent'
                }`}>
                {/* form  */}
                <div className='flex flex-col'>
                    <label htmlFor="first_name">
                        First Name</label>
                    <input
                        type="text"
                        id='first_name'
                        placeholder='John'
                        value={formData.first_name}
                        onChange={handleInputChange}
                        disabled={!isEdit}
                        className='border-0 focus:outline-0 bg-[#F3F3F5] py-2 px-3 rounded-xl'
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="last_name">
                        Last Name</label>
                    <input
                        type="text"
                        id='last_name'
                        placeholder='Doe'
                        value={formData.last_name}
                        onChange={handleInputChange}
                        disabled={!isEdit}
                        className='border-0 focus:outline-0 bg-[#F3F3F5] py-2 px-3 rounded-xl'
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="email"> Email Address </label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl'><CiMail className='text-lg text-[#99A1AF]' /><input
                        type="text"
                        id='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEdit}
                        className='border-0 focus:outline-0'
                    /></span>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="phone">Phone Number </label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl'><FiPhone className='text-lg text-[#99A1AF]' /><input
                        type="text"
                        id='phone'
                        placeholder='+1 (555) 123-4567'
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEdit}
                        className='border-0 focus:outline-0'
                    /></span>
                </div>
                {/* image  */}
                <div className='flex w-full items-center gap-3'>
                    {preview && (
                        <Avatar className="h-10 w-10 lg:h-16 lg:w-16">
                            <AvatarImage
                                src={preview || (process.env.NEXT_PUBLIC_BASE_URL + (user?.profile_photo || ""))}
                                alt="profile"
                            />
                        </Avatar>
                    )}
                    <div>{<button type='button' onClick={handleImageButton} className='py-2 px-3 border border-[#0000001A] outline-[#0000001A] flex items-center gap-2 rounded-full cursor-pointer'><MdOutlineFileUpload /> <span>Upload Photo</span></button>}</div>
                    {preview && <button type='button' onClick={(e) => {
                        e.preventDefault();
                        setPreview(null);
                        setSelectedFile(null);
                        setBase64Image(null);
                    }} className='py-2 px-3 border border-[#0000001A] outline-[#0000001A] rounded-full cursor-pointer'>Remove</button>}
                    <input ref={inputRef} type="file" accept='image/*' className='hidden' alt="image" onChange={handleImage} />
                </div>
            </form>
        </div>
    );
};

export default ProfileInfo;