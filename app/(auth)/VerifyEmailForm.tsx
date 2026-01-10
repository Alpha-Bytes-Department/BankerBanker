"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Loader2 } from "lucide-react";
import Button from "@/components/Button";
import Link from "next/link";
import { useAuth } from "@/Provider/AuthProvider";

const VerifyEmailForm: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const { user,verifyEmail, resendOtp } = useAuth();

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

  // verify otp
  const handleOtpVerify = () => {
    setIsVerifying(true);
    verifyEmail(otp);
    setIsVerifying(false);
  };

  // Resend OTP
  const handleResend = () => {
    setIsResending(true);
    resendOtp(user?.email || "");
    setResendCooldown(30);
    setIsResending(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="flex flex-col justify-center px-6 lg:px-40 py-10 space-y-6 ">
        <Link href="/"><Image src={"/logo/BANCre.png"} alt={'logo'} width={150} height={50} className='hidden lg:flex' /></Link>

        <h2 className="text-3xl font-semibold">Verify </h2>

        <p className="text-sm">
          Please check your email for next steps to reset your password
        </p>

        <div className="flex flex-col justify-center items-center gap-4 mt-8">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup className="gap-5">
              <InputOTPSlot className="w-14 h-14 rounded-lg border border-[#bdb9b9]" index={0} />
              <InputOTPSlot className="w-14 h-14 rounded-lg border border-[#bdb9b9]" index={1} />
              <InputOTPSlot className="w-14 h-14 rounded-lg border border-[#bdb9b9]" index={2} />
              <InputOTPSlot className="w-14 h-14 rounded-lg border border-[#bdb9b9]" index={3} />
              <InputOTPSlot className="w-14 h-14 rounded-lg border border-[#bdb9b9]" index={4} />
              <InputOTPSlot className="w-14 h-14 rounded-lg border border-[#bdb9b9]" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {/* Updated Verify Button */}
          <div className="w-full flex justify-center mt-8">
            <Button
              type="button"
              text={isVerifying ? "Verifying..." : "Verify Email"}
              onClick={handleOtpVerify}
              className="button-primary w-full md:w-[593px] h-14"
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <span className="text-lg">Not receive a code? </span>
          <button
            className={`cursor-pointer text-blue-600 inline-flex items-center gap-2 ${
              isResending || resendCooldown > 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleResend}
            disabled={isResending || resendCooldown > 0}
          >
            {isResending && <Loader2 className="h-4 w-4 animate-spin" />}
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
          </button>
        </div>
      </div>

      <div className="relative w-full h-full hidden md:block">
        <Image
          src="/Auth_Images/verify_email.jpg"
          alt="buildings"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default VerifyEmailForm;