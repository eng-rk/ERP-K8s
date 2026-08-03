const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/authorize');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

router.get('/', protect, checkPermission('wms.items.view'), getProducts);
router.post('/', protect, checkPermission('wms.items.create'), createProduct);
router.put('/:id', protect, checkPermission('wms.items.edit'), updateProduct);
router.delete('/:id', protect, checkPermission('wms.items.delete'), deleteProduct);

module.exports = router;
