const categoryService = require('../services/categoryService');

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Datos inválidos', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await categoryService.remove(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.status(200).json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

module.exports = { getCategories, createCategory, deleteCategory };