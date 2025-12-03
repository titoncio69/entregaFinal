import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server as SocketServer } from 'socket.io';
import handlebars from 'express-handlebars';
import { connectDB } from './config/db.js';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManagerMongo  from './dao/ProductManagerMongo.js';

// Para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8800;

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Rutas API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Rutas de vistas (home, products, carts, realtime, etc.)
app.use('/', viewsRouter);

// Arranque + Socket.IO
const httpServer = app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server escuchando en http://localhost:${PORT}`);
});

const io = new SocketServer(httpServer);

// inyectar io en req para usarlo en controladores si quieres
app.use((req, res, next) => {
  req.io = io;
  next();
});

const productService = new ProductManagerMongo();

io.on("connection", async (socket) => {
    console.log("🟢 Nuevo cliente conectado:", socket.id);

    // 1) Enviar lista inicial de productos
    const { products } = await productService.getProducts({ limit: 100, page: 1 });
    socket.emit("productsUpdated", products);

    // 2) Crear producto desde el formulario WebSocket
    socket.on("newProduct", async (data) => {
        try {
            await productService.createProduct(data);

            const { products } = await productService.getProducts({ limit: 100, page: 1 });
            io.emit("productsUpdated", products);

            console.log("Producto creado vía WebSocket");
        } catch (error) {
            console.error("Error creando producto vía socket:", error);
        }
    });

    // 3) Eliminar producto desde WebSocket
    socket.on("deleteProduct", async (pid) => {
        try {
            await productService.deleteProduct(pid);

            const { products } = await productService.getProducts({ limit: 100, page: 1 });
            io.emit("productsUpdated", products);

            console.log("Producto eliminado vía WebSocket");
        } catch (error) {
            console.error("Error eliminando producto vía socket:", error);
        }
    });
});