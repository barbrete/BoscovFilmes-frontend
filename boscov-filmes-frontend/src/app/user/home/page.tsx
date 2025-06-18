"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ModalAvaliacao from "@/components/ui/modal/modalAvaliacao";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SideMenu from "@/components/ui/menu";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ModalDetalhesFilme from "@/components/ui/modal/ModalDetalhesFilme";
import { UserAuth } from "@/hoc/UserAuth";

interface Usuario {
  id: number;
  apelido: string;
}

interface Avaliacao {
  idUsuario: number;
  idFilme: number;
  nota: number;
  comentario?: string;
  usuario?: Usuario;
}

interface Genero {
  id: number;
  descricao: string;
}

interface GeneroRelacao {
  idFilme: number;
  idGenero: number;
  genero: Genero;
}

interface Movie {
  id: number;
  nome: string;
  diretor: string;
  anoLancamento: Date;
  duracao: number;
  produtora: string;
  classificacao: string;
  poster: string;
  generos?: GeneroRelacao[];
  avaliacoes?: Avaliacao[];
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [avaliarOpen, setAvaliarOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [avaliacaoEditando, setAvaliacaoEditando] = useState<Avaliacao | null>(null);
  const token = Cookies.get("token");

  const handleEditarAvaliacao = (avaliacao: Avaliacao) => {
    setAvaliacaoEditando(avaliacao);
    setAvaliarOpen(true);
  };

  const handleNovaAvaliacao = () => {
    setAvaliacaoEditando(null);
    setAvaliarOpen(true);
  };

  const handleExcluirAvaliacao = async (avaliacao: Avaliacao | null) => {
    if (!avaliacao) return;
    try {
      await axios.delete(`http://localhost:3001/avaliacoes/${avaliacao.idUsuario}/${avaliacao.idFilme}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const filmesAtualizados = await buscarFilmes();
      const atualizado = filmesAtualizados.find((m: { id: number | undefined }) => m.id === selectedMovie?.id);
      setSelectedMovie(atualizado || null);
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
    }
  };

  let tipoUsuario: "admin" | "user" | null = null;

  if (typeof window !== "undefined") {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        tipoUsuario = decoded.tipo || null;
      } catch (e) {
        tipoUsuario = null;
      }
    }
  }

  const buscarFilmes = async () => {
    try {
      const resposta = await axios.get("http://localhost:3001/filmes", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMovies(resposta.data);
      return resposta.data;
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      return [];
    }
  };

  useEffect(() => {
    buscarFilmes();
  }, []);

  let usuarioId = null;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      usuarioId = decoded.id;
    } catch { }
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
        <h2 className="text-2xl font-semibold mb-6">Filmes</h2>
        {movies.length > 0 ? (
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
                  <Button
                    className="mt-2 w-full cursor-pointer mb-2"
                    onClick={() => {
                      setSelectedMovie(movie);
                      setModalOpen(true);
                    }}
                  >
                    Ver mais
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>Nenhum filme encontrado.</p>
        )}
      </main>

      {selectedMovie && modalOpen && (
        <ModalDetalhesFilme
          movie={selectedMovie}
          onClose={() => setModalOpen(false)}
          onAvaliar={handleNovaAvaliacao}
          onEditarAvaliacao={handleEditarAvaliacao}
          onExcluirAvaliacao={handleExcluirAvaliacao}
          idUsuario={usuarioId}
        />
      )}

      <ModalAvaliacao
        open={avaliarOpen}
        onClose={() => setAvaliarOpen(false)}
        movieTitle={selectedMovie?.nome || ""}
        avaliacao={avaliacaoEditando}
        onSubmit={async (rating, comment) => {
          if (avaliacaoEditando) {
            await axios.put(`http://localhost:3001/avaliacoes/${usuarioId}/${selectedMovie?.id}`,
              {
                nota: rating,
                comentario: comment,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
          } else {
            await axios.post("http://localhost:3001/avaliacoes", {
              idFilme: selectedMovie?.id,
              idUsuario: usuarioId,
              nota: rating,
              comentario: comment,
            },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
          }
          const filmesAtualizados = await buscarFilmes();
          const atualizado = filmesAtualizados.find((m: { id: number | undefined; }) => m.id === selectedMovie?.id);
          setSelectedMovie(atualizado || null);
          setAvaliacaoEditando(null);
        }}
      />

      <footer className="bg-gray-800 text-white p-4 text-center ml-16">
        © {new Date().getFullYear()} BoscovFilmes. Todos direitos reservados.
      </footer>
    </div>
  );
}

export default UserAuth(Home);