"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SideMenu from "@/components/ui/menu";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const movies = [
    { id: 1, title: "Inception", poster: "/movies/inception.jpg" },
    { id: 2, title: "Interstellar", poster: "/movies/interstellar.jpg" },
    { id: 3, title: "The Dark Knight", poster: "/movies/darkknight.jpg" },
    { id: 4, title: "Parasite", poster: "/movies/parasite.jpg" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Renderiza o menu lateral */}
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpen={() => setMenuOpen(true)}
      />

      <header className="bg-gray-800 text-white p-4 ml-16"> {/* ajuste do margin-left para não sobrepor o menu */}
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">BoscovFilmes</h1>
          <Input placeholder="Search movies..." className="w-1/3" />
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto p-8 ml-16">
        <h2 className="text-2xl font-semibold mb-6">Filmes Recentes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Card key={movie.id} className="shadow-lg">
              <CardHeader className="h-48 relative">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover rounded-t-md"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-bold">
                  {movie.title}
                </CardTitle>
                <Button className="mt-2 w-full">Avaliar</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center ml-16">
        © {new Date().getFullYear()} MovieLand. All rights reserved.
      </footer>
    </div>
  );
}