"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SideMenu from "@/components/ui/menu";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

interface Filme {
    id: number;
    nome: string;
    diretor: string;
    anoLancamento: Date;
    poster: string;
}

interface Avaliacao {
    idFilme: number;
    idUsuario: number;
    comentario?: string;
    nota: number;
    filme?: Filme;
}

interface Usuario {
    id: number;
    nome: string;
    email: string;
    apelido: string;
    senha: string;
    role: "user" | "admin";
    avaliacoes?: Avaliacao[];
}

export default function Perfil() {
    const [profile, setProfile] = useState<Usuario | null>(null);
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = Cookies.get("token");
        const response = await axios.get("http://localhost:3001/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        console.log("Perfil recebido:", response.data);
      } catch (error) {
        console.error("Erro ao buscar o perfil:", error);
      }
    }

    fetchProfile();
  }, []);

    useEffect(() => {
        const perfilSimulado: Usuario = {
            id: 1,
            nome: "João Silva",
            email: "joao.silva@example.com",
            apelido: "joaosilva",
            senha: "senha123",
            role: "user",
        };
        setProfile(perfilSimulado);
        console.log("Perfil definido:", perfilSimulado);

    }, []);

    useEffect(() => {
        if (profile && profile.role === "user") {
            // Simule os filmes associados
            const filmeA: Filme = {
                id: 1,
                nome: "Filme A",
                diretor: "Diretor A",
                anoLancamento: new Date("2020-01-01"),
                poster: "/caminho/para/filmeA.jpg",
            };
            const filmeB: Filme = {
                id: 2,
                nome: "Filme B",
                diretor: "Diretor B",
                anoLancamento: new Date("2021-01-01"),
                poster: "/caminho/para/filmeB.jpg",
            };

            // Simulação das avaliações, incluindo os dados do filme
            const avaliacoesSimuladas: Avaliacao[] = [
                {
                    idFilme: 1,
                    idUsuario: 4,
                    comentario: "Excelente filme, recomendo!",
                    nota: 5,
                    filme: filmeA,
                },
                {
                    idFilme: 2,
                    idUsuario: 3,
                    comentario: "Bom, mas poderia ser melhor.",
                    nota: 3,
                    filme: filmeB,
                },
            ];
            setAvaliacoes(avaliacoesSimuladas);
        }
    }, [profile]);

    let tipoUsuario: "admin" | "user" | null = null;

    if (typeof window !== "undefined") {
        const token = Cookies.get("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                tipoUsuario = decoded.tipo || null;
            } catch (e) {
                tipoUsuario = null;
            }
        }
    }

    if(!profile){
        return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
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
                <h1 className="text-3xl font-bold mb-4">Perfil do Usuário</h1>
                <div className="bg-white p-6 rounded shadow">
                    <p>
                        <strong>Nome:</strong> {profile?.nome}
                    </p>
                    <p>
                        <strong>Email:</strong> {profile?.email}
                    </p>
                    <p>
                        <strong>Apelido:</strong> {profile?.apelido}
                    </p>

                    {profile?.role === "admin" ? (
                        <div className="mt-4">
                            <Button onClick={() => alert("Acessar painel de administração")}>
                                Acessar Painel Admin
                            </Button>
                            <Button
                                className="mt-2"
                                onClick={() => alert("Gerenciar usuários")}
                            >
                                Gerenciar Usuários
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <Button onClick={() => alert("Editar Perfil")}>Editar Perfil</Button>
                        </div>
                    )}

                    {profile?.role === "user" && (
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold mb-2">Minhas Avaliações</h2>
                            {avaliacoes.length === 0 ? (
                                <p>Você não fez nenhuma avaliação.</p>
                            ) : (
                                <ul>
                                    {avaliacoes.map((avaliacao, index) => (
                                        <li key={index} className="mb-4 border-b pb-2">
                                            <p>
                                                <strong>Filme:</strong>{" "}
                                                {avaliacao.filme ? avaliacao.filme.nome : `ID ${avaliacao.idFilme}`}
                                            </p>
                                            {avaliacao.filme && (
                                                <p>
                                                    <strong>Diretor:</strong> {avaliacao.filme.diretor}
                                                </p>
                                            )}
                                            <p>
                                                <strong>Comentário:</strong> {avaliacao.comentario}
                                            </p>
                                            <p>
                                                <strong>Nota:</strong> {avaliacao.nota}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>

    );
}