"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

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

interface ModalFilmesProps {
  movie?: Movie;
  onClose: () => void;
  onSubmit: (movie: Movie) => void;
  generos: { id: number; descricao: string }[];
}
interface Genre {
  id: number;
  descricao: string;
}
export default function ModalFilmes({ movie, onClose, onSubmit, generos }: ModalFilmesProps) {
  const [nome, setNome] = useState(movie ? movie.nome : "");
  const [diretor, setDiretor] = useState(movie ? movie.diretor : "");
  const [ano, setAno] = useState<Date>(movie ? movie.anoLancamento : new Date());
  const [poster, setPoster] = useState(movie ? movie.poster : "");
  const [generosSelecionados, setGenerosSelecionados] = useState<number[]>(movie ? movie.generos : []);
  const [duracao, setDuracao] = useState(movie ? movie.duracao : "");
  const [produtora, setProdutora] = useState(movie ? movie.produtora : "");
  const [classificacao, setClassificacao] = useState(movie ? movie.classificacao : "");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novoFilme: Movie = {
      ...(movie && { id: movie.id }),
      nome,
      diretor,
      anoLancamento: ano,
      duracao,
      produtora,
      classificacao,
      poster,
      generos: generosSelecionados,
    };
    onSubmit(novoFilme);
  };
useEffect(() => {
    console.log("Generos recebidos:", generos);
}, [generos]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {movie ? "Editar Filme" : "Adicionar Filme"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Título"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            value={diretor}
            onChange={(e) => setDiretor(e.target.value)}
            placeholder="Diretor"
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            value={ano.toISOString().split("T")[0]}
            onChange={(e) => setAno(new Date(e.target.value))}
            placeholder="Ano"
            className="border p-2 rounded"
            required
          />
<div className="flex flex-col gap-2">
    <span className="font-semibold">Selecione os Gêneros</span>
    {generos.map((genero) => (
        <label key={genero.id} className="inline-flex items-center">
            <input
                type="checkbox"
                value={genero.id}
                checked={generosSelecionados.includes(genero.id)}
                onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                        setGenerosSelecionados([...generosSelecionados, genero.id]);
                    } else {
                        setGenerosSelecionados(generosSelecionados.filter(id => id !== genero.id));
                    }
                }}
                className="mr-2"
            />
            {genero.descricao}
        </label>
    ))}
</div>
          <input
            type="text"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            placeholder="Duração (ex: 02:00:00)"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            value={produtora}
            onChange={(e) => setProdutora(e.target.value)}
            placeholder="Produtora"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            value={classificacao}
            onChange={(e) => setClassificacao(e.target.value)}
            placeholder="Classificação"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            value={poster}
            onChange={(e) => setPoster(e.target.value)}
            placeholder="URL do Poster"
            className="border p-2 rounded"
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {movie ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}