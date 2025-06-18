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
import ModalDetalhesFilme from "@/components/ui/modal/ModalDetalhesFilme";
import { Pencil, Trash2, Eye } from "lucide-react";
import { AdminAuth } from "@/hoc/AdminAuth";

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

interface Genre {
  id: number;
  descricao: string;
}

interface GeneroRelacao {
  idFilme: number;
  idGenero: number;
  genero: Genre;
}

// Para criar/editar
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

// Para exibir
interface Filme {
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

function Filmes() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generos, setGeneros] = useState<Genre[]>([]);
  const [tipoUsuario, setTipoUsuario] = useState<"admin" | "user" | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [avaliarOpen, setAvaliarOpen] = useState(false);
  const [avaliacaoEditando, setAvaliacaoEditando] = useState<Avaliacao | null>(null);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Filme | null>(null);

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
      await axios.delete(`http://localhost:3001/avaliacoes/${avaliacao.idUsuario}/${avaliacao.idFilme}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const filmesAtualizados = await buscarFilmes();
      const atualizado = filmesAtualizados.find((m: { id: number | undefined }) => m.id === selectedMovie?.id);
      setSelectedMovie(atualizado || null);
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
    }
  };

  const buscarFilmes = async () => {
    try {
      const resposta = await axios.get("http://localhost:3001/filmes", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFilmes(resposta.data);
      return resposta.data;
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      return [];
    }
  };

  useEffect(() => {
    buscarFilmes();
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setTipoUsuario(decoded.tipo || null);
        setUsuarioId(decoded.id || null);
      } catch (e) {
        setTipoUsuario(null);
        setUsuarioId(null);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchGeneros() {
      try {
        const response = await axios.get("http://localhost:3001/generos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setGeneros(response.data);
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    }
    fetchGeneros();
  }, []);

  function handleDeleteMovie(id: number) {
    axios
      .delete(`http://localhost:3001/filmes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => setFilmes(filmes.filter((filme) => filme.id !== id)))
      .catch((error) => console.error("Erro ao excluir filme:", error));
  }

  function handleEditMovie(filme: Filme) {
    const movie: Movie = {
      id: filme.id,
      nome: filme.nome,
      diretor: filme.diretor,
      anoLancamento: filme.anoLancamento,
      duracao: filme.duracao,
      produtora: filme.produtora,
      classificacao: filme.classificacao,
      poster: filme.poster,
      generos: filme.generos?.map(g => g.idGenero) || [],
    };
    setEditingMovie(movie);
    setIsModalOpen(true);
  }

  // CORRIGIDO: Recebe um Filme, não Movie
  function handleShowDetails(filme: Filme) {
    setSelectedMovie(filme);
    setModalOpen(true);
  }

  async function salvarFilme(filme: Movie) {
    try {
      if (filme.id) {
        console.log("Salvando filme:", filme);
        // Edição
        await axios.put(`http://localhost:3001/filmes/${filme.id}`, {
          nome: filme.nome,
          duracao: filme.duracao,
          diretor: filme.diretor,
          anoLancamento: filme.anoLancamento,
          poster: filme.poster,
          produtora: filme.produtora,
          classificacao: filme.classificacao,
          generos: filme.generos,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Criação
        await axios.post("http://localhost:3001/filmes", {
          nome: filme.nome,
          duracao: filme.duracao,
          diretor: filme.diretor,
          anoLancamento: filme.anoLancamento,
          poster: filme.poster,
          produtora: filme.produtora,
          classificacao: filme.classificacao,
          generos: filme.generos,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      await buscarFilmes();
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
          <h1 className="text-4xl font-extrabold tracking-tight">BoscovFilmes Admin</h1>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filmes.map((filme) => (
              <Card key={filme.id} className="shadow-lg flex flex-col items-center">
                <CardHeader className="h-72 w-full relative p-0 flex justify-center">
                  <Image
                    src={filme.poster}
                    alt={filme.nome}
                    fill
                    className="object-cover rounded-t-md"
                  />
                </CardHeader>
                <CardContent className="w-full flex flex-col items-center">
                  <CardTitle className="text-lg font-bold text-center">
                    {filme.nome}
                  </CardTitle>
                  <div className="flex gap-6 mt-2 w-full justify-center mb-3">
                    <Button className="flex" onClick={() => handleEditMovie(filme)}>
                      <Pencil className="" />
                    </Button>
                    <Button className="flex" onClick={() => handleShowDetails(filme)}>
                      <Eye className="" />
                    </Button>
                    <Button className="" onClick={() => filme.id && handleDeleteMovie(filme.id)}>
                      <Trash2 className="" />
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

        {selectedMovie && modalOpen && (
          <ModalDetalhesFilme
            movie={selectedMovie}
            onClose={() => setModalOpen(false)}
            onAvaliar={handleNovaAvaliacao}
            onEditarAvaliacao={handleEditarAvaliacao}
            onExcluirAvaliacao={handleExcluirAvaliacao}
            idUsuario={usuarioId ?? 0}
          />
        )}
      </main>
    </div>
  );
}

export default AdminAuth(Filmes);