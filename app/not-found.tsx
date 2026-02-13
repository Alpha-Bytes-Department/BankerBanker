import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-5">
      <Link href="/">
        <Image src={"/logo/BANCre.png"} width={200} height={200} alt="logo" className="mb-5" />
      </Link>
      <h1 className="text-4xl font-bold mb-4"><span className="text-red-700">404</span> - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="text-blue-500 underline hover:text-blue-700 transition-colors">
        Go back to home
      </Link>
    </div>
  );
}
