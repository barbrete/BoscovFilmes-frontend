import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { Lock, UserX, ShieldOff, AlertTriangle } from "lucide-react";

export function AdminAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  const AdminProtected = (props: P) => {
    const router = useRouter();
    const [status, setStatus] = useState<"checking" | "unauthenticated" | "unauthorized" | "error" | "ok">("checking");

    useEffect(() => {
      const token = Cookies.get("token");
      if (!token) {
        setStatus("unauthenticated");
        setTimeout(() => router.replace("/login"), 3000);
        return;
      }
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.tipo !== "admin") {
          setStatus("unauthorized");
          setTimeout(() => router.replace("/user/home"), 3000);
        } else {
          setStatus("ok");
        }
      } catch {
        setStatus("error");
        setTimeout(() => router.replace("/login"), 3000);
      }
    }, [router]);

    if (status === "checking") {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="bg-pink-200 p-8 rounded-xl shadow-lg flex flex-col items-center border-l-8 border-pink-500">
            <Lock className="w-12 h-12 text-pink-600 mb-2" />
            <span className="text-gray-900 text-xl font-bold mb-1">Verificando permissão...</span>
            <span className="text-gray-700 text-base">Aguarde um instante</span>
          </div>
        </div>
      );
    }
    if (status === "unauthenticated") {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="bg-pink-100 p-8 rounded-xl shadow-lg flex flex-col items-center border-l-8 border-pink-500">
            <UserX className="w-12 h-12 text-pink-600 mb-2" />
            <span className="text-pink-900 text-xl font-bold mb-1">Acesso restrito</span>
            <span className="text-pink-800 text-base">Você precisa estar logado para acessar esta página de administrador.</span>
          </div>
        </div>
      );
    }
    if (status === "unauthorized") {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="bg-purple-100 p-8 rounded-xl shadow-lg flex flex-col items-center border-l-8 border-purple-500">
            <ShieldOff className="w-12 h-12 text-purple-600 mb-2" />
            <span className="text-purple-900 text-xl font-bold mb-1">Acesso negado</span>
            <span className="text-purple-800 text-base">Apenas administradores têm acesso a esta página.</span>
          </div>
        </div>
      );
    }
    if (status === "error") {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="bg-pink-200 p-8 rounded-xl shadow-lg flex flex-col items-center border-l-8 border-pink-600">
            <AlertTriangle className="w-12 h-12 text-pink-700 mb-2" />
            <span className="text-pink-900 text-xl font-bold mb-1">Erro de autenticação</span>
            <span className="text-pink-800 text-base">Erro ao validar o acesso. Faça login novamente.</span>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return AdminProtected;
}