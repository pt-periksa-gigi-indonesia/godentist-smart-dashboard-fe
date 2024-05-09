"use client";

import { useState } from "react";
import Image from "next/image";
import Carousel from "@/components/Utilities/Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  const images = [
    "/static/images/carousel-img/login-hero.png",
    "/static/images/carousel-img/login-hero2.jpg",
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
          {" "}
          <h1 className="text-5xl font-bold text-blue-dentist mt-4">
            Hello there 👋
          </h1>
          <p className="text-gray-700 text-lg py-3">
            Welcome back, and let's get started!
          </p>
        </div>

        {/* Form */}
        <form className="w-full max-w-sm flex flex-col space-y-6">
          <label className="flex flex-col">
            <span className="text-gray-700">Username / Mail</span>
            <input
              type="text"
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist text-gray-900"
              placeholder="Enter your username or email"
            />
          </label>
          <label className="flex flex-col relative">
            <span className="text-gray-700">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              className="mt-1 p-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist text-gray-900"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 focus:outline-none"
            >
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="text-gray-400" // Tailwind classes for color and size
              />
            </button>
          </label>

          {/* Forgot Password Link */}
          <a
            href="/forgot-password"
            className="text-right text-sm text-blue-dentist hover:text-blue-dentist-dark"
          >
            Forgot your password?
          </a>

          <button
            type="submit"
            className="w-full p-3 bg-blue-dentist text-white rounded-lg font-medium hover:bg-blue-dentist-dark"
          >
            Login
          </button>

          {/* Additional Links */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-dentist hover:text-blue-dentist-dark"
            >
              Register Now
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
