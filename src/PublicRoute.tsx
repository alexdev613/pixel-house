import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

export function PublicRoute() {
  const { signed, loadingAuth } = useContext(AuthContext);

  if (loadingAuth) return <div className="min-h-screen-minus-header-and-footer max-w-7xl mx-auto w-full relative">Carregando...</div>;

  return !signed ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
