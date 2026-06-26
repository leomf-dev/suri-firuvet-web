# Suri Firuvet API — Documentación para el Frontend

**Base URL:** `https://suri-firuvet-ios-damii-api.onrender.com`  
**Content-Type:** `application/json`

---

## Catálogos

### `GET /api/tipos-cita`

**Respuesta `200`**
```json
[
  { "id": 1, "nombre": "Consulta General" },
  { "id": 2, "nombre": "Vacunación" }
]
```

---

### `GET /api/tipos-mascota`

**Respuesta `200`**
```json
[
  { "id": 1, "nombre": "Perro" },
  { "id": 2, "nombre": "Gato" }
]
```

---

## Clínicas

### `GET /api/clinicas`

**Respuesta `200`**
```json
[
  { "id": 1, "nombre": "Firuvet San Miguel", "direccion": "Av. La Marina 123" }
]
```

---

## Clientes

### `GET /api/clientes`

Lista todos los clientes.

**Respuesta `200`**
```json
[
  { "id": 1, "nombCli": "Juan", "apeCli": "Pérez", "fecNac": "15/03/1990", "uid": "firebase-uid-abc" }
]
```

---

### `GET /api/clientes/{id}`

**Respuesta `200`**
```json
{ "id": 1, "nombCli": "Juan", "apeCli": "Pérez", "fecNac": "15/03/1990", "uid": "firebase-uid-abc" }
```

| Status | Descripción |
|--------|-------------|
| `200`  | Cliente encontrado |
| `404`  | No existe |

---

### `POST /api/clientes`

**Request body**
```json
{
  "nombCli": "Juan",
  "apeCli":  "Pérez",
  "fecNac":  "15/03/1990",
  "uid":     "firebase-uid-abc"
}
```

> Formato de fecha: `dd/MM/yyyy`  
> Campos requeridos: `nombCli`, `apeCli`, `uid`

**Respuesta `201`**
```json
{ "id": 1, "nombCli": "Juan", "apeCli": "Pérez", "fecNac": "15/03/1990", "uid": "firebase-uid-abc" }
```

| Status | Descripción |
|--------|-------------|
| `201`  | Creado exitosamente |
| `400`  | Campo requerido faltante — `{ "error": "El campo nombCli es requerido." }` |
| `409`  | `uid` ya registrado — `{ "error": "Ya existe un cliente con ese uid." }` |

---

### `PUT /api/clientes/{id}`

Misma estructura de body que `POST`. No actualiza el `uid`.

**Respuesta `200`**
```json
{ "id": 1, "nombCli": "Juan", "apeCli": "Pérez", "fecNac": "20/01/1991", "uid": "firebase-uid-abc" }
```

| Status | Descripción |
|--------|-------------|
| `200`  | Actualizado exitosamente |
| `404`  | Cliente no encontrado |

---

### `DELETE /api/clientes/{id}`

**Respuesta `204`** — sin body.

| Status | Descripción |
|--------|-------------|
| `204`  | Eliminado exitosamente |
| `404`  | Cliente no encontrado |

---

## Mascotas

### `GET /api/mascotas?idCliente={idCliente}`

Si se omite `idCliente`, devuelve todas las mascotas.

**Respuesta `200`**
```json
[
  {
    "id":            1,
    "nombMas":       "Firulais",
    "idTipoMascota": 1,
    "nombreTipo":    "Perro",
    "idCliente":     5
  }
]
```

---

### `GET /api/mascotas/{id}`

**Respuesta `200`** — mismo objeto individual.

| Status | Descripción |
|--------|-------------|
| `200`  | Mascota encontrada |
| `404`  | No existe |

---

### `POST /api/mascotas`

**Request body**
```json
{
  "nombMas":       "Firulais",
  "apodos":        "Firu",
  "alergias":      "Polen",
  "idTipoMascota": 1,
  "idCliente":     5
}
```

> `apodos` y `alergias` son opcionales.

**Respuesta `201`**
```json
{
  "id":            1,
  "nombMas":       "Firulais",
  "idTipoMascota": 1,
  "nombreTipo":    "Perro",
  "idCliente":     5
}
```

| Status | Descripción |
|--------|-------------|
| `201`  | Creada exitosamente |
| `400`  | `idCliente` o `idTipoMascota` no existen |

---

### `PUT /api/mascotas/{id}`

Misma estructura de body que `POST`. El `idCliente` del body debe coincidir con el dueño.

**Respuesta `200`** — objeto MascotaDTO actualizado.

| Status | Descripción |
|--------|-------------|
| `200`  | Actualizada exitosamente |
| `404`  | Mascota no encontrada o el `idCliente` no es el dueño |

---

### `DELETE /api/mascotas/{id}?idCliente={idCliente}`

**Respuesta `204`** — sin body.

| Status | Descripción |
|--------|-------------|
| `204`  | Eliminada exitosamente |
| `403`  | El `idCliente` no es el dueño de la mascota |
| `404`  | Mascota no encontrada |

---

## Citas

### `GET /api/citas?idCliente={idCliente}`

Si se omite `idCliente`, devuelve todas las citas.

**Respuesta `200`**
```json
[
  {
    "idCita":         1,
    "nombreTipoCita": "Vacunación",
    "fecha":          "2025-07-10T10:30:00",
    "comentario":     "Primera dosis",
    "idMascota":      1,
    "nombreMascota":  "Firulais",
    "idCliente":      5,
    "nombreCliente":  "Juan Pérez",
    "idClinica":      1,
    "nombreClinica":  "Firuvet San Miguel"
  }
]
```

---

### `GET /api/citas/{id}`

**Respuesta `200`** — mismo objeto individual.

| Status | Descripción |
|--------|-------------|
| `200`  | Cita encontrada |
| `404`  | `{ "error": "Cita no encontrada." }` |

---

### `POST /api/citas`

**Request body**
```json
{
  "idTipoCita": 1,
  "fecha":      "2025-07-10T10:30:00",
  "comentario": "Primera dosis",
  "idMascota":  1,
  "idCliente":  5,
  "idClinica":  1
}
```

> Formato de fecha: ISO 8601 `yyyy-MM-ddTHH:mm:ss`

**Respuesta `201`** — objeto CitaDTO completo.

| Status | Descripción |
|--------|-------------|
| `201`  | Creada exitosamente |
| `404`  | `{ "error": "No se encontró cliente con ese uid." }` — `idCliente` no existe |

---

### `PUT /api/citas/{id}`

Misma estructura de body que `POST`. El `idCliente` del body se usa para verificar ownership.

**Respuesta `200`** — sin body.

| Status | Descripción |
|--------|-------------|
| `200`  | Actualizada exitosamente |
| `403`  | `{ "error": "No tienes permiso para modificar esta cita." }` |
| `404`  | `{ "error": "Cita no encontrada." }` |

---

### `DELETE /api/citas/{id}?idCliente={idCliente}`

**Respuesta `204`** — sin body.

| Status | Descripción |
|--------|-------------|
| `204`  | Eliminada exitosamente |
| `403`  | `{ "error": "No tienes permiso para eliminar esta cita." }` |
| `404`  | `{ "error": "Cita no encontrada." }` |

---

## Errores — Formato estándar

```json
{ "error": "mensaje descriptivo del problema" }
```

---

## Flujo de uso típico

```
1. Firebase login         →  obtener uid + idCliente (almacenado localmente tras registro)
2. GET  /api/clientes/{id}          →  verificar que el cliente existe
3. POST /api/clientes               →  solo si es primer login (uid nuevo)
4. GET  /api/tipos-mascota          →  cargar combo al registrar mascota
5. POST /api/mascotas               →  registrar mascota
6. GET  /api/mascotas?idCliente=    →  listar mascotas del cliente
7. GET  /api/tipos-cita             →  cargar combo tipo de cita
8. GET  /api/clinicas               →  cargar combo clínicas
9. POST /api/citas                  →  crear cita
10. GET  /api/citas?idCliente=      →  listar citas del cliente
```

---

## Diferencias clave vs rama anterior

| Aspecto | Rama anterior (incorrecta) | Rama actual |
|---------|---------------------------|-------------|
| Filtro mascotas | `?uid=` | `?idCliente=` (Long) |
| Filtro citas | `?uid=` | `?idCliente=` (Long) |
| Delete citas | `?uid=` | `?idCliente=` (Long) |
| Clientes | Solo GET por id y uid | GET lista, GET por id, POST, PUT, DELETE |
| Mascotas | Solo GET | GET lista, GET por id, POST, PUT, DELETE |
| PUT citas | Retorna CitaDTO | Retorna `200` sin body |
| Autenticación | Firebase `uid` en queries | `idCliente` (id interno de Postgres) |
