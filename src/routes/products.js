const express = require('express');
const router = express.Router();
const ProductManager = require('../productManager');

const productManager = new ProductManager('./src/products.json');

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const products = await productManager.getProducts();
        const product = products.find(p => p.id === (isNaN(parseInt(products[0].id)) ? pid : parseInt(pid)));
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        const productId = await productManager.addProduct([
            newProduct.title,
            newProduct.description,
            newProduct.price,
            newProduct.thumbnail,
            newProduct.code,
            newProduct.stock
        ]);
        res.status(201).json({ id: productId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = req.body;
        await productManager.updateProduct(pid, updatedProduct);
        res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await productManager.deleteProduct(pid);
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
