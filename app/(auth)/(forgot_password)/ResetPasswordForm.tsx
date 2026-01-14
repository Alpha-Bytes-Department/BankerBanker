"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { email } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import { useAuth } from "@/Provider/AuthProvider";

const formSchema = z.object({
  email: z
    .string()
    .min(2, { message: "Email should be at least 2 characters" })
    .max(50, { message: "Email should be at most 50 characters" })
    .email({ message: "Please enter a valid email address" }),
});

type ResetPasswordFormValues = z.infer<typeof formSchema>;

const ResetPasswordForm: React.FC = () => {;
  const router = useRouter();
  const {loading,forgotPassword} = useAuth();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = async (data: ResetPasswordFormValues) => {
    forgotPassword(data?.email);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="flex flex-col justify-center px-6 lg:px-40 py-10 space-y-6">
        {/* Logo */}
        <Link href="/"><Image src={"/logo/BANCre.png"} alt={'logo'} width={150} height={50} className='hidden lg:flex' /></Link>

        <h2 className="text-2xl font-semibold">Reset your password</h2>

        <p className="text-sm text-gray-600">
          Type in your registered email address to reset password
        </p>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleForgotPassword)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@gmail.com"
                      className="w-full px-4 py-7 max-w-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <Button
              type="submit"
              text={loading ? "Sending..." : "Next"}
              className="button-primary w-full md:w-[593px] h-14"
            />
          </form>
        </Form>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative w-full h-full hidden md:block">
        <Image
          src="/Auth_Images/reset_pass_one.jpg"
          alt="abstract architecture"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default ResetPasswordForm;