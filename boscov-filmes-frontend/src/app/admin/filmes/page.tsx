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
    nome: string;
    diretor: string;
    anoLancamento: Date;
    duracao: string;
    produtora: string;
    classificacao: string;
    poster: string;
    generos: number[];
}

interface Genre {
    id: number;
    descricao: string;
}

export default function Filmes() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generos, setGeneros] = useState<Genre[]>([]);

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
        async function fetchGeneros() {
            try {
                const response = await axios.get("http://localhost:3001/generos");
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
                const response = await axios.get("http://localhost:3001/filmes");
                setMovies(response.data);
            } catch (error) {
                console.error("Erro ao buscar filmes:", error);
            }
        }
        fetchMovies();
    }, []);

    useEffect(() => {
        async function buscarFilmesRecentes() {
            try {
                const resposta = await axios.get("http:localhos/3000/filmes/recentes");
                setMovies(resposta.data);
            } catch (error) {
                console.error("Erro ao buscar filmes recentes:", error);
            }
        }
        buscarFilmesRecentes();
    }, []);

    function handleDeleteMovie(id: number) {
        axios
            .delete(`http://localhost:3001/filmes/${id}`)
            .then(() => setMovies(movies.filter((movie) => movie.id !== id)))
            .catch((error) => console.error("Erro ao excluir filme:", error));
    }

    function handleEditMovie(movie: Movie) {
        setEditingMovie(movie);
        setIsModalOpen(true);
    }

    async function salvarFilme(filme: Movie) {
  try {
    await axios.post("http://localhost:3001/filmes", {
      nome: filme.nome,
      duracao: filme.duracao,
      diretor: filme.diretor,
      anoLancamento: filme.anoLancamento,
      poster: filme.poster,
      generos: [Number(filme.generos)] // array de ids de gênero
    });
    // Atualize a lista de filmes após salvar, se quiser
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
                    <Button className="mb-4"
                        onClick={() => {
                            setEditingMovie(null);
                            setIsModalOpen(true);

                        }}
                    >
                        Adicionar Filme
                    </Button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {movies.map((movie) => (
                            <Card key={movie.id} className="shadow-lg">
                                <CardHeader className="h-48 relative p-0">
                                    <img
                                        src={movie.poster}
                                        alt={movie.nome}
                                        className="object-cover w-full h-full rounded-t-md"
                                    />
                                </CardHeader>
                                <CardContent>
                                    <CardTitle className="text-lg font-bold">{movie.nome}</CardTitle>
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

                <ModalFilmes
                    movie={editingMovie || undefined}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={salvarFilme}
                    generos={generos}
                />
            </main>
        </div>
    );
}