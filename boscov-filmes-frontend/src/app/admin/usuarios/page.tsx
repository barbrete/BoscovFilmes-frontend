"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SideMenu from "@/components/ui/menu";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import FormCriarUsuario from "@/components/ui/Formularios/FormCriarUsuario";
import { Pencil, Plus, Trash, User, UserRoundCheck, X } from "lucide-react";
import { AdminAuth } from "@/hoc/AdminAuth";

interface User {
  id: number;
  nome: string;
  email: string;
  apelido: string;
  data_nascimento: Date,
  tipo_usuario: "admin" | "user";
  status?: boolean;
}

function Usuarios() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<User | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<"ativos" | "desativados">("ativos");
  const token = Cookies.get("token");
  let tipoUsuario: "admin" | "user" | null = null;

  if (typeof window !== "undefined") {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        tipoUsuario = decoded.tipo || null;
      } catch (e) {
        tipoUsuario = null;
      }
    }
  }

  async function buscarUsuarios() {
    try {
      const response = await axios.get("http://localhost:3001/usuarios", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  }

  useEffect(() => {
    buscarUsuarios();
  }, []);

  async function handleToggleUserStatus(id: number, status: boolean) {
    try {
      await axios.put(`http://localhost:3001/usuarios/${id}`, { status },
        {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
      setUsers(users =>
        users.map(user =>
          user.id === id ? { ...user, status } : user
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status do usuário:", error);
    }
  }

  const filteredUsers = users.filter((user) =>
    user.nome.toLowerCase().includes(search.toLowerCase())
  );

  const admins = filteredUsers.filter((user) => user.tipo_usuario === "admin");
  const comuns = filteredUsers.filter((user) => user.tipo_usuario !== "admin");
  const adminsAtivos = admins.filter((user) => user.status !== false);
  const adminsDesativados = admins.filter((user) => user.status === false);
  const comunsAtivos = comuns.filter((user) => user.status !== false);
  const comunsDesativados = comuns.filter((user) => user.status === false);

  function handleCreateUser() {
    setShowCreate(true);
    setUsuarioEditando(null);
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
          <h1 className="text-4xl font-extrabold tracking-tight">BoscovFilmes Admin</h1>
          <Input placeholder="Procurar..." className="w-1/3" />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center ml-16">
        <h2 className="text-2xl font-semibold mt-10">Gerenciar Usuários</h2>

        <section className="mt-10 w-full max-w-6xl">
          <div className="flex items-center mb-4">
            <Button className="h-20 w-50 rounded-md text-xl cursor-pointer"
              onClick={handleCreateUser}>
              Criar Usuário <Plus className="!w-6 !h-6" />
            </Button>
          </div>
          <div className="mb-6">
            <Input
              placeholder="Procurar Usuários..."
              className="w-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Botões de filtro */}
          <div className="flex justify-between gap-4 mb-8">
            <Button
              className="h-10 w-70 rounded-md text-md cursor-pointer"
              variant={filtroStatus === "ativos" ? "default" : "outline"}
              onClick={() => setFiltroStatus("ativos")}
            >
              Mostrar Usuários Ativos <UserRoundCheck />
            </Button>
            <Button className="h-10 w-70 rounded-md text-md cursor-pointer"
              variant={filtroStatus === "desativados" ? "default" : "outline"}
              onClick={() => setFiltroStatus("desativados")}
            >
              Mostrar Usuários Desativados <Trash />
            </Button>
          </div>

          {showCreate && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-4 rounded shadow mb-6 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl cursor-pointer mt-3 mr-3"
                  onClick={() => {
                    setShowCreate(false);
                    setUsuarioEditando(null);
                  }}
                  aria-label="Fechar"
                >
                  <X />
                </button>
                <h2 className="text-xl font-bold mb-4">
                  {usuarioEditando ? "Editar Usuário" : "Criar Usuário"}
                </h2>
                <FormCriarUsuario
                  usuario={usuarioEditando ?? undefined}
                  exibirTipoUsuario={true}
                  onSuccess={() => {
                    buscarUsuarios();
                    setShowCreate(false);
                    setUsuarioEditando(null);
                  }}
                  onCancel={() => {
                    setShowCreate(false);
                    setUsuarioEditando(null);
                  }}
                />
              </div>
            </div>
          )}

          {/* Administradores */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-2">
              Administradores {filtroStatus === "ativos" ? "Ativos" : "Desativados"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(filtroStatus === "ativos" ? adminsAtivos : adminsDesativados).length === 0 && (
                <p className="text-gray-500">
                  Nenhum admin {filtroStatus === "ativos" ? "ativo" : "desativado"}.
                </p>
              )}
              {(filtroStatus === "ativos" ? adminsAtivos : adminsDesativados).map((user) => (
                <div
                  key={user.id}
                  className={`p-4 bg-white rounded shadow ${filtroStatus === "desativados" ? "opacity-60" : ""}`}
                >
                  <h3 className="text-xl font-bold">{user.nome}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-600">Apelido: {user.apelido}</p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      className="cursor-pointer"
                      onClick={() => {
                        setUsuarioEditando(user);
                        setShowCreate(true);
                      }}>
                      <Pencil />
                    </Button>
                    {filtroStatus === "ativos" ? (
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => handleToggleUserStatus(user.id, false)}
                      >
                        <Trash />
                      </Button>
                    ) : (
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => handleToggleUserStatus(user.id, true)}
                      >
                        <UserRoundCheck />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usuários comuns */}
          <div>
            <h3 className="text-xl font-bold mb-2 mt-8">
              Usuários {filtroStatus === "ativos" ? "Ativos" : "Desativados"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {(filtroStatus === "ativos" ? comunsAtivos : comunsDesativados).length === 0 && (
                <p className="text-gray-500">
                  Nenhum usuário {filtroStatus === "ativos" ? "ativo" : "desativado"}.
                </p>
              )}
              {(filtroStatus === "ativos" ? comunsAtivos : comunsDesativados).map((user) => (
                <div
                  key={user.id}
                  className={`p-4 bg-white rounded shadow ${filtroStatus === "desativados" ? "opacity-60" : ""}`}
                >
                  <p className="text-xl font-bold">{user.apelido}</p>
                  <h3 className="text-gray-600">{user.nome}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      className="cursor-pointer"
                      onClick={() => {
                        setUsuarioEditando(user);
                        setShowCreate(true);
                      }}>
                      <Pencil />
                    </Button>
                    {filtroStatus === "ativos" ? (
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => handleToggleUserStatus(user.id, false)}
                      >
                        <Trash />
                      </Button>
                    ) : (
                      <Button
                        className="cursor-pointer"
                        variant="outline"
                        onClick={() => handleToggleUserStatus(user.id, true)}
                      >
                        <UserRoundCheck />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <div className="mb-20"></div>
    </div>
  );
}

export default AdminAuth(Usuarios);