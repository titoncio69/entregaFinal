# Entrega Final - Coderhouse Backend

Proyecto desarrollado siguiendo los requisitos de la entrega final del curso Backend de Coderhouse.  
Incluye persistencia en MongoDB, WebSockets, Handlebars, paginación avanzada, filtros, ordenamiento y gestión completa de carritos.

---

## 🚀 Tecnologías utilizadas

- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- Handlebars (motor de templates)
- Docker / Docker Compose (MongoDB)
- Postman (para pruebas de APIs)

---

## 📦 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/titoncio69/entregaFinal.git
cd entregaFinal
```

---

## 🐳 2. Levantar MongoDB con Docker

El proyecto utiliza MongoDB corriendo en Docker mediante `docker-compose`.

Ejecuta:

```bash
docker compose up -d
```

Mongo quedará disponible en:

```
mongodb://coder:coder123@localhost:27017/coder_ecommerce?authSource=admin
```

---

## ▶ 3. Instalar dependencias

```bash
npm install
```

---

## ▶ 4. Ejecutar el servidor

```bash
npm run dev
```

El servidor estará en:

```
http://localhost:8800
```

---

# 📘 API COMPLETA

Aquí está la lista completa de endpoints disponibles.

---

# 🟦 PRODUCTOS – `/api/products`

---

## 📌 GET `/api/products`

Obtiene productos con paginación, filtros y orden:

### Parámetros:
| Param | Descripción |
|-------|-------------|
| limit | Cantidad por página (default 10) |
| page | Página (default 1) |
| query | `category:x` o `status:true` |
| sort | `asc` o `desc` por precio |

### Ejemplo:

```
GET http://localhost:8800/api/products?limit=5&page=1&sort=asc
```

---

## 📌 GET `/api/products/:pid`

Obtiene un producto por ID.

---

## 📌 POST `/api/products`

Crea un nuevo producto.

### Body:

```json
{
  "title": "Mouse RGB",
  "description": "HyperX RGB",
  "code": "HX123",
  "price": 19990,
  "category": "tech",
  "stock": 25
}
```

---

## 📌 DELETE `/api/products/:pid`

Elimina un producto por ID.

---

# 🟩 CARRITOS – `/api/carts`

---

## 📌 POST `/api/carts`

Crea un nuevo carrito.

---

## 📌 GET `/api/carts/:cid`

Obtiene un carrito **con populate**.

---

## 📌 POST `/api/carts/:cid/products/:pid`

Agrega un producto al carrito.

### Body:

```json
{
  "quantity": 3
}
```

---

## 📌 PUT `/api/carts/:cid`

Reemplaza **todo el arreglo** de productos del carrito.

### Body:

```json
{
  "products": [
    { "product": "ID1", "quantity": 2 },
    { "product": "ID2", "quantity": 5 }
  ]
}
```

---

## 📌 PUT `/api/carts/:cid/products/:pid`

Modifica **solo la cantidad** de un producto.

### Body:

```json
{
  "quantity": 10
}
```

---

## 📌 DELETE `/api/carts/:cid/products/:pid`

Elimina un producto específico del carrito.

---

## 📌 DELETE `/api/carts/:cid`

Vacía el carrito completo.

---

# 🟧 Vistas

---

## `/products`

Lista productos con paginación  
Permite seleccionar un carrito y agregar productos al instante.

---

## `/products/:pid`

Detalle de producto individual.

---

## `/realtimeproducts`

Vista con actualizaciones en tiempo real usando **WebSockets**.

---

## `/carts/:cid`

Muestra un carrito con productos populados.

---

# 🧪 Colección de Postman

Todos los endpoints están pensados para ser probados desde Postman.

---

# 🙌 Autor

Proyecto creado por **Cristian Marambio** para la entrega final de CoderHouse Backend.

---