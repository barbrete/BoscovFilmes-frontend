import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-8"> {/* aumente max-w e padding */}
                <CardHeader>
                    <CardTitle className="text-3xl text-center">Login</CardTitle> {/* fonte maior */}
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-6"> {/* gap maior */}
                        <Input
                            type="email"
                            placeholder="Email"
                            required
                            className="h-14 text-lg px-5" // aumenta altura e fonte
                        />
                        <Input
                            type="password"
                            placeholder="Senha"
                            required
                            className="h-14 text-lg px-5" // aumenta altura e fonte
                        />
                        <Button type="submit" className="w-full h-14 text-lg">Entrar</Button> {/* botão maior */}
                    </form>
                    <p className="text-base text-center text-muted-foreground mt-6">
                        Não tem uma conta?{" "}
                        <a href="/register" className="text-blue-600 hover:underline">Cadastre-se</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
