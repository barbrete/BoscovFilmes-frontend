"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import ModalAvaliacao from "@/components/ui/modal/modal_avaliation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SideMenu from "@/components/ui/menu";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface Movie {
  id: number;
  titulo: string;
  diretor: string;
  ano: number;
  generoFilme: string;
  poster: string;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [movie, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<{ title: string } | null>(null);

  const movies = [
    { id: 1, title: "Inception", poster: "/home_page/posters/filmes_us.jpg" },
    { id: 2, title: "Interstellar", poster: "/posters/interstellar.jpg" },
    { id: 3, title: "The Dark Knight", poster: "/posters/darkknight.jpg" },
    { id: 4, title: "Parasite", poster: "/posters/parasite.jpg" }
  ];

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

useEffect(() => {
  async function buscarFilmesRecentes() {
    try{
        const resposta = await axios.get("http:localhos/3000/filmes/recentes");
        setMovies(resposta.data);;
    }
    catch (error){
      console.error("Erro ao buscar filmes recentes:", error);
    }
  }
  buscarFilmesRecentes();
}, []);

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
    
      <main className="flex-grow max-w-6xl mx-auto p-8 ml-16">
        <h2 className="text-2xl font-semibold mb-6">Filmes Recentes</h2>
        {movie.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Card key={movie.id} className="shadow-lg">
                <CardHeader className="h-72 relative p-0">
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
                  <Button
                    className="mt-2 w-full cursor-pointer mb-5"
                    onClick={() => {
                      setSelectedMovie(movie);
                      setModalOpen(true);
                    }}
                  >
                    Avaliar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>Nenhum filme recente encontrado.</p>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Card key={movie.id} className="shadow-lg ">
              <CardHeader className="h-72 relative p-0">
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
                <Button
                  className="mt-2 w-full cursor-pointer mb-5"
                  onClick={() => {
                    setSelectedMovie(movie);
                    setModalOpen(true);
                  }}
                >
                  Avaliar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <ModalAvaliacao
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        movieTitle={selectedMovie?.title || ""}
        onSubmit={(rating, comment) => {
          if (selectedMovie) {
            console.log(`Avaliação para ${selectedMovie.title}: ${rating} estrelas, comentário: ${comment}`);
          }
          setModalOpen(false);
        }}
      />

      <footer className="bg-gray-800 text-white p-4 text-center ml-16">
        © {new Date().getFullYear()} BoscovFilmes. Todos direitos reservados.
      </footer>
    </div>
  );
}