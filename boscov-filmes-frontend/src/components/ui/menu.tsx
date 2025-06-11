import React from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  role: "admin" | "user" | null;
}

export default function SideMenu({ isOpen, onClose, onOpen, role }: SideMenuProps) {
  const router = useRouter();

  function handleLogout() {
    Cookies.remove("token");
    router.push("/login"); 
  }
  return (
    <aside
      className={`z-50 bg-gray-700 text-white h-full fixed top-0 left-0 transition-all duration-300 ${isOpen ? "w-64" : "w-16"
        }`}
    >
      {isOpen ? (
        <>
          <div className="p-4 font-bold border-b border-gray-700 flex justify-between items-center">
            <span>Menu</span>
            <button onClick={onClose} className="text-xl font-bold">
              <X />
            </button>
          </div>
          <nav className="p-4">
            <ul>
              {/* admin */}
              {role === "admin" && (
                <>
                  <li className="mb-2">
                    <Link href="/admin/home" className="hover:underline">
                      Página Principal
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/admin/filmes" className="hover:underline">
                      Gerenciar Filmes
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/admin/usuarios" className="hover:underline">
                      Gerenciar Usuários
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/admin/generos" className="hover:underline">
                      Gerenciar Generos
                    </Link>
                  </li>

                </>
              )}

              {role === "user" && (
                <>
                  <li className="mb-2">
                    <Link href="/user/home" className="hover:underline">
                      Página Principal
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/perfil" className="hover:underline">
                      Meu Perfil
                    </Link>
                  </li>
                  {/* <li className="mb-2">
                    <Link href="/series" className="hover:underline">
                      Minhas Avaliações
                    </Link>
                  </li> */}

                </>
              )}
              <li className="mb-2">
                <button onClick={handleLogout} className="hover:underline w-full text-left">
                  Sair
                </button>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <div className="flex items-start mt-10 justify-center h-full">
          <button onClick={onOpen} className="text-xl font-bold">
            <ChevronRight />
          </button>
        </div>
      )}
    </aside>
  );
}