"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ModalExcluirAvaliacao from "./modalExcluirAvaliacao";
import axios from "axios";
import { Star, X } from "lucide-react";
import Cookies from "js-cookie";

interface Usuario {
  id: number;
  apelido: string;
  nome?: string;
  email?: string;
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
  anoLancamento: string | Date;
  duracao: number;
  produtora: string;
  classificacao: string;
  poster: string;
  generos?: GeneroRelacao[];
  avaliacoes?: Avaliacao[];
}

interface ModalDetalhesFilmeProps {
  movie: Movie;
  onClose: () => void;
  onAvaliar: () => void;
  onEditarAvaliacao: (avaliacao: Avaliacao) => void;
  onExcluirAvaliacao: (avaliacao: Avaliacao | null) => void;
  idUsuario: number;
}

export default function ModalDetalhesFilme({
  movie,
  onClose,
  onAvaliar,
  onEditarAvaliacao,
  onExcluirAvaliacao,
  idUsuario,
}: ModalDetalhesFilmeProps) {
  console.log(movie);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [avaliacaoParaExcluir, setAvaliacaoParaExcluir] = useState<Avaliacao | null>(null);
  const [usuarioPerfil, setUsuarioPerfil] = useState<Usuario | null>(null);
  const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
  const token = Cookies.get("token");
  const generos = movie.generos?.map(g => g.genero) || [];

  async function handleVerPerfil(idUsuario: number) {
    try {
      const response = await axios.get(`http://localhost:3001/usuarios/${idUsuario}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUsuarioPerfil(response.data);
      setModalPerfilOpen(true);
    } catch (error) {
      alert("Erro ao buscar perfil do usuário.");
    }
  }
  console.log("genero", movie.generos);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full relative">
        <button
          className="absolute top-2 right-2 text-xl cursor-pointer text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <X />
        </button>
        <div className="flex flex-row gap-8 items-start">
          {/* Coluna do filme */}
          <div className="flex flex-col items-center min-w-[250px] max-w-[300px]">
            <Image
              src={movie.poster}
              alt={movie.nome}
              width={250}
              height={350}
              className="rounded mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{movie.nome}</h2>
            <div className="text-gray-700 mb-1">
              <b>Diretor:</b> {movie.diretor}
            </div>
            <div className="text-gray-700 mb-1">
              <b>Ano:</b> {new Date(movie.anoLancamento).getFullYear()}
            </div>
            <div className="text-gray-700 mb-1">
              <b>Duração:</b> {movie.duracao} min
            </div>
            <div className="text-gray-700 mb-1">
              <b>Produtora:</b> {movie.produtora}
            </div>
            <div className="text-gray-700 mb-1">
              <b>Classificação:</b> {movie.classificacao}
            </div>
            {generos.length > 0 && (
              <div className="text-gray-700 mb-2">
                <b>Gêneros:</b> {generos.map(g => g.descricao).join(", ")}
              </div>
            )}
            <Button
              className="mt-2 w-full"
              onClick={onAvaliar}
            >
              Adicionar Avaliação
            </Button>
          </div>
          {/* Coluna das avaliações */}
          <div className="flex-1">
            <div className="font-semibold text-2xl mb-2">Avaliações:</div>
            {movie.avaliacoes && movie.avaliacoes.length > 0 ? (
              <ul className="space-y-4">
                {movie.avaliacoes.map(av => (
                  <li
                    key={av.idUsuario + '-' + av.idFilme}
                    className="flex items-start justify-between bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-bold text-pink-700 hover:underline cursor-pointer"
                          title="Ver perfil do usuário"
                          onClick={() => handleVerPerfil(av.idUsuario)}
                        >
                          {av.usuario?.apelido ?? "Usuário"}
                        </span>
                        <span className="flex items-center ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              fill={i < av.nota ? "#fbbf24" : "none"}
                              stroke="#fbbf24"
                              className="mr-0.5"
                            />
                          ))}
                        </span>
                      </div>
                      {av.comentario && (
                        <div className="text-gray-700 italic mt-1 px-1">
                          “{av.comentario}”
                        </div>
                      )}
                    </div>
                    {idUsuario === av.idUsuario && (
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          className="text-blue-600 hover:underline text-xs"
                          title="Editar avaliação"
                          onClick={() => onEditarAvaliacao(av)}
                        >
                          Editar
                        </button>
                        <button
                          className="text-red-600 hover:underline text-xs"
                          title="Excluir avaliação"
                          onClick={() => {
                            setAvaliacaoParaExcluir(av);
                            setConfirmOpen(true);
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">Nenhuma avaliação ainda.</div>
            )}
          </div>
        </div>
        <ModalExcluirAvaliacao
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            onExcluirAvaliacao(avaliacaoParaExcluir);
            setConfirmOpen(false);
          }}
          mensagem="Tem certeza que deseja excluir esta avaliação?"
        />
        {modalPerfilOpen && usuarioPerfil && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
              <h2 className="text-xl font-bold mb-2">Perfil de {usuarioPerfil.apelido}</h2>
              <p><strong>Nome:</strong> {usuarioPerfil.nome}</p>
              <p><strong>Email:</strong> {usuarioPerfil.email}</p>
              <Button className="mt-4" onClick={() => setModalPerfilOpen(false)}>Fechar</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}