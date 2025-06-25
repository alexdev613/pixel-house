// backend-api/src/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa o Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

// === ROTA DE CRIAÇÃO DE USUÁRIO ===
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, password, cpf, birthDate, gender, phone } = req.body;

  try {
    // Cria usuário no Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Gera ID sequencial baseado no Firestore
    const usersSnapshot = await db.collection("users").get();
    const maxId = usersSnapshot.docs.reduce((max, doc) => {
      const data = doc.data();
      return data.id && typeof data.id === "number" && data.id > max ? data.id : max;
    }, 0);
    const nextId = maxId + 1;

    // Salva no Firestore
    await db.collection("users").doc(userRecord.uid).set({
      id: nextId,
      name,
      email,
      cpf,
      birthDate,
      gender,
      phone,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ error: "Erro ao criar usuário." });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});
