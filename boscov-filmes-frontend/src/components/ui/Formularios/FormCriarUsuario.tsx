"use client"
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";

interface Usuario {
    id?: number;
    nome: string;
    email: string;
    apelido: string;
    data_nascimento: Date;
    status?: boolean;
    tipo_usuario: "user" | "admin";
}

interface FormCriarUsuarioProps {
    usuario?: Usuario;
    tipoUsuarioPadrao?: "user" | "admin";
    exibirTipoUsuario?: boolean;
    onSuccess?: () => void;
    onCancel?: () => void;
    exibirLinkLogin?: boolean;
}

export default function FormCriarUsuario({ usuario, tipoUsuarioPadrao = "user", exibirTipoUsuario = false, exibirLinkLogin = false, onSuccess, onCancel }: FormCriarUsuarioProps) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [apelido, setApelido] = useState("");
    const [data_nascimento, setDataNascimento] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState<"user" | "admin">(tipoUsuarioPadrao);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (usuario) {
            setNome(usuario.nome);
            setEmail(usuario.email);
            setApelido(usuario.apelido);
            setDataNascimento(
                usuario.data_nascimento
                    ? new Date(usuario.data_nascimento).toISOString().split("T")[0]
                    : ""
            ); setTipoUsuario(usuario.tipo_usuario as "user" | "admin");
        } else {
            setNome("");
            setEmail("");
            setApelido("");
            setDataNascimento("");
            setTipoUsuario("user");
        }
    }, [usuario]);

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setErro("");
        setSucesso("");
        setLoading(true);

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }
        try {
            if (usuario) {
                await axios.put(`http://localhost:3001/usuarios/${usuario.id}`, {
                    nome, email, apelido, data_nascimento, password: senha, status: true, tipo_usuario: tipoUsuario
                });
                setSucesso("Usuário atualizado com sucesso!");
            }
            else {
                await axios.post("http://localhost:3001/usuarios", {
                    nome,
                    email,
                    apelido,
                    data_nascimento: new Date(data_nascimento).toISOString(),
                    password: senha,
                    status: true,
                    tipo_usuario: tipoUsuario,
                });
                if (onSuccess) onSuccess();
                console.log(onSuccess);
                setSucesso("Cadastro realizado com sucesso!");
            }
        } catch (err: any) {
            console.log("ERRO AO CADASTRAR:", err);
            if (err.response?.data?.message) {
                setErro(err.response.data.message);
            } else {
                setErro("Erro ao cadastrar. Tente novamente.");
            }
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <Card className="w-full max-w-md p-8"> {/* aumente max-w e padding */}
            <CardHeader>
                <CardTitle className="text-3xl text-center">  {usuario ? "Editar Usuário" : "Cadastro"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-6" onSubmit={handleRegister}>
                    <Input
                        type="text"
                        placeholder="Nome Completo"
                        required
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        className="h-14 text-lg px-5" // aumenta altura e fonte
                    />

                    <Input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="h-14 text-lg px-5" // aumenta altura e fonte
                    />

                    <Input
                        type="text"
                        placeholder="Apelido"
                        required
                        value={apelido}
                        onChange={e => setApelido(e.target.value)}
                        className="h-14 text-lg px-5" // aumenta altura e fonte
                    />

                    <Input
                        type="date"
                        placeholder="Data de Nascimento"
                        required
                        value={data_nascimento}
                        onChange={e => setDataNascimento(e.target.value)}
                        className="h-14 text-lg px-5" // aumenta altura e fonte
                    />

                    <Input
                        type="password"
                        placeholder="Senha"
                        required
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        className="h-14 text-lg px-5" // aumenta altura e fonte
                    />

                    <Input
                        type="password"
                        placeholder="Confirmar Senha"
                        required

                        value={confirmarSenha}
                        onChange={e => setConfirmarSenha(e.target.value)}
                        className="h-14 text-lg px-5" // aumenta altura e fonte
                    />
                    {exibirTipoUsuario && (
                        <select
                            className="border rounded p-2"
                            value={tipoUsuario}
                            onChange={e => setTipoUsuario(e.target.value as "user" | "admin")}
                        >
                            <option value="user">Usuário Comum</option>
                            <option value="admin">Administrador</option>
                        </select>
                    )}
                    <Button type="submit" className="w-full h-14 text-lg" disabled={loading}>{usuario ? "Salvar Alterações" : "Cadastrar"}</Button>
                </form>
                {erro && <p className="text-red-500 text-center mt-2">{erro}</p>}
                {sucesso && <p className="text-green-600 text-center mt-2">{sucesso}</p>}
                {exibirLinkLogin && (
                    <p className="text-base text-center text-muted-foreground mt-6">
                        Já tem uma conta?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">Entrar</a>
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
