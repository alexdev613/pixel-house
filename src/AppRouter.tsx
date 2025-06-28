// src/AppRouter.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/layout";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EditUser from "./pages/EditUser";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    element: <Layout />, // Aplica Header + Footer para TODAS as rotas
    children: [
      {
        element: <PublicRoute />,
        children: [
          { path: "/entre-na-house", element: <Register /> }, // Visitante sem cadastro pode criar seu usuário
          { path: "/login", element: <Login /> },
        ]
      },
      {
        element: <PrivateRoute />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/editar-usuario/:id", element: <EditUser/> },
          { path: "/cadastrar-usuario", element: <Register /> }, // Usuário logado pode cadastrar um novo usuário!
        ]
      },
      { path: "*", element: <Navigate to="/" replace /> },
      { path: "/", element: <Home />}
    ]
  }
]);

export { router };
