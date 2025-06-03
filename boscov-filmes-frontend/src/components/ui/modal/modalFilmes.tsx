"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Movie {
  id?: number;
  titulo: string;
  diretor: string;
  ano: number;
  generoFilme:string;
  poster: string;
}

interface ModalFilmesProps {
  movie?: Movie;
  onClose: () => void;
  onSubmit: (movie: Movie) => void;
}
interface Genre {
  id: number;
  nome: string;
}
export default function ModalFilmes({ movie, onClose, onSubmit }: ModalFilmesProps) {
  const [titulo, setTitulo] = useState(movie ? movie.titulo : "");
  const [diretor, setDiretor] = useState(movie ? movie.diretor : "");
  const [ano, setAno] = useState(movie ? movie.ano : new Date().getFullYear());
  const [poster, setPoster] = useState(movie ? movie.poster : "");
  const [generoFilme, setGeneroFilme] = useState(movie ? movie.generoFilme : "");
  const [genres, setGenres] = useState<Genre[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMovie: Movie = {
      ...(movie && { id: movie.id }),
      titulo,
      diretor,
      ano,
      generoFilme,
      poster,
    };
    onSubmit(newMovie);
  };


useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await axios.get("http://localhost:3001/genres");
        setGenres(response.data);
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    }
    fetchGenres();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {movie ? "Editar Filme" : "Adicionar Filme"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
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
            type="number"
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            placeholder="Ano"
            className="border p-2 rounded"
            required
          />
          {/* Aqui vai precisar colocar algum  dropdown, que eu vou criar no genero e associar a esse generofilme*/}
          <select
            value={generoFilme}
            onChange={(e) => setGeneroFilme(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="" disabled>
              Selecione o Gênero
            </option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id.toString()}>
                {genre.nome}
              </option>
            ))}
          </select>
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