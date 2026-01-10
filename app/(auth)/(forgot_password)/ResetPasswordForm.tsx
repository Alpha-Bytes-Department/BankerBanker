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
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";

const formSchema = z.object({
  email: z
    .string()
    .min(2, { message: "Email should be at least 2 characters" })
    .max(50, { message: "Email should be at most 50 characters" })
    .email({ message: "Please enter a valid email address" }),
});

type ResetPasswordFormValues = z.infer<typeof formSchema>;

const ResetPasswordForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleResetPassword = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      console.log("Reset password for:", data.email);
      //We will call the api fron here..!!
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      alert("Password reset link sent to your email!");
      router.push("/reset_pass_one/reset_pass_two");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            onSubmit={form.handleSubmit(handleResetPassword)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="prayasmazumder150@gmail.com"
                      className="w-full md:w-[593px] h-14 rounded-4xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

           
            <Button
              type="submit"
              text={isLoading ? "Sending..." : "Next"}
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