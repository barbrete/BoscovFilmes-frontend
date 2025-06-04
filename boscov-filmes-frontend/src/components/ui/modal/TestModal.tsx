import React, { useState } from "react";
import ModalFilmes from "@/components/ui/modal/modalFilmes";

export default function TestModal() {
  const generosTeste = [
    { id: 1, descricao: "Ação" },
    { id: 2, descricao: "Comédia" },
    { id: 3, descricao: "Drama" },
    { id: 4, descricao: "Ficção Científica" },
  ];
  
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {isOpen && (
        <ModalFilmes
          generos={generosTeste}
          onClose={() => setIsOpen(false)}
          onSubmit={(filme) => {
            console.log("Filme submetido:", filme);
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
}