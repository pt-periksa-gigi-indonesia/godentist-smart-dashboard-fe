"use client";
import {deleteCookies} from '@/api/auth/cookiesHandler';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import {checkToken} from '@/api/auth/validateAccessToken';

export default function Home() {
  const router = useRouter();
  async function handleLogout() {
    deleteCookies();
    router.push('/login');
  }
  
  async function foo() {
    const validate = await checkToken();
    if(!validate){
      router.push('/login');
    }
  }

  useEffect(() => {
    foo();
  }, []); 
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button
        onClick={handleLogout}
        className="p-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700"
      />
    </main>
  );
}
