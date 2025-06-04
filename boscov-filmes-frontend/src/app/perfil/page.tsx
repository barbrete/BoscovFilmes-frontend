"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
}

function simulateProfile(role: "user" | "admin"): Promise<UserProfile> {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (role === "user") {
                resolve({
                    id: 1,
                    name: "Admin User",
                    email: "admin@example.com",
                    role: "admin",
                });
            } else {
                resolve({
                    id: 2,
                    name: "Regular User",
                    email: "user@example.com",
                    role: "user",
                });
            }
        }, 1000);
    });
}

export default function Perfil() {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        simulateProfile("admin").then((data) => {
            setProfile(data);
        });
    }, []);

    if (!profile) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-4">Perfil do Usuário</h1>
            <div className="bg-white p-6 rounded shadow">
                <p>
                    <strong>Nome:</strong> {profile.name}
                </p>
                <p>
                    <strong>Email:</strong> {profile.email}
                </p>

                {profile.role === "admin" ? (
                    <div className="mt-4">
                        <Button onClick={() => alert("Acessar painel de administração")}>
                            Acessar Painel Admin
                        </Button>
                        <Button
                            className="mt-2"
                            onClick={() => alert("Gerenciar usuários")}
                        >
                            Gerenciar Usuários
                        </Button>
                    </div>
                ) : (
                    <div className="mt-4">
                        <Button onClick={() => alert("Editar Perfil")}>
                            Editar Perfil
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}