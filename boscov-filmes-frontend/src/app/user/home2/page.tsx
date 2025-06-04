"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import ModalAvaliacao from "@/components/ui/modal/modal_avaliation";
import ModalMovieDetails from "@/components/ui/modal/ModalDetalhesFilme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SideMenu from "@/components/ui/menu";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface Movie {
  id: number;
  title: string;
  poster: string;
  director: string;
  year: number;
  genreFilme: string;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalAvaliationOpen, setModalAvaliationOpen] = useState(false);
  const [modalDetailsOpen, setModalDetailsOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const sampleMovies: Movie[] = [
    { id: 1, title: "Inception", poster: "/home_page/posters/inception.jpg", director: "Christopher Nolan", year: 2010, genreFilme: "Sci-Fi" },
    { id: 2, title: "Interstellar", poster: "/posters/interstellar.jpg", director: "Christopher Nolan", year: 2014, genreFilme: "Sci-Fi" },
    { id: 3, title: "The Dark Knight", poster: "/posters/darkknight.jpg", director: "Christopher Nolan", year: 2008, genreFilme: "Action" },
    { id: 4, title: "Parasite", poster: "/posters/parasite.jpg", director: "Bong Joon-ho", year: 2019, genreFilme: "Thriller" },
  ];

  useEffect(() => {
    setMovies(sampleMovies);
  }, []);

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
    
      <main className="flex-grow max-w-6xl mx-auto p-8 ml-16">
        <h2 className="text-2xl font-semibold mb-6">Filmes Recentes</h2>
        {movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Card key={movie.id} className="shadow-lg">
                <CardHeader className="h-72 relative p-0">
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    className="object-cover rounded-t-md"
                    onClick={() => {
                      setSelectedMovie(movie);
                      setModalDetailsOpen(true);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg font-bold">
                    {movie.title}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => {
                        setSelectedMovie(movie);
                        setModalDetailsOpen(true);
                      }}
                    >
                      Detalhes
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedMovie(movie);
                        setModalAvaliationOpen(true);
                      }}
                    >
                      Avaliar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>Nenhum filme recente encontrado.</p>
        )}
      </main>

      {modalAvaliationOpen && selectedMovie && (
        <ModalAvaliacao
          open={modalAvaliationOpen}
          onClose={() => setModalAvaliationOpen(false)}
          movieTitle={selectedMovie.title}
          onSubmit={(rating, comment) => {
            console.log(`Avaliação para ${selectedMovie.title}: ${rating} estrelas, comentário: ${comment}`);
            setModalAvaliationOpen(false);
          }}
        />
      )}

      {modalDetailsOpen && selectedMovie && (
        <ModalMovieDetails
          movie={selectedMovie}
          onClose={() => setModalDetailsOpen(false)}
        />
      )}

      <footer className="bg-gray-800 text-white p-4 text-center ml-16">
        © {new Date().getFullYear()} BoscovFilmes. Todos direitos reservados.
      </footer>
    </div>
  );
}