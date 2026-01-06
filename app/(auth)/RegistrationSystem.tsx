
"use client"
import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, Circle, ChevronDown } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Types
type CustomerType = 'Broker' | 'Lender' | 'Sponsor';

interface RegistrationFormData {
  customerType: CustomerType;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

// Main Component
export default function RegistrationSystem() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    customerType: 'Broker',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationFormData, string>>>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const customerTypes: CustomerType[] = ['Broker', 'Lender', 'Sponsor'];

  const slides = [
    {
      image: "/images/Auth_Images/sigup1.jpg",
      title: "Discover verified lending opportunities.",
      description: "Access AI-processed property data, evaluate deals faster, and provide offers confidently — all in one place."
    },
    {
      image: "/images/Auth_Images/sigup2.jpg",
      title: "Smarter decisions, faster closings.",
      description: "Review standardized loan packages, analyze instantly, and close deals with transparency and speed."
    },
    {
      image: "/images/Auth_Images/sigup3.jpg",
      title: "Discover verified lending opportunities.",
      description: "Access AI-processed property data, evaluate deals faster, and provide offers confidently — all in one place."
    },
    {
      image: "/images/Auth_Images/sigup4.jpg",
      title: "Manage your properties smarter",
      description: "Upload property documents, let AI analyze your data, and get instant loan offers from verified lenders."
    },
    {
      image: "/images/Auth_Images/sigup5.jpg",
      title: "Smarter decisions, faster closings.",
      description: "Review standardized loan packages, analyze instantly, and close deals with transparency and speed."
    },
  ];

  // Password validation
  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasNumber: /\d/.test(formData.password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const passwordStrength = Object.values(passwordValidation).filter(Boolean).length;
  const progressPercentage = (passwordStrength / 3) * 100;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegistrationFormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.minLength || !passwordValidation.hasNumber || !passwordValidation.hasSymbol) {
      newErrors.password = 'Password must meet all requirements';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to terms and privacy policies';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      
      if (formData.customerType === 'Sponsor') {
        router.push('/signin/verify_email');
      } else {
        router.push('/register/upload');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-lg mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/"><Image src={"/logo/BANCre.png"} alt={'logo'} width={150} height={50} className='hidden lg:flex' /></Link>
          </div>
          {/* Title */}
          <h2 className="text-3xl font-bold mb-2">Registration</h2>
          <p className="text-gray-600 mb-8">Let&apos;s get you all set up so you can access your account.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Type - Modern Dropdown */}
            <div className='relative'>
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600 z-10">
                Customer Type<span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
              >
                <span className="text-gray-900">{formData.customerType}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                  {customerTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, customerType: type });
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                        formData.customerType === type ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid lg:grid-cols-2 gap-4">
              <div className='relative'>
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-full"
                  placeholder="Prayas"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mazumder"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid lg:grid-cols-2 gap-4">
              <div className='relative'>
                 <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="prayasmazumder150@gmail.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div className='relative'>
                 <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000 0000 0000"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>
            </div>

            {/* Password */}
            <div className='relative'>
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">
                  Password<span className="text-red-500">*</span>
                </label>
              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className='relative'>
              <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">
                  Confirm Password<span className="text-red-500">*</span>
                </label>
              <div >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Password Strength Bar */}
            <div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Password Requirements */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  {passwordValidation.minLength ? (
                    <CheckCircle2 size={18} className="text-blue-600" />
                  ) : (
                    <Circle size={18} className="text-gray-400" />
                  )}
                  <span className={passwordValidation.minLength ? 'text-blue-600' : 'text-gray-600'}>
                    8 characters minimum
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordValidation.hasNumber ? (
                    <CheckCircle2 size={18} className="text-blue-600" />
                  ) : (
                    <Circle size={18} className="text-gray-400" />
                  )}
                  <span className={passwordValidation.hasNumber ? 'text-blue-600' : 'text-gray-600'}>
                    a number
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordValidation.hasSymbol ? (
                    <CheckCircle2 size={18} className="text-blue-600" />
                  ) : (
                    <Circle size={18} className="text-gray-400" />
                  )}
                  <span className={passwordValidation.hasSymbol ? 'text-blue-600' : 'text-gray-600'}>
                    a symbol
                  </span>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  I agree to all the <span className="text-red-500">Terms</span> and <span className="text-red-500">Privacy Policies</span>
                </span>
              </label>
              {errors.agreedToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreedToTerms}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              text="Sign Up"
              className="button-primary w-full h-14"
            />

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account? <span className="text-red-500 cursor-pointer">
                <Link href={"/signin"}>Login</Link>
              </span>
            </p>
          </form>
        </div>
      </div>

      
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
        <button className="absolute top-8 right-8 text-white flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Support
        </button>

        <div className="relative h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={slide.image}
                alt="Background"
                fill
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-12 text-center">
                <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                <p className="text-lg max-w-2xl">{slide.description}</p>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
            <button
              onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
              className="text-white hover:text-gray-300"
            >
              ‹
            </button>
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
              className="text-white hover:text-gray-300"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}