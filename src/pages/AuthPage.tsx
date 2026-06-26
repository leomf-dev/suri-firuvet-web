import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm, RegisterForm } from "@components/auth";
import type { RegisterFormData } from "@appTypes";
import { LoadingOverlay } from "@components/common";
import { useAuth } from "@auth/index";
import MascotasLoginImg from "@assets/MASCOTAS_login.png";

// ponytail: map Firebase error codes to Spanish messages
function firebaseErrorMsg(e: unknown): string {
  const msg = e instanceof Error ? e.message : "";
  if (msg.includes("email-already-in-use")) return "Este correo ya tiene una cuenta. Intenta iniciar sesión.";
  if (msg.includes("invalid-credential") || msg.includes("wrong-password")) return "Correo o contraseña incorrectos.";
  if (msg.includes("user-not-found")) return "No existe una cuenta con este correo.";
  if (msg.includes("weak-password")) return "La contraseña debe tener al menos 6 caracteres.";
  if (msg.includes("invalid-email")) return "El correo electrónico no es válido.";
  if (msg.includes("too-many-requests")) return "Demasiados intentos. Espera un momento e intenta de nuevo.";
  return msg || "Ocurrió un error inesperado.";
}

type AuthView = "login" | "register";

function AuthPage() {
  const [view, setView] = useState<AuthView>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, loginWithGoogle, register, resetPassword, user, cliente, isAdmin } = useAuth();

  // Redirigir según rol una vez que cliente se resuelve tras login
  useEffect(() => {
    if (user && cliente) {
      navigate(isAdmin ? "/admin" : "/inicio", { replace: true });
    }
  }, [user, cliente, isAdmin]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      // La redirección la maneja el useEffect de abajo cuando cliente/isAdmin se resuelven
    } catch (e) {
      setError(firebaseErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    setError("");
    try {
      await register(data);
      navigate("/inicio");
    } catch (e) {
      setError(firebaseErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    // ponytail: simplified — uses a prompt for email, could be a modal later
    const email = prompt("Ingresa tu correo electrónico:");
    if (!email) return;
    try {
      await resetPassword(email);
      alert("Se envió un correo para restablecer tu contraseña.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al enviar correo";
      setError(msg);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      navigate("/inicio");
    } catch (e) {
      setError(firebaseErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#f0f5f4]">
      {loading && <LoadingOverlay fullScreen message="Procesando..." />}

      {/* Fondo decorativo — SVG blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#f0f5f4]" />

        <svg className="absolute top-0 right-0 w-[70%] h-[75%]" viewBox="0 0 800 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#2db5a3" d="M300,0 L800,0 L800,600 L500,600 Q250,580,200,400 Q150,250,250,150 Q350,50,300,0Z" />
        </svg>

        <svg className="absolute bottom-0 right-0 h-screen" viewBox="0 0 1100 797" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#e8735a" d="M 961 -1 L 1100 0 L 1100 797 L 602 796 Q 108 818 113 522 Q 156 343 324 340 Q 536 316 736 196 Z" />
        </svg>

        <svg className="absolute -bottom-20 -left-35 w-[45%] h-[90%]" viewBox="0 0 900 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#2db5a3" d="M 865 748 L 842 780 L 468 781 L 190 779 Q 95 683 183 553 Q 304 430 507 456 Q 779 510 871 690 Z"/>
        </svg>

        <img src={MascotasLoginImg} alt="" className="absolute bottom-0 left-10 w-[25%] h-[40%]"/>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-1 flex-col lg:flex-row">

        {/* Panel izquierdo — Texto hero */}
        <div className="hidden lg:flex lg:w-1/2 flex-col mt-25 p-16">
          <h1 className="text-7xl font-bold leading-tight mb-4">
            <span className="text-[#e8735a]">HOLA,</span>
            <br />
            <span className="text-[#2db5a3]">BIENVENIDO</span>
          </h1>
          <p className="text-3xl text-gray-500 mt-2">
            Cuidamos de ellos como tú lo haces.
          </p>
          <p className="text-xl text-gray-500 mt-1">
            Conéctate, comparte y descubre un espacio<br />hecho para ti y tu mascota.
          </p>
        </div>

        {/* Panel derecho — Formulario */}
        <div className="flex-1 flex items-center justify-center p-6">
          {view === "login" && (
            <LoginForm
              onSubmit={handleLogin}
              onGoogleLogin={handleGoogleLogin}
              onSwitchToRegister={() => { setView("register"); setError(""); }}
              onForgotPassword={handleForgotPassword}
              error={error}
            />
          )}
          {view === "register" && (
            <RegisterForm
              onSubmit={handleRegister}
              onSwitchToLogin={() => { setView("login"); setError(""); }}
              error={error}
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default AuthPage;
