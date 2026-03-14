import Button from '@/components/Button';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '@/Provider/api';

// Zod validation schema
const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
        .min(8, 'New password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const ChangePassword = () => {
    const [showPasswordForCurrent, setShowPasswordForCurrent] = useState(false);
    const [showPasswordForNew, setShowPasswordForNew] = useState(false);
    const [showPasswordForConfirm, setShowPasswordForConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const handleChangePassword = async (data: PasswordFormData) => {
        try {
            setIsLoading(true);
            const response = await api.post('/api/accounts/change-password/', {
                current_password: data.currentPassword,
                new_password: data.newPassword,
                confirm_password : data.confirmPassword,
            });

            if (response.status !== 200) {
                throw new Error(response.data?.message || 'Failed to change password');
            }

            toast.success('Password changed successfully!');
            reset();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to change password. Please try again.';
            toast.error(errorMessage);
            console.error('Error changing password:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='flex flex-col gap-5 mt-5 pb-10'>
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit(handleChangePassword)} className='grid grid-cols-1 gap-5'>
                {/* Current Password Field */}
                <div className='flex flex-col'>
                    <label htmlFor="currentPassword"> Current Password </label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl'>
                        <input
                            type={showPasswordForCurrent ? "text" : "password"}
                            id='currentPassword'
                            placeholder='Enter current password'
                            className='border-0 flex-1 focus:outline-0'
                            {...register('currentPassword')}
                        />
                        {showPasswordForCurrent ? <EyeOff onClick={() => setShowPasswordForCurrent(!showPasswordForCurrent)} size={20} className='cursor-pointer' /> : <Eye onClick={() => setShowPasswordForCurrent(!showPasswordForCurrent)} size={20} className='cursor-pointer' />}
                    </span>
                    {errors.currentPassword && <p className='text-red-500 text-sm mt-1'>{errors.currentPassword.message}</p>}
                </div>

                {/* New Password Field */}
                <div className='flex flex-col'>
                    <label htmlFor="newPassword"> New Password </label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl'>
                        <input
                            type={showPasswordForNew ? "text" : "password"}
                            id='newPassword'
                            placeholder='Enter new password'
                            className='border-0 flex-1 focus:outline-0'
                            {...register('newPassword')}
                        />
                        {showPasswordForNew ? <EyeOff onClick={() => setShowPasswordForNew(!showPasswordForNew)} size={20} className='cursor-pointer' /> : <Eye onClick={() => setShowPasswordForNew(!showPasswordForNew)} size={20} className='cursor-pointer' />}
                    </span>
                    {errors.newPassword && <p className='text-red-500 text-sm mt-1'>{errors.newPassword.message}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className='flex flex-col'>
                    <label htmlFor="confirmPassword"> Confirm Password </label>
                    <span className='flex items-center gap-2 bg-[#F3F3F5] py-2 px-3 rounded-xl'>
                        <input
                            type={showPasswordForConfirm ? "text" : "password"}
                            id='confirmPassword'
                            placeholder='Confirm new password'
                            className='border-0 flex-1 focus:outline-0'
                            {...register('confirmPassword')}
                        />
                        {showPasswordForConfirm ? <EyeOff onClick={() => setShowPasswordForConfirm(!showPasswordForConfirm)} size={20} className='cursor-pointer' /> : <Eye onClick={() => setShowPasswordForConfirm(!showPasswordForConfirm)} size={20} className='cursor-pointer' />}
                    </span>
                    {errors.confirmPassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword.message}</p>}
                </div>

                <Button text='Update Password' type='submit' isDisabled={isLoading} />
            </form>
        </div>
    );
};

export default ChangePassword;