const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const exphbs = require('express-handlebars');

// Definir un array vacío de productos
const products = [];

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

// Configuración de las rutas para las vistas
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});


// Manejo de conexiones WebSocket
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Enviar los productos actuales al cliente cuando se conecta
    socket.emit('productList', products);

    // Manejar la creación de un nuevo producto
    socket.on('newProduct', (product) => {
        products.push(product); // Agrega el nuevo producto al array
        io.emit('updateProducts', product); // Emite el nuevo producto a todos los clientes
    });

    // Manejar la eliminación de un producto
    socket.on('deleteProduct', (productId) => {
    });

    // Manejar la desconexión de un usuario
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

const PORT = 8080;
http.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
