"use client"
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Star } from "lucide-react";
import { Button } from "../button";

type ModalAvaliacaoProps = {
  open: boolean;
  onClose: () => void;
  movieTitle: string;
  onSubmit: (rating: number, comment: string) => void;
};

export default function ModalAvaliacao({
  open,
  onClose,
  movieTitle,
  onSubmit,
}: ModalAvaliacaoProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(rating, comment);
    setRating(0);
    setComment("");
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />
      <div className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-md z-50">
        <Dialog.Title className="text-2xl font-bold mb-4 text-center">
          Avaliar "{movieTitle}"
        </Dialog.Title>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none"
              >
                <Star
                  fill={star <= (hover || rating) ? "#facc15" : "none"}
                  stroke="#facc15"
                  className="w-8 h-8"
                />
              </button>
            ))}
          </div>
          <textarea
            className="border rounded-lg p-2 w-full min-h-[80px] resize-none"
            placeholder="Deixe um comentário (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={rating === 0}>
              Enviar Avaliação
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}