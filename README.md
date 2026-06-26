base url VITE_URL_BASE_SOAP

# Suri Firuvet API SOAP

Microservicio SOAP de la plataforma **Suri Firuvet**, diseñado para exponer las operaciones principales del sistema veterinario a través del protocolo SOAP/WSDL. Permite a sistemas externos o integraciones empresariales consumir datos de mascotas, clientes, citas y catálogos de forma estandarizada.

---

## Visión del Producto

Este microservicio nace de la necesidad de interoperabilidad empresarial. Mientras que el API REST atiende la app móvil iOS, el servicio SOAP está orientado a integraciones con sistemas legados, ERPs veterinarios, o cualquier sistema externo que requiera consumir información de la plataforma Suri Firuvet bajo un contrato formal definido por WSDL.

El servicio es de solo lectura en su mayoría, con la excepción del registro de mascotas, lo que lo hace seguro para integraciones de terceros sin riesgo de modificaciones no controladas.

---

## Alcance

Este microservicio **incluye:**
- Consulta de clientes registrados en la plataforma
- Consulta y registro de mascotas por cliente
- Consulta de citas por cliente
- Consulta de catálogos: tipos de mascota, tipos de cita y clínicas

Este microservicio **no incluye:**
- Autenticación con Firebase
- Creación, modificación o eliminación de clientes
- Modificación o eliminación de citas
- Sistema de auditoría
- Lógica de negocio compleja — solo consultas y registro básico

---

## Historias de Usuario

### HU-01 — Consulta de clientes desde sistema externo
> Como sistema externo integrado, quiero obtener la lista de clientes registrados en Suri Firuvet, para sincronizar información con mi plataforma.

**Criterios de aceptación:**
- Se puede obtener la lista completa de clientes via `ObtenerClientes`
- Se puede obtener un cliente específico por su `id` via `ObtenerCliente`
- La respuesta incluye nombre, apellido, fecha de nacimiento y uid de Firebase

---

### HU-02 — Consulta de mascotas desde sistema externo
> Como sistema externo, quiero consultar las mascotas registradas en la plataforma, para conocer el historial de animales atendidos.

**Criterios de aceptación:**
- Se puede listar todas las mascotas via `ObtenerMascotas`
- Se puede obtener una mascota específica por `id` via `ObtenerMascota`
- Se puede filtrar mascotas por cliente via `ObtenerMascotasPorCliente`
- La respuesta incluye nombre, tipo, apodos y alergias

---

### HU-03 — Registro de mascota desde sistema externo
> Como sistema externo, quiero registrar una nueva mascota en la plataforma, para mantener sincronizado el inventario de animales.

**Criterios de aceptación:**
- Se puede registrar una mascota enviando nombre, tipo, cliente, apodos y alergias via `RegistrarMascota`
- Si el cliente o tipo de mascota no existe, la operación retorna vacío
- La mascota queda persistida en la BD compartida con el API REST

---

### HU-04 — Consulta de citas desde sistema externo
> Como sistema externo, quiero consultar las citas agendadas en la plataforma, para planificar la atención en las clínicas.

**Criterios de aceptación:**
- Se puede listar todas las citas via `ObtenerCitas`
- Se puede obtener una cita específica por `id` via `ObtenerCita`
- Se puede filtrar citas por cliente via `ObtenerCitasPorCliente`
- La respuesta incluye tipo de cita, fecha, mascota, cliente y clínica

---

### HU-05 — Consulta de catálogos desde sistema externo
> Como sistema externo, quiero obtener los catálogos de la plataforma, para presentar opciones válidas al usuario en mi sistema.

**Criterios de aceptación:**
- Se puede obtener los tipos de mascota via `ObtenerTiposMascota`
- Se puede obtener los tipos de cita via `ObtenerTiposCita`
- Se puede obtener las clínicas disponibles via `ObtenerClinicas`

---

## Arquitectura

```
Sistema Externo / ERP / Legacy
          |
          | SOAP/XML sobre HTTP
          ▼
┌──────────────────────────────────┐
│     Suri Firuvet API SOAP         │
│       (Quarkus + CXF)             │
│                                  │
│  /soap/mascotas   → MascotaWS    │
│  /soap/clientes   → ClienteWS    │
│  /soap/citas      → CitaWS       │
│  /soap/catalogos  → CatalogoWS   │
│                                  │
│  EntityManager → Hibernate ORM   │
└──────────────────────────────────┘
          |
          | JDBC
          ▼
   PostgreSQL (Supabase)
   [BD compartida con API REST]
```

| Componente | Tecnología | Proveedor |
|---|---|---|
| Microservicio SOAP | Quarkus 3.36.3 + CXF | Render |
| Base de datos | PostgreSQL | Supabase |
| Imagen Docker | Docker Hub | kalenoronha/suri-firuvet-api-soap |
| CI/CD | GitHub Actions | GitHub |

---

## Lógica de Negocio

### Flujo de consulta de mascotas por cliente
1. Sistema externo llama `ObtenerMascotasPorCliente` enviando el `idCliente`
2. El web service consulta directamente via `EntityManager` filtrando por `cliente.id`
3. Hibernate resuelve las relaciones `@ManyToOne` con `TipoMascota` y `Cliente`
4. JAXB serializa las entidades a XML y retorna la respuesta SOAP

### Flujo de registro de mascota
1. Sistema externo llama `RegistrarMascota` con nombre, idTipoMascota, idCliente, apodos y alergias
2. El web service busca el `Cliente` y `TipoMascota` en la BD
3. Si alguno no existe, retorna `null`
4. Si ambos existen, persiste la mascota en la BD compartida
5. La mascota queda disponible inmediatamente en el API REST

### BD compartida
El microservicio SOAP y el API REST **comparten la misma BD** en Supabase. Esto significa que cualquier mascota registrada vía SOAP es visible instantáneamente en la app móvil vía REST, y viceversa.

---

## Operaciones SOAP

### Mascotas — `http://<host>/soap/mascotas?wsdl`
| Operación | Parámetros | Descripción |
|---|---|---|
| `ObtenerMascotas` | — | Lista todas las mascotas |
| `ObtenerMascota` | `id: Long` | Obtiene mascota por id |
| `ObtenerMascotasPorCliente` | `idCliente: Long` | Lista mascotas de un cliente |
| `RegistrarMascota` | `nombMas, idTipoMascota, idCliente, apodos, alergias` | Registra nueva mascota |

### Clientes — `http://<host>/soap/clientes?wsdl`
| Operación | Parámetros | Descripción |
|---|---|---|
| `ObtenerClientes` | — | Lista todos los clientes |
| `ObtenerCliente` | `id: Long` | Obtiene cliente por id |

### Citas — `http://<host>/soap/citas?wsdl`
| Operación | Parámetros | Descripción |
|---|---|---|
| `ObtenerCitas` | — | Lista todas las citas |
| `ObtenerCita` | `id: Long` | Obtiene cita por id |
| `ObtenerCitasPorCliente` | `idCliente: Long` | Lista citas de un cliente |

### Catálogos — `http://<host>/soap/catalogos?wsdl`
| Operación | Parámetros | Descripción |
|---|---|---|
| `ObtenerTiposMascota` | — | Lista tipos de mascota |
| `ObtenerTiposCita` | — | Lista tipos de cita |
| `ObtenerClinicas` | — | Lista clínicas disponibles |

---

## Ejemplo de petición SOAP

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:soap="http://soap.surifiruvet.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <soap:ObtenerMascotasPorCliente>
            <idCliente>1</idCliente>
        </soap:ObtenerMascotasPorCliente>
    </soapenv:Body>
</soapenv:Envelope>
```

---

## Detalle Técnico

### Stack

| Tecnología | Versión | Rol |
|---|---|---|
| Java | 21 | Lenguaje principal |
| Quarkus | 3.36.3 | Framework base |
| Quarkus CXF | 3.36.3 | Implementación SOAP/WSDL via Apache CXF |
| Apache CXF | — | Motor SOAP, generación de WSDL automática |
| Hibernate ORM | — | Persistencia JPA sin Panache |
| JDBC PostgreSQL | — | Driver de conexión a Supabase |
| JAXB | — | Serialización de entidades a XML |
| Lombok | 1.18.36 | `@Getter`/`@Setter` en entidades, `@Data` en DTOs |
| SmallRye Health | — | Health check en `/q/health` |
| Docker | — | Contenedor de despliegue |
| GitHub Actions | — | CI/CD — build Maven + push Docker Hub + deploy Render |

### Estructura de paquetes
```
com.surifiruvet
├── entity/        # Entidades JPA anotadas con @XmlRootElement para JAXB
│   ├── Cliente
│   ├── Mascota    # Incluye apodos y alergias
│   ├── Cita
│   ├── Clinica
│   ├── TipoCita
│   └── TipoMascota
├── soap/          # Interfaces @WebService + implementaciones
│   ├── MascotaWebService + MascotaWebServiceImpl
│   ├── ClienteWebService + ClienteWebServiceImpl
│   ├── CitaWebService    + CitaWebServiceImpl
│   └── CatalogoWebService + CatalogoWebServiceImpl
└── health/
    └── ApiHealthCheck    # @Liveness
```

### Decisiones de diseño
- **Sin capa de servicio** — los `WebServiceImpl` llaman directamente al `EntityManager`. Al ser un microservicio de consulta sin lógica de negocio compleja, la capa de servicio sería código innecesario
- **Entidades como respuesta SOAP** — se usan directamente con `@XmlRootElement` en lugar de DTOs, ya que SOAP serializa a XML y no hay riesgo de exponer campos sensibles en este contexto
- **BD compartida** — el microservicio no tiene su propia BD, comparte la misma instancia de Supabase con el API REST para garantizar consistencia de datos

### Variables de entorno
```env
DB_USER=
DB_PASSWORD=
DB_URL=jdbc:postgresql://<host>:<port>/<db>
```

### Correr en local
```powershell
foreach($line in Get-Content .env){ $parts = $line -split '=',2; if($parts[0] -ne ''){ [System.Environment]::SetEnvironmentVariable($parts[0], $parts[1]) } }; ./mvnw quarkus:dev
```

### WSDL en local
```
http://localhost:8081/soap/mascotas?wsdl
http://localhost:8081/soap/clientes?wsdl
http://localhost:8081/soap/citas?wsdl
http://localhost:8081/soap/catalogos?wsdl
```

### Health Check
```
http://localhost:8081/q/health
http://localhost:8081/q/health/live
http://localhost:8081/q/health/ready
```

### CI/CD
El pipeline de GitHub Actions se activa con cada push a `main`:
1. Checkout del código
2. Login a Docker Hub
3. Build multi-stage con `Dockerfile.render` — Maven compila dentro del contenedor
4. Push de la imagen `kalenoronha/suri-firuvet-api-soap:latest` a Docker Hub
5. Trigger de redeploy en Render via API

### Secrets requeridos en GitHub
```
DOCKER_USERNAME
DOCKER_PASSWORD
RENDER_API_KEY
RENDER_SERVICE_ID_SOAP
```
