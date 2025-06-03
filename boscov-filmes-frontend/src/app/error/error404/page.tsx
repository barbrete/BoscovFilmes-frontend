"use client"
import React from "react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-8">Página não encontrada.</p>
      <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
        Voltar para a Home
      </Link>
    </div>
  );
}