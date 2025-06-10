import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "../button";

interface ModalExcluirAvaliacaoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mensagem?: string;
}

export default function ModalExcluirAvaliacao({
  open,
  onClose,
  onConfirm,
  mensagem = "Tem certeza que deseja excluir esta avaliação?",
}: ModalExcluirAvaliacaoProps) {
  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />
      <div className="relative bg-white rounded-xl shadow-xl p-8 w-full max-w-sm z-50 flex flex-col items-center">
        <Dialog.Title className="text-lg font-bold mb-4 text-center">Confirmação</Dialog.Title>
        <p className="mb-6 text-center">{mensagem}</p>
        <div className="flex gap-4 w-full">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" className="flex-1" onClick={onConfirm}>
            Excluir
          </Button>
        </div>
      </div>
    </Dialog>
  );
}