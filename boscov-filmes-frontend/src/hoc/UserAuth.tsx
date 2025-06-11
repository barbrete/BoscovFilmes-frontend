import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Lock, UserX, AlertTriangle } from "lucide-react";

export function UserAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  const UserProtected = (props: P) => {
    const router = useRouter();
    const [status, setStatus] = useState<"checking" | "unauthenticated" | "ok" | "error">("checking");

    useEffect(() => {
      const token = Cookies.get("token");
      if (!token) {
        setStatus("unauthenticated");
        setTimeout(() => router.replace("/login"), 2000);
        return;
      }
      try {
        jwtDecode(token);
        setStatus("ok");
      } catch {
        setStatus("error");
        setTimeout(() => router.replace("/login"), 2000);
      }
    }, [router]);

    if (status === "checking") {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="bg-pink-200 p-8 rounded-xl shadow-lg flex flex-col items-center border-l-8 border-pink-500">
            <Lock className="w-12 h-12 text-pink-600 mb-2" />
            <span className="text-gray-900 text-xl font-bold mb-1">Verificando acesso...</span>
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
            <span className="text-pink-800 text-base">Você precisa estar logado para acessar esta página.</span>
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

  return UserProtected;
}