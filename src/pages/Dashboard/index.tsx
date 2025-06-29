import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { LogoutButton } from '../../components/logoutButton';

import { db } from "../../services/firebaseConnection";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Tooltip } from "../../components/tooltip";
import { getTooltipTextByRole } from "../../utils/getTooltipTextByRole";

type User = {
  id: number;
  name: string;
  email: string;
  gender: string;
  createdAt: string;
  uid: string;
  role?: "root" | "admin" | "user";
};

export default function Dashboard() {
  const { signed } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);

  // Página atual da lista de usuários
  const [currentPage, setCurrentPage] = useState(1);
  // Quantidade de cards por página, adaptável à largura da tela
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerPage(2);      // Smartphone (sm)
      else if (width < 768) setItemsPerPage(6); // Tablet (md)
      else setItemsPerPage(9);                  // Desktop (lg+)
    };

    updateItemsPerPage(); // Define a quantidade na montagem do componente
    window.addEventListener("resize", updateItemsPerPage); // Recalcula ao redimensionar

    return () => window.removeEventListener("resize", updateItemsPerPage); // remove o escutador
  }, []);

  // Total de páginas calculado com base no número de usuários e itens por página
  const totalPages = Math.ceil(users.length / itemsPerPage);
  // Índice inicial dos usuários da página atual
  const startIndex = (currentPage - 1) * itemsPerPage;
  // Lista de usuários visíveis na página atual (paginada)
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    async function fetchUsers() {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);

      const usersList: User[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          gender: data.gender,
          createdAt: data.createdAt?.toDate().toISOString() || "", // converte corretamente
          uid: doc.id,
          role: data.role ?? "user", // Pega o role do Firestore ou assume 'user'
        };
      });

      setUsers(usersList);
    }

    fetchUsers();
  }, []);

  if (!signed) return null; // Evita renderizar a página se não estiver logado (Só por segurança extra)

  return (
    <main className="relative min-h-screen-minus-header-and-footer w-full px-4 bg-slate-300">
      <div className="max-w-7xl mx-auto w-full relative">
        <LogoutButton />

        <h1 className="text-xl sm:text-2xl font-bold mb-6 pt-10 sm:pt-20 text-center">USUÁRIOS CADASTRADOS:</h1>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {currentUsers.map((user) => (
            <li key={user.uid} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all overflow-visible">
              <div className="flex items-center gap-2 mb-1">

                <Tooltip tooltipText={getTooltipTextByRole(user.role)}>
                  <span
                    className={`inline-block w-4 h-4 rounded-full cursor-pointer
                  ${user.role === "root" ? "bg-green-500" : user.role === "admin" ? "bg-blue-500" : "bg-slate-600"}`}
                  ></span>
                </Tooltip>

                <h2 className="text-lg font-semibold text-slate-800">
                  ID: {user.id} - {user.name}
                </h2>
              </div>

              <p className="text-slate-600 text-sm">Email: {user.email}</p>
              <p className="text-slate-600 text-sm">Gênero: {user.gender}</p>
              <p className="text-slate-500 text-xs mt-1">
                Criado em: {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </p>
              <Link
                to={`/editar-usuario/${user.uid}`}
                className="inline-block mt-3 text-white font-medium text-center bg-red-600 w-full border rounded-md border-neutral-400"
              >
                Editar
              </Link>
            </li>
          ))}
        </ul>

        {/* Botões de paginação */}
        <div className="flex justify-center mt-6 pb-4 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 disabled:opacity-50"
          >
            Anterior
          </button>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </main>
  )
}
