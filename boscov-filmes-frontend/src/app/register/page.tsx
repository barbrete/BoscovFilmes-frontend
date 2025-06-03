"use client"
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";

export default function Register() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [apelido, setApelido] = useState("");
    const [data_nascimento, setDataNascimento] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setErro("");
        setSucesso("");
        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }
        try {
            await axios.post("http://localhost:3001/usuarios", {
                nome,
                email,
                apelido,
                data_nascimento: new Date(data_nascimento).toISOString(),
                password: senha,
                status: true,
                tipo_usuario: "user",
            });
            setSucesso("Cadastro realizado com sucesso!");
        } catch (err) {
            setErro("Erro ao cadastrar. Tente novamente.");
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-8"> {/* aumente max-w e padding */}
                <CardHeader>
                    <CardTitle className="text-3xl text-center">Cadastro</CardTitle> {/* fonte maior */}
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

                        <Button type="submit" className="w-full h-14 text-lg">Cadastrar</Button> {/* botão maior */}
                    </form>
                    {erro && <p className="text-red-500 text-center mt-2">{erro}</p>}
                    {sucesso && <p className="text-green-600 text-center mt-2">{sucesso}</p>}
                    <p className="text-base text-center text-muted-foreground mt-6">
                        Já tem uma conta?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">Entrar</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
