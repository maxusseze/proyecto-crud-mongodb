const Category = require('../models/categoryModel');

const getAll = async () => Category.find();

const create = async (data) => {
  const category = new Category(data);
  return category.save();
};

const remove = async (id) => Category.findByIdAndDelete(id);

module.exports = { getAll, create, remove };