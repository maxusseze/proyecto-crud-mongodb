const productService = require('../services/productService');

const getProducts = async (req, res) => {
  try {
    const products = await productService.getAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await productService.getById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Datos inválidos', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Datos inválidos', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.remove(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };