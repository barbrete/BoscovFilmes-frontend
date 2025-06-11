"use client"
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import FormCriarUsuario from "@/components/ui/Formularios/FormCriarUsuario";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <FormCriarUsuario
                        tipoUsuarioPadrao="user"
                        exibirTipoUsuario={false}
                        onSuccess={() => {
                            router.push("/login");
                        }}
                        exibirLinkLogin={true}
                    />
        </div>
    );
}