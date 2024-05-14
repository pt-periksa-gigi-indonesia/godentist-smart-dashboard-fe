"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WaitingPage() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <div className="flex flex-col items-center bg-white p-12 rounded-3xl shadow-lg">
        <Image
          src="/static/images/godentist_logo.jpeg"
          alt="Logo"
          width={1488}
          height={423}
          className="max-w-xs md:max-w-sm lg:max-w-base mb-8"
        />
        <h1 className="text-3xl font-bold text-blue-dentist mb-4">Registration Successful!</h1>
        <p className="text-gray-700 text-lg mb-4">
          Your account is pending verification by the master admin. You will be notified once your account has been verified.
        </p>
        <button
          onClick={handleLoginRedirect}
          className="w-full p-3 bg-blue-dentist text-white rounded-lg font-medium hover:bg-blue-dentist-dark"
        >
          Go to Login
        </button>
      </div>
    </main>
  );
}
