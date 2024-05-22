"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Utilities/Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleResetPassword(event) {
    event.preventDefault();
    if (isLoading) return;
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const token = router.query.token; // Assuming the token is passed in the query string
    const body = JSON.stringify({ password: newPassword, token });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Your password has been reset successfully.");
        setErrorMessage("");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setErrorMessage(data.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const images = [
    "/static/images/carousel-img/password-hero2.jpg",
    "/static/images/carousel-img/password-hero.jpg"
  ];

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          <h1 className="text-5xl font-bold text-blue-dentist mt-4">Reset Password</h1>
          <p className="text-gray-700 font-normal text-lg py-3">Enter your new password below</p>
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
        <form className="w-full max-w-sm flex flex-col space-y-6" onSubmit={handleResetPassword}>
          <label className="flex flex-col relative">
            <span className="text-gray-700">New Password</span>
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 p-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist text-gray-900"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 focus:outline-none"
            >
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="text-gray-400"
              />
            </button>
          </label>
          <label className="flex flex-col">
            <span className="text-gray-700">Confirm New Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist text-gray-900"
              placeholder="Confirm your new password"
            />
          </label>

          <button
            type="submit"
            className="w-full p-3 bg-blue-dentist text-white rounded-lg font-medium hover:bg-blue-dentist-dark"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
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
