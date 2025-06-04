"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SideMenu from "@/components/ui/menu";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";

interface User {
    id: number;
    nome: string;
    email: string;
    apelido: string;
    dataNascimento: Date,
    tipoUsuario: string;
}
export default function Usuarios() {
    const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

    let tipoUsuario: "admin" | "user" | null = null;

    if (typeof window !== "undefined") {
        const token = Cookies.get("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                console.log("Token decodificado:", decoded);
                tipoUsuario = decoded.tipo || null;
            } catch (e) {
                tipoUsuario = null;
            }
        }
    }


  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get("http://localhost:3001/usuarios");
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }
    fetchUsers();
  }, []);

  function handleDeleteUser(id: number) {
    axios
      .patch(`http://localhost:3001/usuarios/${id}`, { status: false })
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) =>
        console.error("Erro ao inativar usuário:", error)
      );
  }
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <SideMenu
                isOpen={menuOpen}
                onClose={() => setMenuOpen(false)}
                onOpen={() => setMenuOpen(true)}
                role={tipoUsuario}
            />

            <header className="bg-gray-800 text-white p-4 ml-16">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <h1 className="text-3xl font-bold">BoscovFilmes</h1>
                    <Input placeholder="Procurar Filmes..." className="w-1/3" />
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center ml-16">
                <section>
          <h2 className="text-2xl font-semibold mb-4">Gerenciar Usuários</h2>
          <Button className="mb-4">Gerenciar Usuários</Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((user) => (
              <div key={user.id} className="p-4 bg-white rounded shadow">
                <h3 className="text-xl font-bold">{user.nome}</h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">Função: {user.tipoUsuario}</p>
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => { /* Lógica para editar usuário */ }}>
                    Editar
                  </Button>
                  <Button onClick={() => handleDeleteUser(user.id)}>
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
            </main>
        </div>
    );
}