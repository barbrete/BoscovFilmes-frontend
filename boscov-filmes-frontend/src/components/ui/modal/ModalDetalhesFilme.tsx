"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ModalExcluirAvaliacao from "./modalExcluirAvaliacao";

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

interface Movie {
  id: number;
  nome: string;
  diretor: string;
  anoLancamento: string | Date;
  duracao: number;
  produtora: string;
  classificacao: string;
  poster: string;
  generos?: Genero[];
  avaliacoes?: Avaliacao[];
}

interface ModalDetalhesFilmeProps {
  movie: Movie;
  onClose: () => void;
  onAvaliar: () => void;
  onEditarAvaliacao: (avaliacao: Avaliacao) => void;
  onExcluirAvaliacao: (avaliacao: Avaliacao | null) => void; // Adicione esta linha
  idUsuario: number;
}

export default function ModalDetalhesFilme({ movie, onClose, onAvaliar, onEditarAvaliacao, onExcluirAvaliacao, idUsuario }: ModalDetalhesFilmeProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [avaliacaoParaExcluir, setAvaliacaoParaExcluir] = useState<Avaliacao | null>(null);
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full relative">
        <button
          className="absolute top-2 right-2 text-xl"
          onClick={onClose}
        >
          ×
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
            {movie.generos && movie.generos.length > 0 && (
              <div className="text-gray-700 mb-2">
                <b>Gêneros:</b> {movie.generos.map(g => g.descricao).join(", ")}
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
            <div className="font-semibold text-base mb-2">Avaliações:</div>
            {movie.avaliacoes && movie.avaliacoes.length > 0 ? (
              <ul className="text-sm text-gray-600">
                {movie.avaliacoes.map(av => (
                  <li key={av.idUsuario + '-' + av.idFilme} className="mb-2 border-b pb-1 flex items-center justify-between">
                    <div>
                      <span className="font-bold">
                        {av.usuario?.apelido ? `${av.usuario.apelido}: ` : ""}
                        {av.nota} estrelas
                      </span>
                      {av.comentario ? ` - ${av.comentario}` : ""}
                    </div>
                    {/* Só mostra os botões se for o dono da avaliação */}
                    {idUsuario === av.idUsuario && (
                      <div className="flex gap-2 ml-2">
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
    </div>
    
  );
}