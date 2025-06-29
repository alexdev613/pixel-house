import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Um email foi enviado para redefinir sua senha.");
        navigate("/login"); // Redireciona o usuário para a tela de login
      })
      .catch((error) => {
        console.log("Erro ao enviar email de redefinição de senha:", error);
        toast.error("Erro ao enviar email. Verifique o email e tente novamente.");
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="w-full min-h-screen-minus-header-and-footer flex flex-col justify-center items-center gap-4">
      <h2 className="text-2xl font-semibold mb-4 text-red-600">Recuperar <span className="text-black">Senha</span></h2>
      <form
        className="bg-white max-w-xl w-full rounded-lg p-4"
        onSubmit={handleSubmit}
      >
        <label htmlFor="email" className="block mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md text-white h-10 font-medium transition-all duration-300
          ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
        >
          {loading ? "Enviando..." : "Enviar Link de Redefinição"}
        </button>

      </form>
      <Link to="/login" className="text-blue-700 font-semibold hover:underline">
        Voltar pra tela de login...
      </Link>
    </div>
  );
}
