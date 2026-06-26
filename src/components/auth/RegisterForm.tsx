import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Calendar } from "lucide-react";
import { Button, Input, Label, Spinner } from "@components/ui";
import { ErrorMessage } from "@components/common/ErrorMessage";
import type { RegisterFormData } from "@appTypes";

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  onSwitchToLogin: () => void;
  loading?: boolean;
  error?: string;
}

function RegisterForm({
  onSubmit,
  onSwitchToLogin,
  loading = false,
  error,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    fecNac: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-center text-lg font-bold text-gray-800 mb-6 tracking-wide">
        CREA TU CUENTA
      </h2>

      {error && <ErrorMessage message={error} className="mb-4" />}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-nombre" className="sr-only">Nombre</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              id="reg-nombre"
              type="text"
              name="nombre"
              placeholder="NOMBRE"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="pl-10"
            />
          </div>
        </div>

        {/* Apellido */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-apellido" className="sr-only">Apellido</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              id="reg-apellido"
              type="text"
              name="apellido"
              placeholder="APELLIDO"
              value={formData.apellido}
              onChange={handleChange}
              required
              className="pl-10"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-email" className="sr-only">Correo electrónico</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              id="reg-email"
              type="email"
              name="email"
              placeholder="CORREO ELECTRÓNICO"
              value={formData.email}
              onChange={handleChange}
              required
              className="pl-10"
            />
          </div>
        </div>

        {/* Fecha nacimiento */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-fecnac" className="sr-only">Fecha de nacimiento</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              id="reg-fecnac"
              type="date"
              name="fecNac"
              value={formData.fecNac}
              onChange={handleChange}
              required
              className="pl-10"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="reg-password" className="sr-only">Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="CONTRASEÑA"
              value={formData.password}
              onChange={handleChange}
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

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 rounded-full"
        >
          {loading ? <Spinner size="sm" className="text-white" /> : "CREAR CUENTA"}
        </Button>

        {/* Separator */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-400">O</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Switch to login */}
        <Button
          type="button"
          variant="outline"
          onClick={onSwitchToLogin}
          className="w-full py-3 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-full"
        >
          YA TENGO CUENTA
        </Button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4">
        Al continuar aceptas nuestros{" "}
        <a href="#" className="text-teal-600 font-medium underline">
          Términos y condiciones
        </a>
      </p>
    </div>
  );
}

export default RegisterForm;
