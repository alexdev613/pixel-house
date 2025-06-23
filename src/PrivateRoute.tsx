import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

export function PrivateRoute() {
  const { signed, loadingAuth } = useContext(AuthContext);

  if (loadingAuth) return <div>Carregando...</div>;

  return signed ? <Outlet /> : <Navigate to="/login" replace />;
}
