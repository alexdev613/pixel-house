import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { FiUserCheck, FiLogIn } from "react-icons/fi"; // troquei FiUser por FiUserCheck só pra dar um toque diferente
import logoPixelHouse from "../../assets/logoPixelHouse.jpeg";

export function Header() {
  const { signed, loadingAuth, user } = useContext(AuthContext);

  return (
    <div className="w-full flex items-center justify-center h-24 bg-primary drop-shadow-xl bg-slate-400">
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
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-accent-light">
              <span className="font-medium text-xs sm:text-base">{user?.name}</span>
              <div className="border-2 border-accent bg-background rounded-full p-0">
                <FiUserCheck size={30} className="text-accent" />
              </div>
            </Link>
          </div>
        )}

        {!loadingAuth && !signed && (
          <Link to="/login" className="flex items-center gap-2 text-white">
            <span>Iniciar sessão</span>
            <div className="border-2 rounded-full border-white p-1">
              <FiLogIn size={30} className="text-vanilla" />
            </div>
          </Link>
        )}
      </header>
    </div>
  );
}
