import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-8"> {/* aumente max-w e padding */}
                <CardHeader>
                    <CardTitle className="text-3xl text-center">Cadastro</CardTitle> {/* fonte maior */}
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-6"> {/* gap maior */}
                        <Input
                            type="text"
                            placeholder="Nome Completo"
                            required
                            className="h-14 text-lg px-5" // aumenta altura e fonte
                        />
                        
                        <Input
                            type="email"
                            placeholder="Email"
                            required
                            className="h-14 text-lg px-5" // aumenta altura e fonte
                        />

                        <Input
                            type="apelido"
                            placeholder="Apelido"
                            required
                            className="h-14 text-lg px-5" // aumenta altura e fonte
                        />
                        
                        <Input
                            type="date"
                            placeholder="Data de Nascimento"
                            required
                            className="h-14 text-lg px-5" // aumenta altura e fonte
                        />

                        <Input
                            type="password"
                            placeholder="Senha"
                            required
                            className="h-14 text-lg px-5" // aumenta altura e fonte
                        />

                        <Input
                            type="password"
                            placeholder="Confirmar Senha"
                            required
                            className="h-14 text-lg px-5" // aumenta altura e fonte
                        />

                        <Button type="submit" className="w-full h-14 text-lg">Entrar</Button> {/* botão maior */}
                    </form>
                    <p className="text-base text-center text-muted-foreground mt-6">
                        Já tem uma conta?{" "}
                        <a href="/register" className="text-blue-600 hover:underline">Entrar</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
