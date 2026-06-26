# Documento de Requisitos: Completar Funcionalidad Core

## Introducción

Este documento especifica los requisitos para completar la funcionalidad core de la aplicación web Suri Firuvet. Actualmente la aplicación tiene los componentes de UI construidos pero carece de autenticación real, protección de rutas, contexto de usuario, integración con los backends y tiene problemas de calidad de código (tipos duplicados, HTML inválido, datos mock dispersos).

La aplicación consumirá dos backends que comparten la misma base de datos PostgreSQL (Supabase):
- **API REST** (~80% de operaciones): CRUD de clientes, mascotas (listar/obtener/actualizar/eliminar), y CRUD completo de citas.
- **API SOAP** (~20% de operaciones): Catálogos de referencia (tipos de mascota, tipos de cita, clínicas) y registro de nuevas mascotas.

## Referencia de APIs

- REST: ver API_DOCS.md
- SOAP: ver README.md

## Glosario

- **Sistema**: La aplicación web Suri Firuvet (React 19 + Vite + TypeScript)
- **Firebase_Auth**: El servicio de autenticación de Firebase utilizado para gestionar credenciales de usuario
- **API_REST**: Servidor REST en `VITE_URL_BASE` (https://suri-firuvet-ios-damii-api.onrender.com)
- **API_SOAP**: Servidor SOAP en `VITE_URL_BASE_SOAP` (https://suri-firuvet-api-soap.onrender.com)
- **AuthContext**: El contexto de React que provee estado de autenticación y datos del usuario a toda la aplicación
- **ProtectedRoute**: El componente guardia que restringe acceso a rutas que requieren autenticación
- **HTTP_Client**: El cliente HTTP basado en fetch existente en src/api/http.ts
- **SOAP_Client**: Módulo que construye envelopes SOAP XML y hace fetch POST al endpoint SOAP, parseando respuestas XML a objetos JS
- **Cliente**: La entidad usuario/dueño de mascotas (id, nombCli, apeCli, fecNac, uid)
- **Mascota**: La entidad mascota registrada (id, nombMas, idTipoMascota, nombreTipo, idCliente, apodos?, alergias?)
- **Cita**: La entidad cita veterinaria (idCita, nombreTipoCita, fecha, comentario, idMascota, nombreMascota, idCliente, nombreCliente, idClinica, nombreClinica)
- **Clinica**: La entidad clínica veterinaria (id, nombre, direccion)

## Requisitos

### Requisito 1: Autenticación con Firebase

**User Story:** Como usuario, quiero iniciar sesión, registrarme y recuperar mi contraseña usando mi correo electrónico, para poder acceder de forma segura a mis datos en la aplicación.

#### Criterios de Aceptación

1. WHEN un usuario envía credenciales válidas (email y contraseña) en el formulario de login, THE Sistema SHALL autenticar al usuario mediante Firebase_Auth, buscar el Cliente asociado en API_REST (`GET /api/clientes` filtrando por uid), almacenar el Cliente en AuthContext y redirigir a /inicio
2. WHEN un usuario envía credenciales inválidas en el formulario de login, THE Sistema SHALL mostrar un mensaje de error descriptivo en español sin redirigir
3. WHEN un usuario completa el formulario de registro con datos válidos, THE Sistema SHALL crear una cuenta en Firebase_Auth y luego registrar al Cliente via API_REST (`POST /api/clientes` con uid de Firebase, nombCli, apeCli, fecNac formato dd/MM/yyyy) y redirigir a /inicio
4. WHEN el API_REST retorna 409 en el registro (uid ya existe), THE Sistema SHALL mostrar un mensaje indicando que el usuario ya tiene cuenta
5. WHEN un usuario solicita recuperar su contraseña proporcionando su email, THE Sistema SHALL enviar un correo de restablecimiento mediante Firebase_Auth y mostrar un mensaje de confirmación
6. WHEN un usuario hace clic en "Cerrar sesión", THE Sistema SHALL cerrar la sesión en Firebase_Auth, limpiar el AuthContext y redirigir a /login
7. IF Firebase_Auth retorna un error durante cualquier operación de autenticación, THEN THE Sistema SHALL mostrar el mensaje de error traducido al español al usuario

### Requisito 2: Protección de Rutas

**User Story:** Como sistema, quiero restringir el acceso a las rutas del dashboard únicamente a usuarios autenticados, para proteger los datos y funcionalidades de la aplicación.

#### Criterios de Aceptación

1. WHEN un usuario no autenticado intenta acceder a una ruta protegida (/inicio, /citas, /mascotas, /clinicas), THE ProtectedRoute SHALL redirigir al usuario a /login
2. WHEN un usuario autenticado accede a una ruta protegida, THE ProtectedRoute SHALL renderizar el contenido de la ruta normalmente
3. WHILE el Sistema está verificando el estado de autenticación inicial, THE ProtectedRoute SHALL mostrar un indicador de carga (componente LoadingOverlay existente)
4. WHEN un usuario autenticado intenta acceder a /login, THE Sistema SHALL redirigir al usuario a /inicio

### Requisito 3: Contexto de Autenticación (AuthContext)

**User Story:** Como desarrollador, quiero un contexto centralizado de autenticación, para que todos los componentes puedan acceder al estado del usuario y las funciones de auth sin prop drilling.

#### Criterios de Aceptación

1. THE AuthContext SHALL proveer el estado del usuario actual: datos de Firebase_Auth (uid, email) y datos del Cliente de API_REST (id, nombCli, apeCli, fecNac)
2. THE AuthContext SHALL proveer funciones de login, registro, logout y recuperación de contraseña
3. WHEN la aplicación se inicia, THE AuthContext SHALL suscribirse al listener `onAuthStateChanged` de Firebase_Auth para detectar sesión persistida
4. WHILE el AuthContext está resolviendo el estado de autenticación inicial, THE AuthContext SHALL exponer `loading: true`
5. WHEN Firebase_Auth detecta un usuario autenticado, THE AuthContext SHALL obtener los datos del Cliente desde API_REST (buscando por uid en la lista de clientes) y exponer el `idCliente` para que las páginas lo usen en sus queries

### Requisito 4: Capa de Servicios — API REST (80%)

**User Story:** Como desarrollador, quiero funciones de servicio tipadas para las operaciones principales, para poder realizar CRUD contra el backend REST sin datos mock.

#### Criterios de Aceptación

1. THE Sistema SHALL proveer funciones de servicio REST para Mascotas: listar por idCliente (`GET /api/mascotas?idCliente={id}`), obtener por ID (`GET /api/mascotas/{id}`), actualizar (`PUT /api/mascotas/{id}`), eliminar (`DELETE /api/mascotas/{id}?idCliente={id}`)
2. THE Sistema SHALL proveer funciones de servicio REST para Citas: listar por idCliente (`GET /api/citas?idCliente={id}`), obtener por ID (`GET /api/citas/{id}`), crear (`POST /api/citas`), actualizar (`PUT /api/citas/{id}`), eliminar (`DELETE /api/citas/{id}?idCliente={id}`)
3. THE Sistema SHALL proveer funciones de servicio REST para Clientes: obtener por ID (`GET /api/clientes/{id}`), listar todos (`GET /api/clientes`), crear (`POST /api/clientes`), actualizar (`PUT /api/clientes/{id}`)
4. WHEN una función de servicio REST recibe un error (4xx/5xx), THE Sistema SHALL propagar el mensaje del campo `error` del body de respuesta
5. THE Sistema SHALL utilizar el HTTP_Client existente (`src/api/http.ts`) como base para todas las funciones REST

### Requisito 5: Capa de Servicios — API SOAP (20%)

**User Story:** Como desarrollador, quiero consumir los catálogos y el registro de mascotas desde el servicio SOAP, para distribuir la carga entre los dos backends.

#### Criterios de Aceptación

1. THE Sistema SHALL proveer un cliente SOAP ligero que construya envelopes XML, haga fetch POST al endpoint SOAP y parsee la respuesta XML a objetos JavaScript
2. THE Sistema SHALL proveer funciones de servicio SOAP para catálogos: `ObtenerTiposMascota` (endpoint `/soap/catalogos`), `ObtenerTiposCita` (endpoint `/soap/catalogos`), `ObtenerClinicas` (endpoint `/soap/catalogos`)
3. THE Sistema SHALL proveer una función de servicio SOAP para registrar mascota: `RegistrarMascota` (endpoint `/soap/mascotas`) con parámetros nombMas, idTipoMascota, idCliente, apodos, alergias
4. THE Sistema SHALL usar la variable de entorno `VITE_URL_BASE_SOAP` como base URL del servicio SOAP
5. WHEN el API_SOAP retorna una respuesta vacía o null en RegistrarMascota, THE Sistema SHALL interpretar que el cliente o tipo de mascota no existe y mostrar error apropiado

### Requisito 6: Unificación de Tipos

**User Story:** Como desarrollador, quiero una única fuente de verdad para las definiciones de tipos, para evitar inconsistencias y duplicación.

#### Criterios de Aceptación

1. THE Sistema SHALL definir interfaces alineadas con las respuestas reales de las APIs: `Cliente` (id, nombCli, apeCli, fecNac, uid), `Mascota` (id, nombMas, idTipoMascota, nombreTipo, idCliente, apodos?, alergias?), `Cita` (idCita, nombreTipoCita, fecha, comentario, idMascota, nombreMascota, idCliente, nombreCliente, idClinica, nombreClinica), `Clinica` (id, nombre, direccion), `TipoMascota` (id, nombre), `TipoCita` (id, nombre)
2. THE Sistema SHALL definir estos tipos en un único archivo (`src/@types/index.ts`) y eliminar las definiciones duplicadas de `database.ts` y `models.ts`
3. THE Sistema SHALL eliminar todos los datos mock estáticos (MASCOTAS_MOCK, CITAS_MOCK, CLIENTES, CLINICAS, etc.) una vez que los servicios API los reemplacen
4. THE Sistema SHALL definir tipos para los formularios: `CitaFormData`, `MascotaFormData`, `RegisterFormData`, `ClienteFormData`

### Requisito 7: Corrección de Bugs

**User Story:** Como usuario, quiero que la aplicación no tenga HTML inválido ni errores de código, para una experiencia correcta y accesible.

#### Criterios de Aceptación

1. THE Sistema SHALL corregir el HTML inválido en LoginForm.tsx eliminando el `<th/>` dentro del `<p>` y corrigiendo el enlace huérfano
2. THE Sistema SHALL reemplazar la ruta hardcodeada con backslash (`src\assets\MASCOTAS_login.png`) en AuthPage.tsx por un import estático del asset
3. THE Sistema SHALL eliminar los console.log dispersos usados como placeholder de funcionalidad (en AuthPage.tsx, MascotasPage.tsx, CitasPage.tsx)

### Requisito 8: Integración en Páginas

**User Story:** Como usuario, quiero que las páginas muestren datos reales de mis mascotas y citas, no datos ficticios.

#### Criterios de Aceptación

1. WHEN un usuario autenticado accede a /mascotas, THE Sistema SHALL cargar las mascotas del cliente logueado desde API_REST (`GET /api/mascotas?idCliente={id}`) y los tipos de mascota desde API_SOAP (`ObtenerTiposMascota`)
2. WHEN un usuario registra una nueva mascota, THE Sistema SHALL enviar la petición via API_SOAP (`RegistrarMascota`) y recargar la lista desde API_REST
3. WHEN un usuario autenticado accede a /citas, THE Sistema SHALL cargar las citas del cliente logueado desde API_REST (`GET /api/citas?idCliente={id}`)
4. WHEN un usuario crea, edita o elimina una cita, THE Sistema SHALL usar los endpoints REST correspondientes y actualizar la lista
5. WHEN un usuario accede a /inicio, THE Sistema SHALL mostrar estadísticas basadas en datos reales del cliente logueado (conteo de mascotas, citas)
6. WHEN un usuario accede a /clinicas, THE Sistema SHALL cargar las clínicas desde API_SOAP (`ObtenerClinicas`)
7. THE Sistema SHALL mostrar estados de carga y error usando los componentes existentes (LoadingOverlay, ErrorMessage, EmptyState)
