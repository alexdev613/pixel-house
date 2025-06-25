const BASE_URL = "http://localhost:3333";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  cpf: string;
  birthDate: string;
  gender: string;
  phone: string;
}) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Erro ao criar usuário");
  }

  return res.json();
}
