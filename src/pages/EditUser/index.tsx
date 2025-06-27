import { useParams } from "react-router-dom";
import UserForm from "../../components/UserForm";

export default function EditUser() {
  const { id } = useParams(); // Pra pegar o id da rota /editar-usuario/:id

  return (
    <main className="min-h-screen-minus-header-and-footer max-w-7xl mx-auto w-full relative">
      <UserForm docId={id} />
    </main>
  )
}