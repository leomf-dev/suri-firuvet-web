# Documento de Diseño Técnico: Completar Funcionalidad Core

## Resumen

Diseño técnico para integrar autenticación Firebase, protección de rutas, contexto de usuario, servicios REST/SOAP y unificación de tipos en la aplicación Suri Firuvet Web. Se reutilizan archivos existentes al máximo — solo se crean archivos nuevos cuando no existe un lugar lógico en la estructura actual.

## Principios de Diseño

- **Reutilizar antes de crear**: Los archivos existentes se modifican, no se duplican.
- **80% REST, 20% SOAP**: REST para operaciones primarias (clientes CRUD, mascotas list/get/update/delete, citas CRUD). SOAP para catálogos y registro de mascota.
- **Zero dependencias nuevas**: Firebase ya está instalado. El cliente SOAP se implementa con `fetch` + `DOMParser` nativo del navegador.
- **Mínimo código**: Un solo archivo por capa lógica. Sin abstracciones prematuras.

---

## Archivos a Modificar (existentes)

| Archivo | Cambio |
|---------|--------|
| `src/@types/index.ts` | Reescribir con tipos unificados alineados a las respuestas reales de REST y SOAP |
| `src/@types/database.ts` | ELIMINAR contenido, re-exportar desde index.ts o eliminar archivo |
| `src/@types/models.ts` | ELIMINAR contenido, re-exportar desde index.ts o eliminar archivo |
| `src/auth/index.ts` | Exportar AuthContext, AuthProvider, useAuth hook |
| `src/auth/ProtectedRoute.tsx` | Implementar componente guardia |
| `src/auth/firebase.config.ts` | Agregar export de `auth` (getAuth) |
| `src/api/index.ts` | Exportar servicios REST |
| `src/services/index.ts` | Reemplazar mocks por cliente SOAP + funciones de servicio SOAP |
| `src/hooks/index.ts` | Exportar hooks utilitarios si se necesitan |
| `src/routers/routes.tsx` | Envolver rutas protegidas con ProtectedRoute |
| `src/pages/AuthPage.tsx` | Conectar a AuthContext (login/register reales) |
| `src/pages/InicioPage.tsx` | Usar datos reales del cliente logueado |
| `src/pages/MascotasPage.tsx` | Usar servicios REST + SOAP en lugar de mocks |
| `src/pages/CitasPage.tsx` | Usar servicios REST en lugar de mocks |
| `src/pages/ClinicasPage.tsx` | Cargar clínicas desde SOAP |
| `src/components/auth/LoginForm.tsx` | Fix HTML inválido (th, a) |
| `src/components/layout/layout.tsx` | Envolver con AuthProvider |

## Archivos Nuevos (mínimos)

| Archivo | Justificación |
|---------|---------------|
| `src/api/soap.ts` | Cliente SOAP ligero (no existe equivalente) |

---

## Diseño por Componente

### 1. Tipos Unificados (`src/@types/index.ts`)

```typescript
// Entidades — alineadas a respuestas reales de las APIs
export interface Cliente {
  id: number;
  nombCli: string;
  apeCli: string;
  fecNac: string; // dd/MM/yyyy
  uid: string;
}

export interface Mascota {
  id: number;
  nombMas: string;
  idTipoMascota: number;
  nombreTipo: string;
  idCliente: number;
  apodos?: string;
  alergias?: string;
}

export interface Cita {
  idCita: number;
  nombreTipoCita: string;
  fecha: string; // ISO 8601
  comentario: string;
  idMascota: number;
  nombreMascota: string;
  idCliente: number;
  nombreCliente: string;
  idClinica: number;
  nombreClinica: string;
}

export interface Clinica {
  id: number;
  nombre: string;
  direccion: string;
}

export interface TipoMascota {
  id: number;
  nombre: string;
}

export interface TipoCita {
  id: number;
  nombre: string;
}

// Form data
export interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  fecNac?: string;
}

export interface MascotaFormData {
  nombMas: string;
  idTipoMascota: number;
  idCliente: number;
  apodos?: string;
  alergias?: string;
}

export interface CitaFormData {
  idTipoCita: number;
  fecha: string; // ISO 8601
  comentario: string;
  idMascota: number;
  idCliente: number;
  idClinica: number;
}

// Re-export http types
export type { RequestOptions, ApiErrorResponse, HttpClient } from './https.types';
```

`database.ts` y `models.ts` se vacían y re-exportan desde `index.ts` para no romper imports existentes temporalmente (luego se eliminan).

---

### 2. Firebase Auth Setup (`src/auth/firebase.config.ts`)

Agregar export de la instancia `auth`:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = { /* ...existing... */ };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

---

### 3. AuthContext (`src/auth/index.ts`)

```typescript
// Exporta: AuthProvider, useAuth, AuthContext
// AuthProvider envuelve la app y escucha onAuthStateChanged
// Cuando detecta usuario, busca cliente por uid via GET /api/clientes (filtra en frontend por uid match)
// Expone: { user, cliente, idCliente, loading, login, register, logout, resetPassword }
```

Flujo:
1. `onAuthStateChanged` detecta user → fetch `GET /api/clientes` → find by `uid === user.uid`
2. Si no encuentra (primer login después de registro), ya fue creado en el registro
3. `login(email, pw)` → `signInWithEmailAndPassword` → onAuthStateChanged se encarga del resto
4. `register(data)` → `createUserWithEmailAndPassword` → `POST /api/clientes` con uid → set cliente
5. `logout()` → `signOut` → state se limpia en onAuthStateChanged

---

### 4. ProtectedRoute (`src/auth/ProtectedRoute.tsx`)

```typescript
// Si loading → <LoadingOverlay />
// Si !user → <Navigate to="/login" />
// Si user → <Outlet />
```

---

### 5. Rutas (`src/routers/routes.tsx`)

```typescript
// Cambio: envolver grupo de rutas protegidas con ProtectedRoute
{
  element: <ProtectedRoute />,  // reemplaza <Layout /> como padre
  children: [
    {
      element: <Layout />,
      children: [
        { path: "/inicio", element: <InicioPage /> },
        { path: "/citas", element: <CitasPage /> },
        // ...
      ]
    }
  ]
}

// Agregar redirect: /login cuando autenticado → /inicio
```

---

### 6. Servicios REST (`src/api/index.ts`)

Usa el `api` existente de `http.ts`:

```typescript
import { api } from "./http";
import type { Cliente, Mascota, Cita } from "@appTypes";

// Clientes
export const clienteService = {
  getAll: () => api.get<Cliente[]>("/api/clientes"),
  getById: (id: number) => api.get<Cliente>(`/api/clientes/${id}`),
  create: (data: Omit<Cliente, 'id'>) => api.post<Cliente>("/api/clientes", data),
  update: (id: number, data: Partial<Cliente>) => api.put<Cliente>(`/api/clientes/${id}`, data),
};

// Mascotas (list, get, update, delete — create va por SOAP)
export const mascotaService = {
  getByCliente: (idCliente: number) => api.get<Mascota[]>("/api/mascotas", { idCliente: String(idCliente) }),
  getById: (id: number) => api.get<Mascota>(`/api/mascotas/${id}`),
  update: (id: number, data: any) => api.put<Mascota>(`/api/mascotas/${id}`, data),
  delete: (id: number, idCliente: number) => api.delete<void>(`/api/mascotas/${id}?idCliente=${idCliente}`),
};

// Citas (CRUD completo)
export const citaService = {
  getByCliente: (idCliente: number) => api.get<Cita[]>("/api/citas", { idCliente: String(idCliente) }),
  getById: (id: number) => api.get<Cita>(`/api/citas/${id}`),
  create: (data: CitaFormData) => api.post<Cita>("/api/citas", data),
  update: (id: number, data: CitaFormData) => api.put<void>(`/api/citas/${id}`, data),
  delete: (id: number, idCliente: number) => api.delete<void>(`/api/citas/${id}?idCliente=${idCliente}`),
};
```

---

### 7. Cliente SOAP (`src/api/soap.ts`) — ARCHIVO NUEVO

Un módulo ligero (~60 líneas) que:
1. Construye un SOAP envelope XML con la operación y parámetros
2. Hace `fetch(POST)` al endpoint con `Content-Type: text/xml`
3. Parsea la respuesta XML con `DOMParser` nativo del browser
4. Extrae los elementos del body y los mapea a arrays/objetos

```typescript
const SOAP_URL = import.meta.env.VITE_URL_BASE_SOAP;

async function soapCall<T>(endpoint: string, operation: string, params?: Record<string, string | number>): Promise<T> {
  // Construye envelope, fetch, parse XML, retorna data
}
```

---

### 8. Servicios SOAP (`src/services/index.ts`)

Reemplaza los mocks actuales por funciones que usan el cliente SOAP:

```typescript
import { soapCall } from "@api/soap";
import type { TipoMascota, TipoCita, Clinica, Mascota } from "@appTypes";

export const catalogoService = {
  getTiposMascota: () => soapCall<TipoMascota[]>("/soap/catalogos", "ObtenerTiposMascota"),
  getTiposCita: () => soapCall<TipoCita[]>("/soap/catalogos", "ObtenerTiposCita"),
  getClinicas: () => soapCall<Clinica[]>("/soap/catalogos", "ObtenerClinicas"),
};

export const mascotaSoapService = {
  registrar: (data: MascotaFormData) => soapCall<Mascota | null>("/soap/mascotas", "RegistrarMascota", {
    nombMas: data.nombMas,
    idTipoMascota: data.idTipoMascota,
    idCliente: data.idCliente,
    apodos: data.apodos ?? "",
    alergias: data.alergias ?? "",
  }),
};
```

---

### 9. Layout con AuthProvider (`src/components/layout/layout.tsx`)

No se modifica el layout directamente. El `AuthProvider` se agrega en el nivel de rutas o en `main.tsx`:

```typescript
// main.tsx — envolver RouterProvider con AuthProvider
<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>
```

---

### 10. Páginas — Patrón de integración

Todas las páginas siguen el mismo patrón:

```typescript
function MascotasPage() {
  const { idCliente } = useAuth();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!idCliente) return;
    mascotaService.getByCliente(idCliente)
      .then(setMascotas)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [idCliente]);

  if (loading) return <LoadingOverlay />;
  if (error) return <ErrorMessage message={error} />;
  if (!mascotas.length) return <EmptyState />;
  // ... render
}
```

---

## Diagrama de Dependencias

```
main.tsx
  └─ AuthProvider (src/auth/index.ts)
       └─ RouterProvider
            ├─ /login → AuthPage (usa useAuth para login/register)
            └─ ProtectedRoute (src/auth/ProtectedRoute.tsx)
                 └─ Layout
                      ├─ /inicio → InicioPage (usa useAuth + servicios REST)
                      ├─ /citas → CitasPage (usa citaService REST)
                      ├─ /mascotas → MascotasPage (usa mascotaService REST + mascotaSoapService SOAP)
                      └─ /clinicas → ClinicasPage (usa catalogoService SOAP)
```

---

## Decisiones de Diseño

1. **Sin librería SOAP**: `DOMParser` es nativo y suficiente para parsear las respuestas XML simples del WSDL.
2. **Búsqueda de cliente por uid**: La API no tiene `GET /api/clientes?uid=X`, así que se hace `GET /api/clientes` y se filtra en frontend. Si la lista crece, se puede agregar el endpoint luego.
3. **AuthProvider en main.tsx**: Envuelve todo para que tanto las rutas públicas como protegidas tengan acceso al estado de auth.
4. **database.ts y models.ts vacíos**: Se vacían en lugar de eliminar para no romper imports de golpe; los imports se actualizan a `@appTypes` en las tareas de integración.
5. **Un solo archivo nuevo (soap.ts)**: Todo lo demás se implementa en archivos existentes.

---

## Seguridad

- Firebase Auth tokens no se envían a la API REST (la API usa idCliente interno, no uid en headers)
- Las credenciales de Firebase están en variables de entorno (ya configurado)
- El ownership de mascotas/citas se valida en el backend via idCliente en query params
- No se almacenan contraseñas localmente — Firebase maneja todo el ciclo de auth
