const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { postProduct, getProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getUsers, editRole } = require('../controllers/systemController');

router.post('/register', register);
router.post('/login', login);
router.post('/products', postProduct);
router.get('/products', getProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/users', getUsers);
router.patch('/users/:id', editRole);

module.exports = router;