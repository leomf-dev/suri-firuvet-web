import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button, Input, Label ,Spinner} from "@components/ui";
import { ErrorMessage } from "@components/common";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onGoogleLogin?: () => void;
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
  loading?: boolean;
  error?: string;
}

function LoginForm({
  onSubmit,
  onGoogleLogin,
  onSwitchToRegister,
  onForgotPassword,
  loading = false,
  error,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-center text-lg font-bold text-gray-800 mb-6 tracking-wide">
        INICIA SESIÓN EN TU CUENTA
      </h2>

      {error && <ErrorMessage message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="sr-only">
            Correo electrónico
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              id="login-email"
              type="email"
              placeholder="CORREO ELECTRÓNICO"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="login-password" className="sr-only">
            Contraseña
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="CONTRASEÑA"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        {onForgotPassword && (
          <div className="text-right">
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={onForgotPassword}
              className="text-xs text-teal-600 p-0 h-auto"
            >
              ¿OLVIDASTE TU CONTRASEÑA?
            </Button>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 rounded-full"
        >
          {loading ? <Spinner size="sm" className="text-white" /> : "INICIAR SESIÓN"}
        </Button>

        {/* Separator */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-400">O</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google Sign In */}
        {onGoogleLogin && (
          <Button
            type="button"
            variant="outline"
            onClick={onGoogleLogin}
            disabled={loading}
            className="w-full py-3 border border-gray-300 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <svg className="size-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            CONTINUAR CON GOOGLE
          </Button>
        )}

        {/* Switch to register */}
        <Button
          type="button"
          variant="outline"
          onClick={onSwitchToRegister}
          className="w-full py-3 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-full"
        >
          REGISTRARSE
        </Button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4">
        Al continuar aceptas nuestros{" "}
        <a href="#" className="text-teal-600 font-medium underline">
          Términos y condiciones
        </a>
      </p>
      <p className="text-center text-xs text-gray-400 mt-2">
        &copy; 2018-2026 Inscode
      </p>
    </div>
  );
}

export default LoginForm;
