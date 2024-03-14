const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const exphbs = require('express-handlebars');

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: false })); // Deshabilita el uso de un archivo de diseño principal
app.set('view engine', 'handlebars');

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

    // Manejar la creación de un nuevo producto
    socket.on('newProduct', (product) => {
        io.emit('updateProducts', product);
    });

    // Manejar la eliminación de un producto
    socket.on('deleteProduct', (productId) => {
        io.emit('removeProduct', productId);
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
