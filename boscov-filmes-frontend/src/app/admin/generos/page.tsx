"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SideMenu from "@/components/ui/menu";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";

interface Genre {
    id?: number;
    descricao: string;
}
export default function Generos() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [generos, setGeneros] = useState<Genre[]>([]);
    const [editandoGenero, setEditandoGenero] = useState<Genre | null>(null);
    const [modalGeneroAberto, setModalGeneroAberto] = useState(false);

    useEffect(() => {
        async function buscarGeneros() {
            try {
                const response = await axios.get("http://localhost:3001/generos");
                setGeneros(response.data);
            } catch (error) {
                console.error("Erro ao buscar gêneros:", error);
            }
        }
        buscarGeneros();
    }, []);

    function editarGenero(genero: Genre) {
        setEditandoGenero(genero);
        setModalGeneroAberto(true);
    }

    function excluirGenero(id: number) {
        axios
            .delete(`http://localhost:3001/generos/${id}`)
            .then(() => setGeneros(generos.filter((g) => g.id !== id)))
            .catch((error) => console.error("Erro ao excluir gênero:", error));
    }

    function salvarGenero(generoAtualizado: Genre) {
        if (typeof generoAtualizado.id === "number") {
            // Editar gênero existente
            axios
                .put(`http://localhost:3001/generos/${generoAtualizado.id}`, { descricao: generoAtualizado.descricao })
                .then((response) => {
                    setGeneros(generos.map((g) => (g.id === generoAtualizado.id ? response.data : g)));
                    setModalGeneroAberto(false);
                    setEditandoGenero(null);
                })
                .catch((error) => console.error("Erro ao editar gênero:", error));
        } else {
            // Adicionar novo gênero
            axios
                .post("http://localhost:3001/generos", { descricao: generoAtualizado.descricao })
                .then((response) => {
                    setGeneros([...generos, response.data]);
                    setModalGeneroAberto(false);
                    setEditandoGenero(null);
                })
                .catch((error) => console.error("Erro ao adicionar gênero:", error));
        }
    }
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

            <main className="flex-grow max-w-6xl mx-auto p-8 ml-16">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Gerenciar Gêneros</h2>
                    <Button className="mb-4" onClick={() => { setEditandoGenero({ descricao: "" }); setModalGeneroAberto(true); }}>
                        Adicionar Gênero
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {generos.map((genero) => (
                            <div key={genero.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                                <span className="text-lg">{genero.descricao}</span>
                                <div className="flex gap-2">
                                    <Button onClick={() => editarGenero(genero)}>Editar</Button>
                                    <Button onClick={() => excluirGenero(genero.id!)}>Excluir</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {modalGeneroAberto && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
                        <h3 className="text-xl font-bold mb-4">{editandoGenero && editandoGenero.id !== undefined ? "Editar Gênero" : "Adicionar Gênero"}</h3>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                if (editandoGenero && editandoGenero.descricao.trim()) {
                                    salvarGenero(editandoGenero);
                                }
                            }}
                            className="flex flex-col gap-4"
                        >
                            <input
                                type="text"
                                className="border rounded p-2"
                                placeholder="Descrição do gênero"
                                value={editandoGenero?.descricao || ""}
                                onChange={e =>
                                    setEditandoGenero(editandoGenero && editandoGenero.id !== undefined
                                        ? { id: editandoGenero.id, descricao: e.target.value }
                                        : { descricao: e.target.value }
                                    )
                                }
                                required
                            />
                            <div className="flex gap-2">
                                <Button type="button" variant="secondary" onClick={() => setModalGeneroAberto(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit">
                                    Salvar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}