"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Evaluation {
  id: number;
  comment: string;
  rating: number;
}

interface Movie {
  id: number;
  title: string;
  poster: string;
  director: string;
  year: number;
  genreFilme: string;
}

interface ModalMovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

export default function ModalMovieDetails({ movie, onClose }: ModalMovieDetailsProps) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    // Simula a obtenção das avaliações com base no id do filme
    const simulatedEvaluations: { [key: number]: Evaluation[] } = {
      1: [
        { id: 1, comment: "Incrível!", rating: 5 },
        { id: 2, comment: "Muito bom", rating: 4 },
      ],
      2: [
        { id: 3, comment: "Visual deslumbrante!", rating: 5 },
      ],
      3: [],
      4: [
        { id: 4, comment: "Perturbador e envolvente", rating: 4 },
      ],
    };
    setEvaluations(simulatedEvaluations[movie.id] || []);
  }, [movie.id]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{movie.title}</h2>
        <p>
          <strong>Diretor:</strong> {movie.director}
        </p>
        <p>
          <strong>Ano:</strong> {movie.year}
        </p>
        <p>
          <strong>Gênero:</strong> {movie.genreFilme}
        </p>
        <h3 className="text-lg font-bold mt-4">Avaliações</h3>
        {evaluations.length === 0 ? (
          <p>Sem avaliações para este filme.</p>
        ) : (
          <ul>
            {evaluations.map((evalItem) => (
              <li key={evalItem.id} className="mt-2">
                <strong>{evalItem.rating} estrelas:</strong> {evalItem.comment}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
}