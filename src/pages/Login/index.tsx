import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

import { auth } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import { CustomInput } from "../../components/CustomInput";

const schema = z.object({
  email: z.string().min(1, { message: "Informe o email" }).email("Email inválido"),
  password: z.string().min(1, { message: "Informe a senha" }),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const { user, loadingAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!loadingAuth && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [loadingAuth, user, navigate]);

  async function onSubmit(data: FormData) {
    setLoading(true);
    clearErrors();

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      console.error("Erro ao logar:", err);

      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        toast.error("Email ou senha inválidos.");
      } else if (err.code === "auth/too-many-requests") {
        toast.error("Muitas tentativas. Tente novamente em alguns minutos.");
      } else {
        toast.error("Erro ao tentar login.");
      }

      setError("email", { message: "Credenciais inválidas" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen-minus-header-and-footer flex flex-col justify-center items-center px-4 bg-slate-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-slate-700">Entrar</h1>

        <div>
          <CustomInput
            type="email"
            {...register("email")}
            placeholder="Digite seu email"
            error={errors.email?.message}
          />

          <CustomInput
            type="password"
            {...register("password")}
            placeholder="Digite sua senha"
            className="mt-2"
            error={errors.password?.message}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-10 font-semibold text-white rounded-md transition mt-10
          ${loading ? "bg-slate-300 cursor-not-allowed" : "bg-slate-400 hover:bg-slate-500"}`}
        >
          {loading ? "Carregando..." : "Acessar"}
        </button>

        <Link to="/recuperar-senha" className="text-sm text-center text-slate-500 hover:underline block">
          Esqueceu a senha?
        </Link>
      </form>
    </div>
  );
}
