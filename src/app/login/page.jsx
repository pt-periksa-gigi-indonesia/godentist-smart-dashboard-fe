"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Utilities/Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { setCookies } from "@/api/auth/cookiesHandler";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(event) {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const body = JSON.stringify({ email, password });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body
      });

      const data = await response.json();
      if (response.ok) {
        setCookies(data);
        setErrorMessage("");
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const images = [
    "/static/images/carousel-img/login-hero.png",
    "/static/images/carousel-img/login-hero2.jpg"
  ];

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="flex flex-col md:flex-row min-h-screen">
      {/* Left Column for the Image */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-100 p-4">
        <Image
          src="/static/images/godentist_logo.jpeg"
          alt="Logo"
          width={1488}
          height={423}
          className="max-w-xs md:max-w-sm lg:max-w-base mb-8 px-12 md:px-0"
        />
        <Carousel images={images} />
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white p-4 md:p-12">
        {/* Logo and Greeting */}
        <div className="mb-8 flex flex-col items-center px-3 md:px-0">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-dentist mt-4">Hello there 👋</h1>
          <p className="text-gray-700 font-normal text-base md:text-lg py-3 text-center md:text-left">Welcome back, and let's get started!</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full max-w-sm mb-6 p-3 bg-red-100 text-red-700 border border-red-200 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form className="w-full max-w-sm flex flex-col space-y-6 px-6 md:px-0" onSubmit={handleLogin}>
          <label className="flex flex-col">
            <span className="text-gray-700">Email</span>
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist text-gray-900"
              placeholder="Enter your username or email"
            />
          </label>
          <label className="flex flex-col relative">
            <span className="text-gray-700">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
                className="text-gray-400"
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
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* Additional Links */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-dentist hover:text-blue-dentist-dark">Register Now</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
