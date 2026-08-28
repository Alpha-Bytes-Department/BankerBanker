"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import { useAuth } from "@/Provider/AuthProvider";
import { toast } from "sonner";

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password should be at least 8 characters" })
      .max(30, { message: "Password should be at most 30 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password should be at least 8 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SetNewPasswordFormValues = z.infer<typeof formSchema>;

const SetNewPasswordForm: React.FC = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { authState, resetPassword, loading } = useAuth();
  const router = useRouter();

  const form = useForm<SetNewPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSetPassword = async (data: SetNewPasswordFormValues) => {
    let email = authState?.email;
    if (!email && typeof window !== "undefined") {
      try {
        const savedAuth = localStorage.getItem("Authstate");
        if (savedAuth) {
          const parsed = JSON.parse(savedAuth);
          email = parsed?.email;
        }
      } catch (e) {
        console.error("Failed to read Authstate", e);
      }
    }

    if (!email) {
      toast.error("Session expired. Please start forgot password flow again.");
      router.push("/reset_pass_one");
      return;
    }

    await resetPassword(email, data.newPassword, data.confirmPassword);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="flex flex-col justify-center px-6 lg:px-40 py-10 space-y-6">
        {/* Logo */}
        <Link href="/">
          <Image
            src={"/logo/BANCre.png"}
            alt={'logo'}
            width={150}
            height={50}
            className='hidden lg:flex'
          />
        </Link>
        <h2 className="text-2xl font-semibold">Reset password</h2>
        <p className="text-sm text-gray-600">
          Set a new password for your account
        </p>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSetPassword)}
            className="space-y-5"
          >
            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password *</FormLabel>
                  <FormControl>
                    <div className="relative w-full md:w-[593px] h-14">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="pr-14 rounded-4xl w-full h-full"
                        {...field}
                      />

                      {/* Vertical separator */}
                      <span className="absolute top-3 bottom-3 right-14 w-px bg-gray-300" />

                      {/* Eye Icon */}
                      <button
                        type="button"
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password *</FormLabel>
                  <FormControl>
                    <div className="relative w-full md:w-[593px] h-14">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        className="pr-14 rounded-4xl w-full h-full"
                        {...field}
                      />

                      <span className="absolute top-3 bottom-3 right-14 w-px bg-gray-300" />

                      <button
                        type="button"
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              isDisabled={loading}
              text={loading ? "Resetting..." : "Confirm"}
              className="button-primary w-full md:w-[593px] h-14"
            />

            <div className="text-center text-sm">
              <span className="text-gray-600">
                Remember your password?{" "}
              </span>
              <Link href="/signin" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </div>
          </form>
        </Form>
      </div>
      <div className="relative w-full h-full hidden md:block">
        <Image
          src="/images/Auth_Images/provide_pass.jpg"
          alt="modern architecture"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default SetNewPasswordForm;