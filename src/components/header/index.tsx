import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { FiUser, FiLogIn } from "react-icons/fi";
import logoPixelHouse from "../../assets/pixelLogo.png";

export function Header() {
  const { signed, loadingAuth, user } = useContext(AuthContext);

  return (
    <div className="w-full flex items-center justify-center h-24 drop-shadow-xl bg-slate-400 overflow-visible">
      <header className="flex w-full max-w-7xl items-center justify-between px-4 mx-auto">
        <Link to="/" className="flex items-center gap-x-2">
          <img
            src={logoPixelHouse}
            alt="Logo Pixel House"
            className="h-16 rounded-full border-accent border"
          />
          <h1 className="hidden sm:flex sm:text-lg md:text-2xl font-bold text-vanilla">
            <span className="text-red-700">Pixel</span> <span>house</span>
          </h1>
        </Link>

        {!loadingAuth && signed && (
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center text-center">
              <span className="font-bold text-xs sm:text-base text-black relative">
                {user?.name}
                <span className={`block h-[2px] mt-1 rounded-full ${user?.role === "root" ? "bg-green-700" :
                  user?.role === "admin" ? "bg-blue-700" : "bg-gray-500 w-full"}`}
                >
                </span>
              </span>
              <span className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full ${user?.role === "root"
                ? "bg-green-300 text-green-800 border border-green-600"
                : user?.role === "admin"
                  ? "bg-blue-300 text-blue-800 border border-blue-600"
                  : "bg-gray-300 text-gray-800 border border-gray-500"
                }`}
              >
                {user?.role === "root" ? "Super Admnistardor" : user?.role === "admin" ? "Administrador" : "Usuário básico"}
              </span>
            </div>

            <div className="border-4 border-slate-900 bg-red-700 rounded-full p-0">
              <FiUser size={36} className="text-black" />
            </div>
          </div>
        )}

        {!loadingAuth && !signed && (
          <Link to="/login" className="flex items-center gap-2 text-white">
            <span>Iniciar sessão</span>
            <div className="border-2 rounded-full border-white p-1">
              <FiLogIn size={30} className="text-slate-200" />
            </div>
          </Link>
        )}
      </header>
    </div>
  );
}
