"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SideMenu from "@/components/ui/menu";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ModalFilmes from "@/components/ui/modal/modalFilmes";
import { Pencil, Trash2 } from "lucide-react";
import withAdminRoute from "@/hocs/AdminRoute";

interface Movie {
  id?: number;
  nome: string;
  diretor: string;
  anoLancamento: Date;
  duracao: number;
  produtora: string;
  classificacao: string;
  poster: string;
  generos: number[];
}

interface Genre {
  id: number;
  descricao: string;
}

function Filmes() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generos, setGeneros] = useState<Genre[]>([]);
  const token = Cookies.get("token");

  let tipoUsuario: "admin" | "user" | null = null;

  if (typeof window !== "undefined") {
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
    async function fetchGeneros() {
      try {
        const response = await axios.get("http://localhost:3001/admin/generos", {
          headers: { Authorization: `Bearer ${token}` },
        }
        );
        setGeneros(response.data);
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    }
    fetchGeneros();
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await axios.get("http://localhost:3001/admin/filmes", {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setMovies(response.data);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      }
    }
    fetchMovies();
  }, []);

  async function fetchMoviesAgain() {
    try {
      const response = await axios.get("http://localhost:3001/admin/filmes", {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setMovies(response.data);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  }

  function handleDeleteMovie(id: number) {
    axios
      .delete(`http://localhost:3001/admin/filmes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setMovies(movies.filter((movie) => movie.id !== id)))
      .catch((error) => console.error("Erro ao excluir filme:", error));
  }

  function handleEditMovie(movie: Movie) {
    setEditingMovie(movie);
    setIsModalOpen(true);
  }

  async function salvarFilme(filme: Movie) {
    try {
      if (filme.id) {
        // Edição
        await axios.put(
          `http://localhost:3001/admin/filmes/${filme.id}`,
          {
            nome: filme.nome,
            duracao: filme.duracao,
            diretor: filme.diretor,
            anoLancamento: filme.anoLancamento,
            poster: filme.poster,
            produtora: filme.produtora,
            classificacao: filme.classificacao,
            generos: filme.generos,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Criação
        await axios.post(
          "http://localhost:3001/admin/filmes",
          {
            nome: filme.nome,
            duracao: filme.duracao,
            diretor: filme.diretor,
            anoLancamento: filme.anoLancamento,
            poster: filme.poster,
            produtora: filme.produtora,
            classificacao: filme.classificacao,
            generos: filme.generos,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      await fetchMoviesAgain();
    } catch (error) {
      console.error("Erro ao salvar filme:", error);
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
        <section>
          <h2 className="text-2xl font-semibold mb-4">Gerenciar Filmes</h2>
          <Button
            className="mb-4"
            onClick={() => {
              setEditingMovie(null);
              setIsModalOpen(true);
            }}
          >
            Adicionar Filme
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Card key={movie.id} className="shadow-lg flex flex-col items-center">
                <CardHeader className="h-72 w-full relative p-0 flex justify-center">
                  <Image
                    src={movie.poster}
                    alt={movie.nome}
                    fill
                    className="object-cover rounded-t-md"
                  />
                </CardHeader>
                <CardContent className="w-full flex flex-col items-center">
                  <CardTitle className="text-lg font-bold text-center">
                    {movie.nome}
                  </CardTitle>
                  <div className="flex gap-6 mt-2 w-full justify-center mb-3">
                    <Button className="flex" onClick={() => handleEditMovie(movie)}>
                      <Pencil />
                    </Button>
                    <Button onClick={() => movie.id && handleDeleteMovie(movie.id)}>
                      <Trash2 />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {isModalOpen && (
          <ModalFilmes
            movie={editingMovie || undefined}
            onClose={() => setIsModalOpen(false)}
            onSubmit={salvarFilme}
            generos={generos}
          />
        )}
      </main>
    </div>
  );
}

export default withAdminRoute(Filmes);