"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  tipo: string;
}

const withAdminRoute = <P extends object>(Component: React.ComponentType<P>) => {
  return function AdminProtected(props: P) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
      const token = Cookies.get("token");
      if (!token) {
        setMessage("Você precisa estar autenticado para acessar essa página.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
        return;
      }
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.tipo !== "admin") {
          setMessage("Acesso restrito: apenas administradores podem acessar essa página.");
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          setAuthorized(true);
        }
      } catch (error) {
        setMessage("Sessão expirada ou token inválido. Faça login novamente.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    }, [router]);

    if (authorized === null) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          {message ? (
            <div className="p-4 bg-red-500 text-white rounded shadow-lg">
              {message}
            </div>
          ) : (
            <div>Carregando...</div>
          )}
        </div>
      );
    }
    return <Component {...props} />;
  };
};

export default withAdminRoute;