"use client";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Usuario {
    id: number;
    nome: string;
    email: string;
    apelido: string;
    senha: string;
    role: "user" | "admin";
    avaliacoes?: any[];
}

interface FormEditarPerfilProps {
    profile: Usuario;
    onSave: (updatedProfile: Usuario) => void;
    onCancel: () => void;
}

export default function FormEditarPerfil({ profile, onSave, onCancel }: FormEditarPerfilProps) {
    const [editNome, setEditNome] = useState(profile.nome);
    const [editEmail, setEditEmail] = useState(profile.email);
    const [editApelido, setEditApelido] = useState(profile.apelido);

    async function handleSave() {
        try {
            const token = Cookies.get("token");
            const updatedProfile = {
                ...profile,
                nome: editNome,
                email: editEmail,
                apelido: editApelido,
            };
            const response = await axios.put("http://localhost:3001/perfil", updatedProfile, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onSave(response.data);
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            alert("Erro ao atualizar perfil");
        }
    }

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="font-semibold">Nome:</label>
                    <Input
                        value={editNome}
                        onChange={(e) => setEditNome(e.target.value)}
                        className="mt-1"
                    />
                </div>
                <div>
                    <label className="font-semibold">Email:</label>
                    <Input
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="mt-1"
                    />
                </div>
                <div>
                    <label className="font-semibold">Apelido:</label>
                    <Input
                        value={editApelido}
                        onChange={(e) => setEditApelido(e.target.value)}
                        className="mt-1"
                    />
                </div>
                <div className="flex gap-4 mt-4">
                    <Button onClick={handleSave}>Salvar</Button>
                    <Button onClick={onCancel}>Cancelar</Button>
                </div>
            </div>
        </div>
    );
}