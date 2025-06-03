"use client"
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function InitialPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };
  const handleRegister = () => {
    router.push('/register');
  };
  return (
    <div className="min-h-screen bg-gray-700">

      <header className="p-4 bg-gray-800 bg-opacity-80 backdrop-blur-sm text-center">
        <h1 className="text-xl font-bold text-white">BoscovFilmes</h1>
      </header>

      <main className="flex flex-row h-[calc(100vh-64px)]">
        <div className="relative w-1/2 h-full">
          <Image
            src="/page/capa.jpg"
            alt="capa"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center p-8 w-1/2 items-center" >
          <div className='flex flex-col items-center justify-center'>
            <h1 className="text-3xl font-bold text-white">Seja Bem-Vindo ao BoscovFilmes</h1>
            <h2 className="text-xl font-lg text-white">Um sistema para você criticar midias a vontade</h2>
          </div>

          <div className='flex flex-col gap-20 mt-8 w-full max-w-md'>
            <Button className="mt-4 w-full h-14 text-lg cursor-pointer"
              onClick={handleLogin}
            >
              Login
            </Button>

            <Button type="submit" className="w-full h-14 text-lg cursor-pointer"
              onClick={handleRegister}
            >
              Cadastro
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
