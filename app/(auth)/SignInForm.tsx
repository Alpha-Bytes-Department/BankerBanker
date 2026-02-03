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
import { MdSupportAgent } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Button from "@/components/Button";
import { useAuth } from "@/Provider/AuthProvider";


const formSchema = z.object({
  email: z
    .string()
    .min(2, { message: "Email should be at least 2 characters" })
    .max(50, { message: "Email should be at most 50 characters" })
    .email({ message: "Please enter a valid email address" }),

  password: z
    .string()
    .min(8, { message: "Password should be at least 8 characters" })
    .max(30, { message: "Password should be at most 30 characters" }),
  // .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, {
  //   message:
  //     "Password must contain uppercase, lowercase, number, and special character",
  // }),

  remember_me: z.boolean(),
});

type SignInFormValues = z.infer<typeof formSchema>;

const SignInForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember_me: false,
    },
  });


  // <div className='relative'>
  //   <label className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600">
  //     First Name <span className="text-red-500">*</span>
  //   </label>
  //   <input
  //     type="text"
  //     value={formData.first_name}
  //     onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
  //     className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-full"
  //     placeholder="enter your first name"
  //   />
  //   {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
  // </div>


  // handling sign in action
  const handleSign = (data: SignInFormValues) => {
    login(data.email, data.password, data.remember_me);
  };

  // // handling google login
  // const handleGoogleLogin = async () => {
  //   const res = await fetch("http://localhost:8080/api/v1/users/google");
  //   const data = await res.json();
  //   console.log("checking google login", data);
  // }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="flex flex-col justify-center items-center py-10 space-y-6 ">
        <div>
          {/* Logo */}
          <div className="mb-5">
            <Link href="/"><Image src={"/logo/BANCre.png"} alt={'logo'} width={150} height={50} className='hidden lg:flex' /></Link>
            <h2 className="text-2xl font-semibold my-2">Log in</h2>
            <p className="text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600">
                Create now
              </Link>
            </p>
          </div>
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSign)} className="space-y-5">
              {/* Email */}
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
              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative" >
                    <FormLabel className="absolute -top-2 left-3 bg-white px-1 text-sm text-blue-600" >Password</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="password"
                          className="w-full px-4 py-7 max-w-xl border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                          {...field}
                        />
                        {/* <span className="absolute top-3 bottom-3 right-14 w-px bg-gray-300" /> */}
                        {/* Eye Icon */}
                        <button
                          type="button"
                          className="absolute right-10 top-2/6 -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />

                    {/* Remember Me + Forgot Password */}
                    <div className="mt-2 w-full md:w-[593px] flex justify-between items-center">
                      <div className="flex items-center text-sm space-x-2">
                        <FormField
                          control={form.control}
                          name="remember_me"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  id="toggle"
                                />
                              </FormControl>
                              <Label
                                htmlFor="toggle"
                                className="text-blue-600"
                              >
                                Remember me
                              </Label>
                            </FormItem>
                          )}
                        />
                      </div>

                      <Link href="/reset_pass_one" className="text-blue-600 text-sm underline">
                        Forgot Password?
                      </Link>
                    </div>
                  </FormItem>
                )}
              />

              {/* Login Button */}
              <Button
                type="submit"
                text="Sign In"
                className="button-primary w-full md:w-[593px] h-14"
              />

              {/* Divider */}
              <div className="flex items-center gap-4 my-4 w-full md:w-[593px] justify-center">
                <hr className="flex-1 border-gray-300" />
                <span className="text-gray-400">OR</span>
                <hr className="flex-1 border-gray-300" />
              </div>
            </form>
          </Form>
          {/* Google Button */}
          <Link
            href={"http://localhost:8080/api/v1/users/google"}
            className="w-full md:w-[593px] h-14 rounded-4xl border flex items-center justify-center gap-2 hover:bg-gray-100 cursor-pointer"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative w-full h-full hidden md:block">
        <Image
          src="/images/Auth_Images/login.jpg"
          alt="buildings"
          fill
          className="object-cover"
        />

        <div className="absolute top-8 w-full text-center text-white px-6">
          <div className="flex items-center gap-1 justify-center">
            <MdSupportAgent />
            <h3 className="text-lg font-medium tracking-wide">Support</h3>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white px-6">
          <h2 className="text-3xl font-semibold">Introducing new features</h2>
          <p className="mt-4 text-sm opacity-90 max-w-md mx-auto">
            Upload documents, analyze instantly, and connect with lenders — all
            in one platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
