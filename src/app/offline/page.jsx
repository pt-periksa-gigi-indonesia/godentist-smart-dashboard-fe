"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { MdWifiOff } from 'react-icons/md';
import Image from "next/image";

export default function OfflinePage() {
  const router = useRouter();

  const handleRetry = () => {
    if (navigator.onLine) {
      router.push("/");
    } else {
      alert("Still offline. Please check your internet connection.");
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      router.push("/");
    };
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [router]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-blue-dentist mb-4 text-center">Offline Mode</h1>
        <MdWifiOff className="text-gray-500 text-6xl md:text-8xl mb-4" />
        <p className="text-gray-700 text-base md:text-lg mb-4 text-center">
          It looks like you are not connected to the internet. Please check your connection and try again.
        </p>
        <button
          onClick={handleRetry}
          className="w-full p-3 bg-blue-dentist text-white rounded-lg font-medium hover:bg-blue-dentist-dark"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
