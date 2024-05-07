import Image from "next/image";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen">
      {/* Left Column for the Image */}
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <div className="w-3/4 p-4 h-5/6 bg-white shadow-lg rounded-3xl relative">
          <Image
            src="/static/images/login-hero.png"
            alt="Decorative"
            layout="fill"
            className="rounded-2xl object-cover"
            priority
          />
        </div>
      </div>

      {/* Right Column for the Registration Form */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-white p-12">
        {/* Logo and Greeting */}
        <div className="mb-8 flex flex-col items-center">
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
            Join us today 🚀
          </h1>
          <p className="text-gray-700">Create your account and get started!</p>
        </div>

        {/* Form */}
        <form className="w-full max-w-sm flex flex-col space-y-6">
          <label className="flex flex-col">
            <span className="text-gray-700">Full Name</span>
            <input
              type="text"
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist"
              placeholder="Enter your full name"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist"
              placeholder="Enter your email address"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist"
              placeholder="Create a password"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-gray-700">Confirm Password</span>
            <input
              type="password"
              className="mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-dentist"
              placeholder="Re-enter your password"
            />
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
            <a
              href="/login"
              className="text-blue-dentist hover:text-blue-dentist-dark"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
