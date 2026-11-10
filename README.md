# API RESTful con CRUD y Capa de Servicios

API REST desarrollada con **Node.js, Express y MongoDB (Mongoose)** para gestionar **productos, categorías y usuarios**. El proyecto aplica separación de responsabilidades (modelos, servicios, controladores y rutas), autenticación con **JWT** y contraseñas encriptadas con **bcrypt**.

Trabajo Práctico Final - Curso de Backend Developer (Centro de e-Learning UTN BA).

---

## Tabla de contenidos

1. [Tecnologías utilizadas](#tecnologías-utilizadas)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Esquema de la base de datos](#esquema-de-la-base-de-datos)
4. [Instalación y ejecución](#instalación-y-ejecución)
5. [Archivo .env](#archivo-env)
6. [Endpoints disponibles](#endpoints-disponibles)
7. [Ejemplos de datos Mock](#ejemplos-de-datos-mock)
8. [Códigos de respuesta HTTP](#códigos-de-respuesta-http)
9. [Funcionalidades](#funcionalidades)

---

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Node.js | Entorno de ejecución |
| Express | Framework web y manejo de rutas |
| MongoDB Atlas | Base de datos NoSQL en la nube |
| Mongoose | ODM para modelar y consultar MongoDB |
| bcrypt | Hasheo de contraseñas (hook `pre-save`) |
| jsonwebtoken | Generación y verificación de JWT |
| dotenv | Variables de entorno |
| cors | Habilitación de CORS |
| nodemon | Reinicio automático en desarrollo |

---

## Estructura del proyecto

```
proyecto-crud-mongodb/
├── app.js                      # Punto de entrada
├── .env                        # Variables de entorno
├── package.json
└── src/
    ├── models/
    │   ├── productModel.js
    │   ├── userModel.js
    │   └── categoryModel.js
    ├── services/               # Lógica de negocio y acceso a la DB
    │   ├── productService.js
    │   ├── userService.js
    │   └── categoryService.js
    ├── controllers/            # Manejo de HTTP (request/response)
    │   ├── productController.js
    │   ├── userController.js
    │   └── categoryController.js
    ├── routes/
    │   ├── productRoute.js
    │   ├── userRoute.js
    │   └── categoryRoute.js
    ├── config/
    │   └── db.js               # Conexión a MongoDB
    └── middleware/
        └── verifyToken.js      # Middleware JWT
```

**Arquitectura:** las rutas reciben la petición, los **controladores** la gestionan y delegan en los **servicios**, que son los únicos que acceden a Mongoose/MongoDB.

---

## Esquema de la base de datos

### Colección `categories`

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `_id` | ObjectId | Auto | Generado por MongoDB |
| `nombre` | String | Sí | Único |
| `descripcion` | String | No | |
| `createdAt` / `updatedAt` | Date | Auto | Timestamps de Mongoose |

### Colección `products`

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `nombre` | String | Sí | |
| `descripcion` | String | No | |
| `precio` | Number | Sí | Mínimo 0 |
| `stock` | Number | No | Por defecto 0, mínimo 0 |
| `categoria` | ObjectId (ref: `Category`) | Sí | Referencia a la colección `categories` |
| `createdAt` / `updatedAt` | Date | Auto | |

### Colección `users`

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `_id` | ObjectId | Auto | |
| `nombre` | String | Sí | |
| `email` | String | Sí | Único |
| `password` | String | Sí | Se guarda hasheada con bcrypt |
| `createdAt` / `updatedAt` | Date | Auto | |

### Relación

```
Category (1) ────< (N) Product
```

Cada producto referencia a una categoría mediante `categoria`. En las lecturas de productos se usa `populate('categoria')` para devolver los datos completos de la categoría.

---

## Instalación y ejecución

### Requisitos previos

- [Node.js](https://nodejs.org/) instalado (verificar con `node -v` y `npm -v`)
- Una base de datos MongoDB (por ejemplo, un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/atlas))
- En Atlas: permitir tu IP en *Network Access* y tener un usuario de base de datos

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/maxusseze/proyecto-crud-mongodb.git
cd proyecto-crud-mongodb

# 2. Instalar dependencias
npm install

# 3. Configurar el archivo .env (ver sección siguiente)

# 4. Ejecutar en modo desarrollo (reinicio automático)
npm run dev

# o ejecutar en modo normal
npm start
```

Si todo está correcto, la consola muestra:

```
Servidor en puerto 3000
MongoDB conectado
```

El servidor queda disponible en `http://localhost:3000`.

---

## Archivo .env

El proyecto incluye un `.env` de ejemplo en la raíz con valores **placeholder**. Reemplazalos por tus datos reales para ejecutarlo:

```env
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/tienda?appName=MiCluster
JWT_SECRET=clave_secreta_de_ejemplo
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor |
| `MONGODB_URI` | Cadena de conexión a MongoDB (reemplazar `usuario`, `password` y `cluster`) |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT |

> Las credenciales del archivo son solo de ejemplo. Nunca subas credenciales reales a un repositorio.

---

## Endpoints disponibles

Base URL: `http://localhost:3000`

### Usuarios / Autenticación

| Método | Ruta | Descripción | Requiere token |
|---|---|---|---|
| POST | `/api/users/register` | Registrar un usuario | No |
| POST | `/api/users/login` | Iniciar sesión y obtener el JWT | No |

### Categorías

| Método | Ruta | Descripción | Requiere token |
|---|---|---|---|
| GET | `/api/categories` | Listar todas las categorías | No |
| POST | `/api/categories` | Crear una categoría | Sí |
| DELETE | `/api/categories/:id` | Eliminar una categoría | Sí |

### Productos

| Método | Ruta | Descripción | Requiere token |
|---|---|---|---|
| GET | `/api/products` | Listar productos (con categoría populada) | No |
| GET | `/api/products/:id` | Obtener un producto por ID (con categoría populada) | No |
| POST | `/api/products` | Crear un producto | Sí |
| PUT | `/api/products/:id` | Actualizar un producto | Sí |
| DELETE | `/api/products/:id` | Eliminar un producto | Sí |

### Cómo enviar el token

En las rutas protegidas, agregar el header:

```
Authorization: Bearer <token>
```

El token se obtiene en `POST /api/users/login` y tiene una duración de **1 hora**.

---

## Ejemplos de datos Mock

### Registrar usuario

`POST /api/users/register`

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@mail.com",
  "password": "123456"
}
```

**Respuesta (201):**
```json
{
  "message": "Usuario registrado",
  "id": "6af33d26f2a9e814547a333f",
  "email": "juan@mail.com"
}
```

### Login

`POST /api/users/login`

**Body:**
```json
{
  "email": "juan@mail.com",
  "password": "123456"
}
```

**Respuesta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Crear categoría

`POST /api/categories` (requiere token)

**Body:**
```json
{
  "nombre": "Electrónica",
  "descripcion": "Dispositivos y accesorios electrónicos"
}
```

**Respuesta (201):**
```json
{
  "nombre": "Electrónica",
  "descripcion": "Dispositivos y accesorios electrónicos",
  "_id": "6af33dedf2a9e814547a3340",
  "createdAt": "2026-11-10T15:53:17.134Z",
  "updatedAt": "2026-11-10T15:53:17.134Z",
  "__v": 0
}
```

### Listar categorías

`GET /api/categories`

**Respuesta (200):**
```json
[
  {
    "_id": "6af33dedf2a9e814547a3340",
    "nombre": "Electrónica",
    "descripcion": "Dispositivos y accesorios electrónicos"
  }
]
```

### Eliminar categoría

`DELETE /api/categories/6af33dedf2a9e814547a3340` (requiere token)

**Respuesta (200):**
```json
{ "message": "Categoría eliminada" }
```

### Crear producto

`POST /api/products` (requiere token)

**Body:**
```json
{
  "nombre": "Auriculares Bluetooth",
  "descripcion": "Auriculares inalámbricos con cancelación de ruido",
  "precio": 45000,
  "stock": 25,
  "categoria": "6af33dedf2a9e814547a3340"
}
```

**Respuesta (201):**
```json
{
  "nombre": "Auriculares Bluetooth",
  "descripcion": "Auriculares inalámbricos con cancelación de ruido",
  "precio": 45000,
  "stock": 25,
  "categoria": "6af33dedf2a9e814547a3340",
  "_id": "6af33e50f2a9e814547a3341",
  "createdAt": "2026-11-10T15:54:56.524Z",
  "updatedAt": "2026-11-10T15:54:56.524Z",
  "__v": 0
}
```

### Listar productos / obtener por ID (con populate)

`GET /api/products` o `GET /api/products/6af33e50f2a9e814547a3341`

**Respuesta (200):**
```json
{
  "_id": "6af33e50f2a9e814547a3341",
  "nombre": "Auriculares Bluetooth",
  "descripcion": "Auriculares inalámbricos con cancelación de ruido",
  "precio": 45000,
  "stock": 25,
  "categoria": {
    "_id": "6af33dedf2a9e814547a3340",
    "nombre": "Electrónica",
    "descripcion": "Dispositivos y accesorios electrónicos"
  },
  "createdAt": "2026-11-10T15:54:56.524Z",
  "updatedAt": "2026-11-10T15:54:56.524Z"
}
```

(`GET /api/products` devuelve un array con objetos de este formato.)

### Actualizar producto

`PUT /api/products/6af33e50f2a9e814547a3341` (requiere token)

**Body:**
```json
{
  "precio": 39999,
  "stock": 30
}
```

**Respuesta (200):** el producto actualizado, con la categoría populada.

### Eliminar producto

`DELETE /api/products/6af33e50f2a9e814547a3341` (requiere token)

**Respuesta (200):**
```json
{ "message": "Producto eliminado" }
```

### Ejemplos de errores

**Sin token (401):**
```json
{ "message": "Token requerido" }
```

**Token inválido o vencido (401):**
```json
{ "message": "Token inválido o expirado" }
```

**Credenciales incorrectas (401):**
```json
{ "message": "Email o contraseña incorrectos" }
```

**Email ya registrado (400):**
```json
{ "message": "El email ya está registrado" }
```

**Datos inválidos (400):**
```json
{ "message": "Datos inválidos", "error": "Product validation failed: nombre: Path `nombre` is required." }
```

**Producto no encontrado (404):**
```json
{ "message": "Producto no encontrado" }
```

---

## Códigos de respuesta HTTP

| Código | Significado |
|---|---|
| 200 | OK (lectura, actualización, eliminación, login) |
| 201 | Recurso creado |
| 400 | Datos inválidos o email duplicado |
| 401 | Token ausente/inválido o credenciales incorrectas |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## Funcionalidades

### Implementadas

- CRUD completo de **productos**
- Alta, listado y baja de **categorías**
- Registro y login de **usuarios**
- Encriptación de contraseñas con **bcrypt** mediante un `pre-save` hook de Mongoose
- Autenticación con **JWT** y middleware `verifyToken` que protege las rutas de creación, actualización y eliminación
- Relación Producto → Categoría con `populate` en las lecturas
- Capa de servicios con toda la lógica y las llamadas a Mongoose
- Controladores livianos con manejo de errores (`try/catch`) y códigos HTTP apropiados
- Variables de entorno con **dotenv**
- **CORS** habilitado en `app.js`

### Funcionalidades a futuro

- Validación de IDs de MongoDB (responder `400` ante un ID mal formado)
- Obtener y actualizar categorías por ID (`GET /:id`, `PUT /:id`)
- Impedir eliminar categorías que tengan productos asociados
- Roles de usuario (administrador / usuario común)
- Paginación, búsqueda y filtros en el listado de productos
- Validaciones más estrictas de datos de entrada (por ejemplo, con Joi o express-validator)
- Frontend para consumir la API
- Tests automatizados y documentación con Swagger
