import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../assets/logoPixelHouse.jpeg";
import { LogoutButton } from "../components/logoutButton";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <main className="w-full min-h-screen-minus-header-and-footer flex flex-col items-center px-4 bg-slate-200 text-center">
      {user && (
        <div className="max-w-7xl mx-auto w-full relative">
          <LogoutButton />
        </div>
      )}

      <div className="flex flex-col items-center px-4 sm:py-20 py-10">
        {/* Logo */}
        <img
          src={logo}
          alt="Logo da Pixel House"
          className="w-[180px] h-[180px] object-cover rounded-2xl shadow-lg mb-6"
        />

        {/* Chamada */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Bem-vindo à Pixel House!</h1>

        <p className="text-slate-700 max-w-xl text-lg mb-6">
          Somos uma comunidade criativa focada em tecnologia, inovação e design. Faça parte da nossa casa digital — junte-se a nós, contribua com projetos incríveis e cresça junto com outros apaixonados por código, arte e boas ideias.
        </p>

        {/* Ações - visíveis apenas se não estiver logado */}
        {!user ? (
          <div className="flex gap-4">
            <Link
              to="/entre-na-house"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Criar Conta
            </Link>
            <Link
              to="/login"
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Fazer Login
            </Link>
          </div>
        ) : (
          <div className="flex">
            <Link
              to="/dashboard"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-800 duration-500 transition"
            >
              Lista de Colaboradores!
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
