"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import SideMenu from "@/components/ui/menu";
import { Clapperboard, FileVideo, User } from "lucide-react";
import { AdminAuth } from "@/hoc/AdminAuth";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-pink-100">
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpen={() => setMenuOpen(true)}
        role="admin"
      />

      <header className="bg-gray-900 text-white p-6 pl-24 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-4xl font-extrabold tracking-tight">BoscovFilmes Admin</h1>
          <Input placeholder="Procurar Filmes..." className="w-1/3 bg-gray-800 text-white border-none" />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center ml-16">
        <section className="w-full max-w-6xl">
          <h2 className="text-4xl font-bold text-white mb-10 text-center drop-shadow">Painel do Administrador</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
            <Link href="/admin/usuarios" className="group">
              <Card className="w-full h-80 flex flex-col items-center justify-center shadow-xl cursor-pointer border-l-8 border-pink-500 bg-white group-hover:scale-105 group-hover:border-pink-600 transition-all duration-200">
                <CardHeader className="flex flex-col items-center justify-center">
                  <User size={60} className="text-pink-500 group-hover:text-pink-600 transition" />
                  <CardTitle className="text-2xl text-center mt-2">Usuários</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <p className="text-lg text-center text-gray-700">Gerencie todos os usuários do sistema.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/filmes" className="group">
              <Card className="w-full h-80 flex flex-col items-center justify-center shadow-xl cursor-pointer border-l-8 border-purple-500 bg-white group-hover:scale-105 group-hover:border-purple-600 transition-all duration-200">
                <CardHeader className="flex flex-col items-center justify-center">
                  <Clapperboard size={60} className="text-purple-500 group-hover:text-purple-600 transition" />
                  <CardTitle className="text-2xl text-center mt-2">Filmes</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <p className="text-lg text-center text-gray-700">Adicione, edite e remova filmes facilmente.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/generos" className="group">
              <Card className="w-full h-80 flex flex-col items-center justify-center shadow-xl cursor-pointer border-l-8 border-pink-400 bg-white group-hover:scale-105 group-hover:border-pink-600 transition-all duration-200">
                <CardHeader className="flex flex-col items-center justify-center">
                  <FileVideo size={60} className="text-pink-400 group-hover:text-pink-600 transition" />
                  <CardTitle className="text-2xl text-center mt-2">Gêneros</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <p className="text-lg text-center text-gray-700">Gerencie os gêneros dos filmes.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminAuth(Home);