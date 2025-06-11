"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SideMenu from "@/components/ui/menu";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { Clapperboard, FileVideo, User } from "lucide-react";
import withAdminRoute from "@/hocs/AdminRoute"; // Importa o HOC

interface User {
  id: number;
  nome: string;
  email: string;
  apelido: string;
  dataNascimento: Date;
  tipoUsuario: string;
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  let tipoUsuario: "admin" | "user" | null = null;

  if (typeof window !== "undefined") {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("Token decodificado:", decoded);
        tipoUsuario = decoded.tipo || null;
      } catch (e) {
        tipoUsuario = null;
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpen={() => setMenuOpen(true)}
        role={tipoUsuario}
      />

      <header className="bg-gray-800 text-white p-4 ml-16">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">BoscovFilmes</h1>
          <Input placeholder="Procurar Filmes..." className="w-1/3" />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center ml-16">
        <section>
          <div className="flex gap-8">
            <Link href="/admin/usuarios" className="hover:scale-105 transition-transform">
              <Card className="w-80 h-80 flex flex-col items-center justify-center shadow-lg cursor-pointer">
                <CardHeader className="flex flex-col items-center justify-center">
                  <User size={50} />
                  <CardTitle className="text-2xl text-center">Usuários</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center ">
                  <p className="text-lg text-center">Gerenciar Usuários</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/filmes" className="hover:scale-105 transition-transform">
              <Card className="w-80 h-80 flex flex-col items-center justify-center shadow-lg cursor-pointer">
                <CardHeader className="flex flex-col items-center justify-center">
                  <Clapperboard size={50} />
                  <CardTitle className="text-2xl text-center">Filmes</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <p className="text-lg text-center">Gerenciar Filmes</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/generos" className="hover:scale-105 transition-transform">
              <Card className="w-80 h-80 flex flex-col items-center justify-center shadow-lg cursor-pointer">
                <CardHeader className="flex flex-col items-center justify-center">
                  <FileVideo size={50} />
                  <CardTitle className="text-2xl text-center">Gêneros</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <p className="text-lg text-center">Gerenciar Gêneros</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default withAdminRoute(Home);