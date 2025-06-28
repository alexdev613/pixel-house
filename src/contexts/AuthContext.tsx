import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../services/firebaseConnection";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "react-hot-toast";

export type UserInfoProps = {
  uid: string; // do Firebase Auth
  id: number;  // ID sequencial (INTEGER), único do usuário...
  name: string;
  email: string;
  cpf: string;
  birthDate: string;
  gender: "Masculino" | "Feminino" | "Outro";
  phone: string;
  role: "admin" | "user";
};

type AuthContextType = {
  signed: boolean;
  loadingAuth: boolean;
  user: UserInfoProps | null;
  role: "admin" | "user";
  handleInfoUser: (user: UserInfoProps) => void;
  setUser: (user: UserInfoProps | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextType);

// Provider que envolve a aplicação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfoProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [role, setRole] = useState<"admin" | "user">("user");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);

        const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();

            setUser({
              uid: firebaseUser.uid,
              id: userData.id ?? 0,
              name: userData.name ?? "",
              email: userData.email ?? "",
              cpf: userData.cpf ?? "",
              birthDate: userData.birthDate ?? "",
              gender: userData.gender ?? "Outro",
              phone: userData.phone ?? "",
              role: userData.role ?? "user"
            });

            setRole(userData.role ?? "user");

          } else {
            setUser(null);
            setRole("user"); // Limpar role se usuário não encontrado
          }
          setLoadingAuth(false);
        }, (error) => {
          console.error("Erro ao escutar dados do usuário:", error);
          setUser(null);
          setLoadingAuth(false);
        });

        return () => {
          unsubscribeSnapshot(); // desconecta listener do Firestore
        };
      } else {
        setUser(null);
        setLoadingAuth(false);
      }
    });

    return () => {
      unsubscribeAuth(); // desconecta listener do Firebase Auth
    };
  }, []);

  function handleInfoUser(userData: UserInfoProps) {
    setUser(userData);
  }

  async function signIn(email: string, password: string) {
    setLoadingAuth(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Email ou senha inválidos.");
    } finally {
      setLoadingAuth(false);
    }
  }

  async function signOutUser() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loadingAuth,
        user,
        role,
        handleInfoUser,
        setUser,
        signIn,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
