const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const exphbs = require('express-handlebars');
const fs = require('fs').promises;

// Definir un array vacío de productos
let products = [];

// Función asincrónica para cargar los productos desde el archivo JSON
async function loadProductsFromFile() {
    try {
        const data = await fs.readFile('products.json', 'utf8');
        products = JSON.parse(data);
        io.emit('productList', products); 
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Llamar a la función para cargar productos al inicio del servidor
loadProductsFromFile();

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);

// Configuración de las rutas para las vistas
app.get('/', (req, res) => {
    res.render('home', { products });
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
        products.push(product);
        io.emit('updateProducts', product); 
        
        fs.writeFile('products.json', JSON.stringify(products, null, 2), 'utf8')
            .catch(error => console.error('Error al escribir en el archivo products.json:', error));
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
