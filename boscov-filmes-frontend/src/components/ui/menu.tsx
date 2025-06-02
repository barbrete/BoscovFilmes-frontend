import React from "react";
import Link from "next/link";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function SideMenu({ isOpen, onClose, onOpen }: SideMenuProps) {
  return (
    <aside
      className={`bg-gray-800 text-white h-full fixed top-0 left-0 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {isOpen ? (
        <>
          <div className="p-4 font-bold border-b border-gray-700 flex justify-between items-center">
            <span>Menu</span>
            <button onClick={onClose} className="text-xl font-bold">
              &times;
            </button>
          </div>
          <nav className="p-4">
            <ul>
              <li className="mb-2">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/movies" className="hover:underline">
                  Filmes
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/series" className="hover:underline">
                  Séries
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/favorites" className="hover:underline">
                  Favoritos
                </Link>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <button onClick={onOpen} className="rotate-90 text-xl font-bold">
            &raquo;
          </button>
        </div>
      )}
    </aside>
  );
}