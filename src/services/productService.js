const Product = require('../models/productModel');

const getAll = async () => Product.find().populate('categoria');

const getById = async (id) => Product.findById(id).populate('categoria');

const create = async (data) => {
  const product = new Product(data);
  return product.save();
};

const update = async (id, data) =>
  Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('categoria');

const remove = async (id) => Product.findByIdAndDelete(id);

module.exports = { getAll, getById, create, update, remove };