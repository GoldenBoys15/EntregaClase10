const express = require('express');
const router = express.Router();
const fs = require('fs');

const cartsFilePath = './src/carts.json';

function readDataFromFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function writeDataToFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

let carts = readDataFromFile(cartsFilePath);

router.post('/', (req, res) => {
    const newCart = req.body;
    if (!newCart.products) {
        res.status(400).json({ message: 'El campo products es obligatorio' });
    } else {
        newCart.id = generateCartId();
        carts.push(newCart);
        writeDataToFile(cartsFilePath, carts);
        res.status(201).json(newCart);
    }
});

router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const cartId = (isNaN(parseInt(readDataFromFile(cartsFilePath)[0].id)) ? cid : parseInt(cid));
    const cart = carts.find(c => c.id === cartId);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const cartIndex = carts.findIndex(c => c.id === cid);
    if (cartIndex !== -1) {
        try {
            await productManager.getProductById(pid);
            const productIndex = carts[cartIndex].products.findIndex(p => p.product === pid);
            if (productIndex !== -1) {
                carts[cartIndex].products[productIndex].quantity++;
            } else {
                carts[cartIndex].products.push({ product: pid, quantity: 1 });
            }
            writeDataToFile(cartsFilePath, carts);
            res.status(201).json(carts[cartIndex]);
        } catch (error) {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
    }
});

function generateCartId() {
    return Math.random().toString(36).substr(2, 9);
}

module.exports = router;
