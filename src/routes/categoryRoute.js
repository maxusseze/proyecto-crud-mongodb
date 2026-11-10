const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoryController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', controller.getCategories);
router.post('/', verifyToken, controller.createCategory);
router.delete('/:id', verifyToken, controller.deleteCategory);

module.exports = router;