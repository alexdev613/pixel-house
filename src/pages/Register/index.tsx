import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import UserForm from "../../components/UserForm";

export default function Register() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isVisitorCreatingAccount = location.pathname === "/entre-na-house" && !user;

  return (
    <main className="min-h-screen-minus-header-and-footer max-w-7xl mx-auto w-full relative p-4">
      <UserForm />

      {isVisitorCreatingAccount && (
        <div className="text-center mt-2 text-slate-600">
          <span>Já possui conta? </span>
          <Link
            to="/login"
            className="text-sm text-blue-600 font-semibold cursor-pointer
            hover:text-base hover:text-blue-700 duration-500 transition-all"
          >
            Faça login aqui!
          </Link>
        </div>
      )}
    </main>
  )
}
