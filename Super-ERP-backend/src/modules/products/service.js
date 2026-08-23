const legacy = require('../../controllers/productController');
module.exports = {
  getProducts: legacy.getProducts,
  createProduct: legacy.createProduct,
  updateProduct: legacy.updateProduct,
  deleteProduct: legacy.deleteProduct,
};
