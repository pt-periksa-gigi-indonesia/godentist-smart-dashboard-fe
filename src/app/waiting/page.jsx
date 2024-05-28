"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { getUserRole } from "@/api/auth/cookiesHandler";
import Image from "next/image";

export default function WaitingPage() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [userRole, setUserRole] = useState('');

  const fetchUserRole = async () => {
    try {
      const role = await getUserRole();
      setUserRole(role);
      if (role === 'admin') {
        setIsVerified(true);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 md:p-8">
      <div className="flex flex-col items-center bg-white p-6 md:p-12 rounded-3xl shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl">
        <Image
          src="/static/images/godentist_logo.jpeg"
          alt="Logo"
          width={1488}
          height={423}
          className="max-w-xs md:max-w-sm lg:max-w-base mb-4 md:mb-8 px-12 md:px-0"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-blue-dentist mb-4 text-center md:text-left">Registration Successful!</h1>
        {isVerified ? (
          <p className="text-gray-700 text-base md:text-lg mb-4 text-center md:text-left">
            Your account has been verified. You can now log in.
          </p>
        ) : (
          <p className="text-gray-700 text-base md:text-lg mb-4 text-center md:text-left">
            Your account is pending verification by the master admin. You will be notified once your account has been verified.
          </p>
        )}
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
