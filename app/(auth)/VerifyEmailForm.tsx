"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const VerifyEmailForm: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleOtpVerify = async () => {
    if (otp.length !== 6) {
      alert("Please enter a 6-digit OTP");
      return;
    }

      
    setIsVerifying(true);
    try {
      console.log(otp)
      const res = await fetch(`#################`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: otp.trim(),
        }),
      });

      const data = await res.json();
      console.log("Verify Response:", data);

      if (data.status === "success" && data.status_code === 200) {
        alert("Successfully sent otp")

        //  It may be used next.

        // localStorage.setItem("access_token", data.data?.access_token || "");
        // localStorage.setItem("refresh_token", data.data?.refresh_token || "");


      } else {
        alert(data.detail || "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to verify OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setIsResending(true);

    try {
      const res = await fetch(`############`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      console.log("Data from register4", data);

      if (data.status === "success" || data.status_code === 200) {
        setShowAlert(true);
        setResendCooldown(30);

        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      } else {
        alert(data.detail || "Failed to resend OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-900">

      <div className="px-6 md:px-20 py-16 space-y-6 dark:text-gray-300">
    
        <h1 className="text-3xl font-bold">BANCre</h1>

     
        <h2 className="text-3xl font-semibold">Verify email</h2>

        
        <p className="text-sm">
          Please check your email for next steps to reset your password
        </p>

        <div className="flex flex-col justify-center items-center gap-4">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <button onClick={handleOtpVerify} disabled={isVerifying} className="mt-20">
            {isVerifying && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin cursor-pointer" />
            )}
            Verify
          </button>
        </div>

        {showAlert && (
          <Alert
            className={`w-[90%] lg:w-[600px] mx-auto mt-6 border-green-500 transition-opacity duration-500 ${
              showAlert ? "opacity-100" : "opacity-0"
            }`}
          >
            <AlertTitle>Verification Sent</AlertTitle>
            <AlertDescription>
              A verification link or OTP has been sent to your email. Please
              check your inbox.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-8 text-center">
          <span className="text-lg">Not receive a code? </span>
          <button
            className="cursor-pointer text-blue-600"
            onClick={handleResend}
            disabled={isResending || resendCooldown > 0} 
          >
            {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
          </button>
        </div>
      </div>

      <div className="relative w-full h-full hidden md:block">
        <Image
          src="/images/authImage/verify.jpg"
          alt="buildings"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default VerifyEmailForm;
