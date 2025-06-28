import { useEffect, useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { createUserSchema } from "../../schemas/registerSchema";
import { editUserSchema } from "../../schemas/editUserSchema";
import { z } from "zod";
import { CustomInput } from "../CustomInput";
import { formatPhoneNumber } from "../../utils/formatPhone";
import { createUser } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

interface UserFormProps {
  docId?: string;
}

type CreateUserFormData = z.infer<typeof createUserSchema>;
type EditUserFormData = z.infer<typeof editUserSchema>;

export default function UserForm({ docId }: UserFormProps) {
  const { user: loggedUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate()

  const formSchema = docId ? editUserSchema : createUserSchema;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateUserFormData | EditUserFormData>({
    resolver: zodResolver(formSchema),
    mode: "all",
  });

  useEffect(() => {
    async function loadUserData() {
      if (docId) {
        setLoading(true);
        const docRef = doc(db, "users", docId);
        const docSnap = await getDoc(docRef);


        if (docSnap.exists()) {
          const userData = docSnap.data() as EditUserFormData;
          reset(userData);

          console.log("👤 loggedUser?.uid:", loggedUser?.uid);
          console.log("📄 docId:", docId);
          console.log("🔐 isEditable será:", !!loggedUser && loggedUser.uid === docId);

          // Verifica se o usuário logado é o dono dos dados
          const isOwner = loggedUser?.uid === docId;
          // Verifica se o usuário logado tem permissão de administrador
          const isAdmin = loggedUser?.role === "admin";

          // Permite edição se for o próprio dono ou um administrador
          setIsEditable(isOwner || isAdmin);
        } else {
          toast.error("Usuário não encontrado.");
          reset();
          setIsEditable(false);
        }
        setLoading(false);
      } else {
        reset();
        setIsEditable(true); // Em modo de criação pode editar
      }
    }

    loadUserData();
  }, [docId, loggedUser, reset]);

  async function onSubmit(data: CreateUserFormData | EditUserFormData) {
    setLoading(true);

    try {
      const formattedBirthDate =
        data.birthDate instanceof Date && !isNaN(data.birthDate.getTime())
          ? data.birthDate.toISOString().split("T")[0]
          : typeof data.birthDate === "string" && data.birthDate !== ""
            ? data.birthDate
            : "";

      // === EDIÇÃO ===
      if (docId) {
        const { birthDate, ...userData } = data as EditUserFormData;

        if (!isEditable) {
          toast.error("Você não pode editar os dados de outro usuário.");
          setTimeout(() => { navigate("/dashboard") }, 1000);
          return;
        }

        const docRef = doc(db, "users", docId);
        await updateDoc(docRef, {
          ...userData,
          birthDate: formattedBirthDate,
        });

        toast.success("Dados atualizados com sucesso!");
        navigate("/dashboard");
      }

      // === CRIAÇÃO ===
      else {
        const {
          password,
          confirmPassword,
          birthDate,
          ...userData
        } = data as CreateUserFormData;

        const creationPayload = {
          ...userData,
          birthDate: formattedBirthDate,
          password,
        };

        // Cria usuário via API
        await createUser(creationPayload);

        // Se usuário criado NÃO está logado, faz login com as credenciais criadas
        if (!loggedUser) {
          await signInWithEmailAndPassword(auth, userData.email, password);
          toast.success("Conta criada e login efetuado com sucesso!");
        } else {
          toast.success("Usuário criado com sucesso!");
        }

        navigate("/dashboard");
        reset();
      }
    } catch (error: any) {
      console.error("❌ Erro ao salvar os dados:", error);
      toast.error(error.message + "\nErro ao salvar os dados.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="min-h-screen-minus-header-and-footer max-w-7xl mx-auto w-full relative">Carregando dados...</div>;

  console.log("✅ Formulário foi renderizado e está pronto para submissão!");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-2 bg-white p-8 rounded-xl">

        <div className='flex gap-2 mt-3 flex-grow flex-wrap md:flex-nowrap'>
          {/* Nome */}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <div className='w-full'>
                <label className="font-medium" htmlFor="name">Nome:</label>
                <CustomInput
                  {...field}
                  id="name"
                  placeholder="Nome completo"
                  disabled={!isEditable}
                  error={fieldState.error?.message}
                />
              </div>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <div className='w-full md:w-1/2'>
                <label className="font-medium" htmlFor="email">Email:</label>
                <CustomInput
                  {...field}
                  id="email"
                  type="email"
                  readOnly={!!docId} // No modo de edição o email não será editável, no modo de criação é editável normalmente
                  className={!!docId ? "bg-gray-100 cursor-not-allowed" : ""}
                  placeholder="email@exemplo.com"
                  error={fieldState.error?.message}
                />
              </div>
            )}
          />

          {/* CPF */}
          <Controller
            name="cpf"
            control={control}
            render={({ field, fieldState }) => (
              <div className='w-full md:w-1/2'>
                <label className="font-medium" htmlFor="cpf">CPF:</label>
                <CustomInput
                  {...field}
                  id="cpf"
                  placeholder="000.000.000-00"
                  disabled={!!docId && !isEditable}
                  error={fieldState.error?.message}
                />
              </div>
            )}
          />
        </div>

        <div className='flex flex-wrap gap-3'>
          {/* Data Nascimento */}
          <Controller
            name="birthDate"
            control={control}
            render={({ field, fieldState }) => (
              <div className='w-full md:w-1/3 mt-3 flex flex-col'>
                <label className="font-medium" htmlFor="birthDate">Data de Nascimento:</label>
                <CustomInput
                  {...field}
                  id="birthDate"
                  type="date"
                  // value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                  value={field.value && !isNaN(new Date(field.value).getTime()) ? new Date(field.value).toISOString().split("T")[0] : ""}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  disabled={!!docId && !isEditable}
                  error={fieldState.error?.message}
                />
              </div>
            )}
          />

          {/* Gênero */}
          <Controller
            name="gender"
            control={control}
            render={({ field, fieldState }) => (
              <div className='w-full md:w-1/3 mt-3 flex flex-col'>
                <label className='font-medium' htmlFor='gender'>Gênero:</label>
                <div className='relative mt-1'>
                  <select {...field} id="gender" className={`w-full border-2 h-10 p-2 rounded ${fieldState.error ? 'border-red-500' : 'border-gray-300'}`}>
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                  {fieldState.error && <p className='text-red-500 text-sm mt-1 absolute'>{fieldState.error.message}</p>}
                </div>
              </div>
            )}
          />

          {/* Telefone */}
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <div className='w-full sm:flex-1 mt-3'>
                <label className="font-medium" htmlFor="phone">Telefone:</label>
                <CustomInput
                  {...field}
                  id="phone"
                  type='text'
                  placeholder="(00) 00000-0000"
                  disabled={!!docId && !isEditable}
                  error={fieldState.error?.message}
                  maxLength={15}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    field.onChange(formatted); // envia o valor formatado para o RHF
                  }}
                />
              </div>
            )}
          />

        </div>

        <div className='flex flex-wrap gap-3'>
          {/* Senha */}
          {!docId && (
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <div className='w-full sm:flex-1 mt-3'>
                  <label className="font-medium" htmlFor="password">Senha:</label>
                  <CustomInput
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Senha"
                    error={fieldState.error?.message}
                  />
                </div>
              )}
            />
          )}

          {/* Confirm Password */}
          {!docId && (
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <div className='w-full sm:flex-1 mt-3'>
                  <label className="font-medium" htmlFor="confirmPassword">Confirmar Senha:</label>
                  <CustomInput
                    {...field}
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirmar Senha"
                    error={fieldState.error?.message}
                  />
                </div>
              )}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-4 px-4 py-2 rounded-md transition"
        >
          {docId ? "Atualizar" : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
