import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase.config";
import { clienteService } from "@services/index";
import type { Cliente, RegisterFormData } from "@appTypes";

const googleProvider = new GoogleAuthProvider();

interface AuthContextType {
  user: User | null;
  cliente: Cliente | null;
  idCliente: number | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const CLIENTE_SESSION_KEY = "suri_cliente";

function saveClienteSession(c: Cliente) {
  sessionStorage.setItem(CLIENTE_SESSION_KEY, JSON.stringify(c));
}

function loadClienteSession(): Cliente | null {
  try {
    const raw = sessionStorage.getItem(CLIENTE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cliente;
    // Invalidar sesiones antiguas sin idRol
    if (parsed.idRol === undefined) {
      sessionStorage.removeItem(CLIENTE_SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function clearClienteSession() {
  sessionStorage.removeItem(CLIENTE_SESSION_KEY);
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // ponytail: seed from sessionStorage so UI isn't blank while API wakes up (Render free cold start)
  const [cliente, setClienteState] = useState<Cliente | null>(loadClienteSession);
  const [loading, setLoading] = useState(true);

  const setCliente = (c: Cliente | null) => {
    setClienteState(c);
    if (c) saveClienteSession(c);
    else clearClienteSession();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // ponytail: no filter-by-uid endpoint exists, O(n) scan over all clients
          const clientes = await clienteService.getAll();
          const found = clientes.find((c) => c.uid === firebaseUser.uid) ?? null;
          setCliente(found);
        } catch {
          // API unavailable — keep sessionStorage value if present
        }
      } else {
        setCliente(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const credential = await signInWithPopup(auth, googleProvider);
    const firebaseUser = credential.user;
    // ponytail: check if client already exists, create if first Google login
    try {
      const clientes = await clienteService.getAll();
      const existing = clientes.find((c) => c.uid === firebaseUser.uid);
      if (!existing) {
        const displayName = firebaseUser.displayName ?? "";
        const [nombre, ...apellidoParts] = displayName.split(" ");
        const newCliente = await clienteService.create({
          nombCli: nombre ?? "",
          apeCli: apellidoParts.join(" ") || "",
          fecNac: "",
          uid: firebaseUser.uid,
        });
        setCliente(newCliente);
      }
    } catch {
      // onAuthStateChanged will handle client lookup on next cycle
    }
  };

  const register = async (data: RegisterFormData) => {
    const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const uid = credential.user.uid;
    // ponytail: API expects dd/MM/yyyy, HTML date input gives yyyy-MM-dd
    const fecNac = data.fecNac ? data.fecNac.split("-").reverse().join("/") : "";

    // Create client in REST API
    await clienteService.create({
      nombCli: data.nombre,
      apeCli: data.apellido,
      fecNac,
      uid,
      idRol: 1, // siempre usuario al registrarse
    });

    // Re-fetch after creation to avoid race condition with onAuthStateChanged
    // (listener may fire before the client exists in the API)
    const clientes = await clienteService.getAll();
    const found = clientes.find((c) => c.uid === uid) ?? null;
    setCliente(found);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value: AuthContextType = {
    user,
    cliente,
    idCliente: cliente?.id ?? null,
    isAdmin: cliente?.idRol === 2,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext };
