"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Utilities/Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const images = [
    "/static/images/carousel-img/login-hero2.jpg",
    "/static/images/carousel-img/login-hero.png"
  ];

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 

  async function handleRegister(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const body = JSON.stringify({ name, email, password });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body
      });

      const data = await response.json();
      if (response.ok) {
        setErrorMessage('');
        router.push("/login");
      } else {
        setErrorMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred: " + error.message); 
    }
  }

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

      {/* Right Column for the Registration Form */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-white p-12">
        {/* Logo and Greeting */}
        <div className="mb-8 flex flex-col items-center">
          <h1 className="text-5xl font-bold text-blue-dentist mt-4">Join us today 🚀</h1>
          <p className="text-gray-700 text-lg py-3">Create your account and get started!</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full max-w-sm mb-6 p-3 bg-red-100 text-red-700 border border-red-200 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form className="w-full max-w-sm flex flex-col space-y-6" onSubmit={handleRegister}>
          <label className="flex flex-col">
            <span className="text-gray-700">Full Name</span>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist text-gray-900"
              placeholder="Enter your full name"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist text-gray-900"
              placeholder="Enter your email address"
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
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist text-gray-900"
              placeholder="Create a password"
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
          <label className="flex flex-col relative">
            <span className="text-gray-700">Confirm Password</span>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist text-gray-900"
              placeholder="Re-enter your password"
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
          <button
            type="submit"
            className="w-full p-3 bg-blue-dentist text-white rounded-lg font-medium hover:bg-blue-dentist-dark"
          >
            Register
          </button>

          {/* Additional Links */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-dentist hover:text-blue-dentist-dark">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
