# Tareas de Implementación

## Task 1: Unificar tipos en src/@types/index.ts [REQ-6]

- [x] Rewrite `src/@types/index.ts` with unified interfaces matching real API responses (Cliente, Mascota, Cita, Clinica, TipoMascota, TipoCita) plus form data types (RegisterFormData, MascotaFormData, CitaFormData)
- [x] Replace content of `src/@types/database.ts` with `export * from './index'` to maintain backward compatibility
- [x] Replace content of `src/@types/models.ts` with `export * from './index'` to maintain backward compatibility
- [x] Keep `src/@types/https.types.ts` unchanged (re-exported from index.ts)
- [x] Merge RegisterFormData into index.ts and update `src/@types/Login.ts` to re-export

## Task 2: Setup Firebase Auth export [REQ-1]

- [x] Modify `src/auth/firebase.config.ts` to add `getAuth` import and export the `auth` instance

## Task 3: Implementar AuthContext y useAuth [REQ-1, REQ-3]

Depends on: Task 1, Task 2

- [x] Implement AuthProvider, AuthContext, and useAuth hook in `src/auth/index.ts`
- [x] AuthProvider subscribes to `onAuthStateChanged`, fetches cliente by uid from REST API
- [x] Exposes: user (Firebase), cliente (API), idCliente, loading, login, register, logout, resetPassword functions
- [x] login calls signInWithEmailAndPassword
- [x] register calls createUserWithEmailAndPassword + POST /api/clientes
- [x] logout calls signOut
- [x] resetPassword calls sendPasswordResetEmail

## Task 4: Implementar ProtectedRoute [REQ-2]

Depends on: Task 3

- [x] Implement `src/auth/ProtectedRoute.tsx` using useAuth hook
- [x] If loading → render LoadingOverlay (existing component)
- [x] If no user → Navigate to /login
- [x] If user → render Outlet

## Task 5: Actualizar rutas con protección [REQ-2]

Depends on: Task 4

- [x] Modify `src/routers/routes.tsx` to wrap protected routes with ProtectedRoute
- [x] Add redirect from /login to /inicio when user is authenticated
- [x] Wrap main.tsx RouterProvider with AuthProvider

## Task 6: Implementar servicios REST [REQ-4]

Depends on: Task 1

- [x] Rewrite `src/api/index.ts` with typed service objects: clienteService, mascotaService, citaService
- [x] Use existing `api` from `./http.ts` as base
- [x] clienteService: getAll, getById, create, update
- [x] mascotaService: getByCliente, getById, update, delete (create goes via SOAP)
- [x] citaService: getByCliente, getById, create, update, delete

## Task 7: Implementar cliente SOAP y servicios SOAP [REQ-5]

Depends on: Task 1

- [x] Create `src/api/soap.ts` — lightweight SOAP client using fetch + DOMParser
- [x] Build XML envelope, POST to SOAP endpoint, parse XML response to JS objects
- [x] Use VITE_URL_BASE_SOAP as base URL
- [x] Rewrite `src/services/index.ts` with: catalogoService (getTiposMascota, getTiposCita, getClinicas) and mascotaSoapService (registrar)

## Task 8: Corregir bugs de HTML y código [REQ-7]

- [x] Fix LoginForm.tsx: remove `<th/>` inside `<p>`, fix orphan `<a>` tag
- [x] Fix AuthPage.tsx: replace hardcoded `src\assets\MASCOTAS_login.png` with a proper static import
- [x] Remove console.log placeholders from AuthPage.tsx, MascotasPage.tsx, CitasPage.tsx

## Task 9: Integrar AuthPage con AuthContext [REQ-1, REQ-8]

Depends on: Task 3, Task 5, Task 6, Task 8

- [x] Modify `src/pages/AuthPage.tsx` to use useAuth() for login and register
- [x] handleLogin → call auth context login function
- [x] handleRegister → call auth context register function
- [x] handleForgotPassword → call auth context resetPassword function
- [x] Remove all TODO comments and console.logs

## Task 10: Integrar MascotasPage con servicios reales [REQ-8]

Depends on: Task 3, Task 6, Task 7

- [x] Modify `src/pages/MascotasPage.tsx` to use useAuth() for idCliente
- [x] Load mascotas via mascotaService.getByCliente(idCliente) from REST
- [x] Load tipos mascota via catalogoService.getTiposMascota() from SOAP
- [x] Register new mascota via mascotaSoapService.registrar() from SOAP
- [x] Update/delete via mascotaService from REST
- [x] Remove all mock data imports and fallbacks
- [x] Show LoadingOverlay while loading, ErrorMessage on error, EmptyState when empty

## Task 11: Integrar CitasPage con servicios reales [REQ-8]

Depends on: Task 3, Task 6, Task 7

- [-] Modify `src/pages/CitasPage.tsx` to use useAuth() for idCliente
- [~] Load citas via citaService.getByCliente(idCliente) from REST
- [~] Load tipos cita via catalogoService.getTiposCita() from SOAP
- [~] Load clínicas via catalogoService.getClinicas() from SOAP
- [~] Load mascotas via mascotaService.getByCliente(idCliente) for combo in form
- [~] Create/update/delete citas via citaService from REST
- [~] Remove all mock data and local type definitions
- [~] Show LoadingOverlay, ErrorMessage, EmptyState as needed

## Task 12: Integrar InicioPage con datos reales [REQ-8]

Depends on: Task 3, Task 6, Task 7

- [x] Modify `src/pages/InicioPage.tsx` to use useAuth() for idCliente and cliente name
- [~] Load mascotas count and citas from REST services
- [~] Load clínicas count from SOAP service
- [~] Replace hardcoded stats with real API data
- [~] Show user name in greeting (from AuthContext cliente)
- [~] Remove all mock data imports

## Task 13: Integrar ClinicasPage con SOAP [REQ-8]

Depends on: Task 7

- [~] Modify `src/pages/ClinicasPage.tsx` to load clínicas from catalogoService.getClinicas() via SOAP
- [~] Show LoadingOverlay while loading, ErrorMessage on error
- [~] Display clinicas list with nombre and direccion

## Task 14: Limpieza final — eliminar mocks y archivos muertos [REQ-6]

Depends on: Task 9, Task 10, Task 11, Task 12, Task 13

- [~] Remove mock data constants from `src/@types/database.ts` (TIPOS_MASCOTA, TIPOS_CITA, CLINICAS, CLIENTES, MASCOTAS_MOCK, CITAS_MOCK)
- [~] If database.ts and models.ts only contain re-exports, verify no other file imports from them directly, then simplify
- [~] Remove `src/services/index.ts` old mock data (clientes, mascotas, citas, etc.) — should already be replaced by SOAP services
- [~] Verify build compiles cleanly with `tsc && vite build`
