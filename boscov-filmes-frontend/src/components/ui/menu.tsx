import React from "react";
import Link from "next/link";
import { X, ChevronRight, Home, Film, Users, Tag, User as UserIcon, LogOut } from "lucide-react";
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
      className={`z-50 fixed top-0 left-0 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } bg-gray-900 text-white h-full flex flex-col`}
    >
      {isOpen ? (
        <>
          <div className="p-4 font-bold border-b border-gray-800 flex justify-between items-center bg-pink-600">
            <span className="text-xl">Menu</span>
            <button onClick={onClose} className="text-2xl font-bold text-pink-100 hover:text-pink-300 cursor-pointer">
              <X />
            </button>
          </div>
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-6">
              {/* Admin */}
              {role === "admin" && (
                <>
                  <li>
                    <Link href="/admin/home" className="flex items-center gap-3 hover:text-pink-400 text-lg">
                      <Home size={24} />
                      <span>Página Principal</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/filmes" className="flex items-center gap-3 hover:text-pink-400 text-lg">
                      <Film size={24} />
                      <span>Gerenciar Filmes</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/usuarios" className="flex items-center gap-3 hover:text-pink-400 text-lg">
                      <Users size={24} />
                      <span>Gerenciar Usuários</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/generos" className="flex items-center gap-3 hover:text-pink-400 text-lg">
                      <Tag size={24} />
                      <span>Gerenciar Gêneros</span>
                    </Link>
                  </li>
                   <li>
                    <Link href="/perfil" className="flex items-center gap-3 hover:text-pink-400 text-lg">
                      <UserIcon size={24} />
                      <span>Meu Perfil</span>
                    </Link>
                  </li>
                </>
              )}
              {/* User */}
              {role === "user" && (
                <>
                  <li>
                    <Link href="/user/home" className="flex items-center gap-3 hover:text-pink-400 text-lg">
                      <Home size={24} />
                      <span>Página Principal</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/perfil" className="flex items-center gap-3 hover:text-pink-400 text-lg">
                      <UserIcon size={24} />
                      <span>Meu Perfil</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          {/* Botão Sair fixado na parte de baixo */}
          <div className="p-4 border-t border-gray-800 mt-auto">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-3 w-full hover:text-pink-400 cursor-pointer text-lg"
            >
              <LogOut size={24}/>
              <span>Sair</span>
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full mt-10">
          <button onClick={onOpen} className="text-2xl text-pink-400 hover:text-pink-300 cursor-pointer">
            <ChevronRight />
          </button>
        </div>
      )}
    </aside>
  );
}