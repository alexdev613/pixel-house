// src/AppRouter.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/layout";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
  {
    element: <Layout />, // Aplica Header + Footer para TODAS as rotas
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            path: "/",
            element: <Register />
          },
          {
            path: "/login",
            element: <Login />
          },
        ]
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />
          }
        ]
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
]);

export { router };
