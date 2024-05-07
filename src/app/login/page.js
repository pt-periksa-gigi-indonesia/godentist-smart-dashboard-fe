import Image from "next/image";
import Carousel from "@/components/Utilities/Carousel";

export default function Page() {

  const images = [
    '/static/images/carousel-img/login-hero.png',
    '/static/images/carousel-img/login-hero2.jpg',
  ];

  return (
    <main className="flex min-h-screen">
      {/* Left Column for the Image */}
      
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <Carousel images={images}/>
      </div>

      <div className="w-1/2 flex flex-col items-center justify-center bg-white p-12">
        {/* Logo and Greeting */}
        <div className="mb-8 flex flex-col items-center">
          {" "}
          <div className="relative">
            <Image
              src="/static/images/godentist_logo.jpeg"
              alt="Logo"
              width={100}
              height={100}
              className="h-32 w-32"
            />
          </div>
          <h1 className="text-2xl font-bold text-blue-dentist mt-4">
            Hello there 👋
          </h1>
          <p className="text-gray-700">Welcome back, and let's get started!</p>
        </div>

        {/* Form */}
        <form className="w-full max-w-sm flex flex-col space-y-6">
          <label className="flex flex-col">
            <span className="text-gray-700">Username / Mail</span>
            <input
              type="text"
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist"
              placeholder="Enter your username or email"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist"
              placeholder="Enter your password"
            />
          </label>
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
