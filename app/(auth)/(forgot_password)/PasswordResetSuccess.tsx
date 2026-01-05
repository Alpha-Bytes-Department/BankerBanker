"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { Link } from "lucide-react";

const PasswordResetSuccess: React.FC = () => {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/signin");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="flex flex-col justify-center px-6 lg:px-40 py-10 space-y-6">
        {/* Logo */}
        <Link href="/"><Image src={"/logo/BANCre.png"} alt={'logo'} width={150} height={50} className='hidden lg:flex' /></Link>

        {/* Success Message */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-600">Password successfully reset</h2>

          <p className="text-sm text-gray-600">
            Set a new Your password has been reset successfully. Continue with login
          </p>
        </div>

        {/* Continue Button */}
        <div className="pt-4">
          <Button
            type="button"
            text="Continue"
            onClick={handleContinue}
            className="button-primary w-full md:w-[593px] h-14"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative w-full h-full hidden md:block">
        <Image
          src="/Auth_Images/pass_successfull.jpg"
          alt="modern architecture"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default PasswordResetSuccess;