"use client"
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setErro("");
        try {
            const response = await axios.post("http://localhost:3001/auth/login", {
                email,
                password: senha,
            });
            const token = response.data.token;
            localStorage.setItem("token", token);
            Cookies.set("token", token)
            const decoded: any = jwtDecode(token);
            console.log("Token decodificado:", decoded);

            if (decoded.tipo === "admin") {
                router.push("/admin/home");
            } else {
                router.push("/user/home");
            }
        } catch (error) {
            setErro("Email ou senha inválidos");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-8">
                <CardHeader>
                    <CardTitle className="text-3xl text-center">Login</CardTitle> {/* fonte maior */}
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                        <Input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
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
                        <Button type="submit" className="w-full h-14 text-lg">Entrar</Button> {/* botão maior */}
                    </form>
                    {erro && <p className="text-red-500 text-center mt-2">{erro}</p>}
                    <p className="text-base text-center text-muted-foreground mt-6">
                        Não tem uma conta?{" "}
                        <a href="/register" className="text-blue-600 hover:underline">Cadastre-se</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
