"use client"
import React from "react";
import Link from "next/link";
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-8">Página não encontrada.</p>
      <Image
        src="/erro404.png"
        alt="Página não encontrada"
        width={400}
        height={300}
        className="mb-8"
      />
      <Link href="/" className="px-6 py-3 bg-pink-600 text-white rounded hover:bg-blue-700">
        Voltar para a Home
      </Link>
    </div>
  );
}