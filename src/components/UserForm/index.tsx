import { useEffect, useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { registerSchema } from "../../schemas/registerSchema";
import { z } from "zod";
import { CustomInput } from "../CustomInput";
import { formatPhoneNumber } from "../../utils/formatPhone";
import { createUser } from "../../services/api";

type UserFormData = z.infer<typeof registerSchema>;

interface UserFormProps {
  docId?: string;
}

export default function UserForm({ docId }: UserFormProps) {
  const { user: loggedUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(registerSchema),
    mode: "all",
  });

  useEffect(() => {
    async function loadUserData() {
      if (docId) {
        setLoading(true);
        const docRef = doc(db, "users", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data() as UserFormData;
          reset(userData);

          setIsEditable(loggedUser?.uid === docId);
        } else {
          toast.error("Usuário não encontrado.");
          reset();
          setIsEditable(false);
        }
        setLoading(false);
      } else {
        reset();
        setIsEditable(true);
      }
    }

    loadUserData();
  }, [docId, loggedUser, reset]);

  // async function onSubmit(data: UserFormData) {
  //   setLoading(true);
  //   try {
  //     // === EDIÇÃO DE USUÁRIO EXISTENTE ===
  //     if (docId) {
  //       if (!isEditable) {
  //         toast.error("Você não pode editar os dados deste usuário.");
  //         return;
  //       }

  //       const docRef = doc(db, "users", docId);
  //       const { password, confirmPassword, ...userData } = data; // remove senha

  //       await updateDoc(docRef, userData);
  //       toast.success("Dados atualizados com sucesso!");
  //     }

  //     // === CRIAÇÃO DE NOVO USUÁRIO ===
  //     else {
  //       // Cria usuário no Firebase Auth
  //       const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  //       const firebaseUser = userCredential.user;

  //       // Gera o próximo ID sequencial
  //       const usersSnapshot = await getDocs(collection(db, "users"));
  //       const maxId = usersSnapshot.docs.reduce((max, doc) => {
  //         const userData = doc.data();
  //         return userData.id && typeof userData.id === "number" && userData.id > max ? userData.id : max;
  //       }, 0);
  //       const nextId = maxId + 1;

  //       // Cria documento no Firestore
  //       await setDoc(doc(db, "users", firebaseUser.uid), {
  //         id: nextId,
  //         name: data.name,
  //         email: data.email,
  //         cpf: data.cpf,
  //         birthDate: data.birthDate,
  //         gender: data.gender,
  //         phone: data.phone,
  //         createdAt: serverTimestamp(),
  //       });

  //       toast.success("Usuário cadastrado com sucesso!");
  //       reset();
  //     }
  //   } catch (error) {
  //     console.error("Erro ao salvar os dados:", error);
  //     toast.error("Erro ao salvar os dados.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  async function onSubmit(data: UserFormData) {
    setLoading(true);
    try {
      // === EDIÇÃO DE USUÁRIO EXISTENTE ===
      if (docId) {
        if (!isEditable) {
          toast.error("Você não pode editar os dados deste usuário.");
          return;
        }

        const docRef = doc(db, "users", docId);
        const { password, confirmPassword, ...userData } = data;

        // Garante que birthDate seja string na edição também
        const payload = {
          ...userData,
          birthDate: data.birthDate instanceof Date
            ? data.birthDate.toISOString().split("T")[0]
            : data.birthDate,
        };

        await updateDoc(docRef, payload);
        toast.success("Dados atualizados com sucesso!");
      }

      // === CRIAÇÃO DE NOVO USUÁRIO ===
      else {
        const { confirmPassword, ...userData } = data;

        const payload = {
          ...userData,
          birthDate: data.birthDate instanceof Date
            ? data.birthDate.toISOString().split("T")[0]
            : data.birthDate,
        };

        await createUser(payload);
        toast.success("Usuário cadastrado com sucesso!");
        reset();
      }
    } catch (error: any) {
      console.error("Erro ao salvar os dados:", error);
      toast.error(error.message || "Erro ao salvar os dados.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Carregando dados...</div>;

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
                  value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
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
