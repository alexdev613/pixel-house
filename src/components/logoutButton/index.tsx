import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { toast } from "react-hot-toast";

export function LogoutButton() {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    toast.success("Você foi deslogado com sucesso!");
    navigate("/login");
  }

  return (
    <>
      {/* Desktop */}
      <div className="absolute top-6 right-4 px-2 hidden sm:block">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-white bg-slate-400
          hover:text-slate-200 hover:bg-slate-500 transition-all duration-300"
        >
          <span className="font-bold">Sair</span>
          <div className="border-[3px] rounded-full border-white p-1">
            <FiLogOut size={16} />
          </div>
        </button>
      </div>

      {/* Mobile */}
      <div className="block sm:hidden pt-6 text-center">
        <button
          onClick={handleLogout}
          className="font-bold bg-slate-400 px-4 text-white py-2 w-fit rounded-md
          hover:bg-slate-500 transition-all duration-300"
        >
          <div className="flex items-center gap-2 justify-center">
            <span className="font-medium">Sair</span>
            <FiLogOut size={16} />
          </div>
        </button>
      </div>
    </>
  );
}
