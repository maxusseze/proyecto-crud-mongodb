const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', controller.getProducts);
router.get('/:id', controller.getProduct);
router.post('/', verifyToken, controller.createProduct);
router.put('/:id', verifyToken, controller.updateProduct);
router.delete('/:id', verifyToken, controller.deleteProduct);

module.exports = router;