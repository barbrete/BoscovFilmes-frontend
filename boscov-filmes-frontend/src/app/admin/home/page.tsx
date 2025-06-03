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
import ModalFilmes from "@/components/ui/modal/modalFilmes";

interface Movie {
  id?: number;
  titulo: string;
  diretor: string;
  ano: number;
  generoFilme: string;
  poster: string;
}

interface User {
  id: number;
  nome: string;
  email: string;
  apelido: string;
  dataNascimento: Date,
  tipoUsuario: string;
}

export default function AdminHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await axios.get("http://localhost:3001/movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      }
    }
    async function fetchUsers() {
      try {
        const response = await axios.get("http://localhost:3001/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }

    fetchMovies();
    fetchUsers();
  }, []);

  useEffect(() => {
      async function buscarFilmesRecentes() {
        try {
          const resposta = await axios.get("http:localhos/3000/filmes/recentes");
          setMovies(resposta.data);;
        }
        catch (error) {
          console.error("Erro ao buscar filmes recentes:", error);
        }
      }
      buscarFilmesRecentes();
    }, []);

  function handleDeleteMovie(id: number) {
    axios
      .delete(`http://localhost:3001/movies/${id}`)
      .then(() => setMovies(movies.filter((movie) => movie.id !== id)))
      .catch((error) => console.error("Erro ao excluir filme:", error));
  }

  function handleDeleteUser(id: number) {
    axios
      .patch(`http://localhost:3001/users/${id}`, { status: false })
      .then(() => {
        // Atualiza a lista removendo usuários inativados
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) =>
        console.error("Erro ao inativar usuário:", error)
      );
  }

  function handleEditMovie(movie: Movie) {
    setEditingMovie(movie);
    setIsModalOpen(true);
  }

  // Função para salvar o filme após edição
  function handleSaveMovie(updatedMovie: Movie) {
    setMovies(movies.map((m) => (m.id === updatedMovie.id ? updatedMovie : m)));
    setIsModalOpen(false);
    setEditingMovie(null);
  }

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
        <section>
          <h2 className="text-2xl font-semibold mb-4">Gerenciar Filmes</h2>
          {/* Colocar uma parte para mostrar os filmes recentes, um botão que puxe todos os filmes e faça a paginação, e mostre a parte de editar */}
          <Button className="mb-4"
          onClick={() => {
              setEditingMovie(null);
              setIsModalOpen(true);
            }}          
          >
            Adicionar Filme</Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <Card key={movie.id} className="shadow-lg">
                <CardHeader className="h-48 relative p-0">
                  <img
                    src={movie.poster}
                    alt={movie.titulo}
                    className="object-cover w-full h-full rounded-t-md"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg font-bold">{movie.titulo}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => handleEditMovie(movie)}>
                      Editar
                    </Button>
                    <Button onClick={() => movie.id && handleDeleteMovie(movie.id)}>
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Gerenciar Usuários</h2>
          <Button className="mb-4">Gerenciar Usuarios</Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((user) => (
              <div key={user.id} className="p-4 bg-white rounded shadow">
                <h3 className="text-xl font-bold">{user.nome}</h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">Função: {user.tipoUsuario}</p>
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => { /* Lógica para editar usuário */ }}>
                    Editar
                  </Button>
                  <Button onClick={() => handleDeleteUser(user.id)}>
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>


      <footer className="bg-gray-800 text-white p-4 text-center ml-16">
        © {new Date().getFullYear()} BoscovFilmes. Todos direitos reservados.
      </footer>

      {isModalOpen && (
        <ModalFilmes
          movie={editingMovie || undefined}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveMovie}
        />
      )}
    </div>
  );
}