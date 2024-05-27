"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Utilities/Carousel";

import { forgotPassword } from "@/api/lib/userHandler";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleForgotPassword(event) {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const body = JSON.stringify({ email });

    try {
      await forgotPassword(email);
      setSuccessMessage("Reset instructions sent to your email. Please check your inbox.");
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage('');
    } finally {
      setIsLoading(false);
    }
  }

  const images = [
    "/static/images/carousel-img/password-hero.jpg",
    "/static/images/carousel-img/password-hero2.jpg"
  ];

  return (
    <main className="flex min-h-screen">
      {/* Left Column for the Image */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100">
        <Image
          src="/static/images/godentist_logo.jpeg"
          alt="Logo"
          width={1488}
          height={423}
          className="max-w-xs md:max-w-sm lg:max-w-base mb-8"
        />
        <Carousel images={images} />
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center bg-white p-12">
        {/* Logo and Greeting */}
        <div className="mb-8 flex flex-col items-center">
          <h1 className="text-5xl font-bold text-blue-dentist mt-4">Forgot Password</h1>
          <p className="text-gray-700 font-normal text-lg py-3">Enter your email to reset your password</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full max-w-sm mb-6 p-3 bg-red-100 text-red-700 border border-red-200 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="w-full max-w-sm mb-6 p-3 bg-green-100 text-green-700 border border-green-200 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form className="w-full max-w-sm flex flex-col space-y-6" onSubmit={handleForgotPassword}>
          <label className="flex flex-col">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist text-gray-900"
              placeholder="Enter your email"
            />
          </label>

          <button
            type="submit"
            className="w-full p-3 bg-blue-dentist text-white rounded-lg font-medium hover:bg-blue-dentist-dark"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Instructions"}
          </button>

          {/* Additional Links */}
          <p className="text-center text-sm text-gray-600">
            Remembered your password?{" "}
            <Link href="/login" className="text-blue-dentist hover:text-blue-dentist-dark">Login Now</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
