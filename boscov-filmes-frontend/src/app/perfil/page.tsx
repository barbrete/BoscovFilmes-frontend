"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SideMenu from "@/components/ui/menu";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ModalDetalhesFilme from "@/components/ui/modal/ModalDetalhesFilme";
import ModalAvaliacao from "@/components/ui/modal/modalAvaliacao";

interface Genero {
    id: number;
    descricao: string;
}

interface Filme {
    id: number;
    nome: string;
    diretor: string;
    anoLancamento: Date;
    duracao: number;
    produtora: string;
    classificacao: string;
    poster: string;
    generos?: Genero[];
    avaliacoes?: Avaliacao[];
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
    tipo_usuario: "user" | "admin";
    avaliacao?: Avaliacao[]; // conforme backend
}

export default function Perfil() {
    const [profile, setProfile] = useState<Usuario | null>(null);
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalFilmeOpen, setModalFilmeOpen] = useState(false);
    const [filmeSelecionado, setFilmeSelecionado] = useState<Filme | null>(null);
    const [avaliacaoEditando, setAvaliacaoEditando] = useState<Avaliacao | null>(null);
    const [avaliarOpen, setAvaliarOpen] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const token = Cookies.get("token");
                if (!token) return;
                const decoded: any = jwtDecode(token);
                const userId = decoded.id;
                const response = await axios.get(`http://localhost:3001/usuarios/${userId}`);
                setProfile(response.data);
                setAvaliacoes(response.data.avaliacao || []);
                // console.log("Perfil recebido:", response.data);
            } catch (error) {
                console.error("Erro ao buscar o perfil:", error);
            }
        }
        fetchProfile();
    }, []);

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

      const buscarFilmes = async () => {
    try {
      const resposta = await axios.get("http://localhost:3001/filmes");
      setFilmeSelecionado(resposta.data);
      return resposta.data;
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      return [];
    }
  };

  useEffect(() => {
    buscarFilmes();
  }, []);

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
            await axios.delete(`http://localhost:3001/avaliacoes/${avaliacao.idUsuario}/${avaliacao.idFilme}`);
            // Atualiza avaliações após exclusão
            if (profile) {
                const response = await axios.get(`http://localhost:3001/usuarios/${profile.id}`);
                setAvaliacoes(response.data.avaliacao || []);
            }
        } catch (error) {
            console.error("Erro ao excluir avaliação:", error);
        }
    };

    if (!profile) {
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
                {/* Card de informações do perfil */}
                <div className="bg-white p-6 rounded shadow mb-8">
                    <p>
                        <strong>Nome:</strong> {profile?.nome}
                    </p>
                    <p>
                        <strong>Email:</strong> {profile?.email}
                    </p>
                    <p>
                        <strong>Apelido:</strong> {profile?.apelido}
                    </p>
                    {profile?.tipo_usuario === "admin" ? (
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
                </div>

                {/* Card de avaliações */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-4">Minhas Avaliações</h2>
                    {avaliacoes.length === 0 ? (
                        <p>Você não fez nenhuma avaliação.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {avaliacoes.map((avaliacao, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg shadow p-4 flex flex-col items-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                                    onClick={async () => {
                                        if (avaliacao.filme) {
                                            const response = await axios.get(`http://localhost:3001/filmes/${avaliacao.filme.id}`);
                                            console.log(response.data);
                                            setFilmeSelecionado(response.data);
                                            setModalFilmeOpen(true);
                                        }
                                    }}
                                >
                                    {avaliacao.filme?.poster && (
                                        <img
                                            src={avaliacao.filme.poster}
                                            alt={avaliacao.filme.nome}
                                            className="w-40 h-60 object-cover rounded mb-3"
                                        />
                                    )}
                                    <div className="w-full text-center">
                                        <p className="font-bold">{avaliacao.filme ? avaliacao.filme.nome : `ID ${avaliacao.idFilme}`}</p>
                                        {avaliacao.filme && (
                                            <p className="text-sm text-gray-600 mb-1">
                                                <strong>Diretor:</strong> {avaliacao.filme.diretor}
                                            </p>
                                        )}
                                        <p className="mb-1">
                                            <strong>Comentário:</strong> {avaliacao.comentario}
                                        </p>
                                        <p>
                                            <strong>Nota:</strong> {avaliacao.nota}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            {filmeSelecionado && modalFilmeOpen && (
                <ModalDetalhesFilme
                    movie={filmeSelecionado}
                    onClose={() => setModalFilmeOpen(false)}
                    onAvaliar={handleNovaAvaliacao}
                    onEditarAvaliacao={handleEditarAvaliacao}
                    onExcluirAvaliacao={handleExcluirAvaliacao}
                    idUsuario={profile.id}
                />
            )}

            <ModalAvaliacao
        open={avaliarOpen}
        onClose={() => setAvaliarOpen(false)}
        movieTitle={filmeSelecionado?.nome || ""}
        avaliacao={avaliacaoEditando}
        onSubmit={async (rating, comment) => {
          if (avaliacaoEditando) {
            await axios.put(`http://localhost:3001/avaliacoes/${profile.id}/${filmeSelecionado?.id}`,
              {
                nota: rating,
                comentario: comment,
              });
          } else {
            await axios.post("http://localhost:3001/avaliacoes", {
              idFilme: filmeSelecionado?.id,
              idUsuario: profile.id,
              nota: rating,
              comentario: comment,
            });
          }
          const filmesAtualizados = await buscarFilmes();
          const atualizado = filmesAtualizados.find((m: { id: number | undefined; }) => m.id === filmeSelecionado?.id);
          setFilmeSelecionado(atualizado || null);
          setAvaliacaoEditando(null);
        }}
      />

        </div>
    );
}