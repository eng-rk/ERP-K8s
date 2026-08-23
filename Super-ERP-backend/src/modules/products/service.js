const Product = require('../../models/Product');

const PRODUCT_ROLES = [
  'Super CRM Administrator', 'System Architect', 'Sales Agent',
  'Sales Manager', 'Executive User',
];

exports.getProducts = async (req, res) => {
  try {
    if (!PRODUCT_ROLES.includes(req.user.role)) return res.status(403).json({ message: 'Access denied.' });
    const products = await Product.find().populate('createdBy', 'firstName lastName').sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};

exports.createProduct = async (req, res) => {
  try {
    if (!PRODUCT_ROLES.includes(req.user.role)) return res.status(403).json({ message: 'Access denied.' });
    const { name, sku, price, description, imageUrl, status } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Product name is required.' });
    if (!sku || !sku.trim()) return res.status(400).json({ message: 'SKU is required.' });
    if (price === undefined || price === null || Number.isNaN(Number(price)) || Number(price) < 0) return res.status(400).json({ message: 'A valid price is required.' });
    const SystemSetting = require('../../models/SystemSetting');
    const minPriceSetting = await SystemSetting.findOne({ key: 'productPriceMin' });
    const minPrice = minPriceSetting?.value ?? 0;
    if (Number(price) < minPrice) return res.status(400).json({ message: `Minimum price for product is ${Number(minPrice).toFixed(2)}` });
    const existing = await Product.findOne({ sku: sku.trim() });
    if (existing) return res.status(400).json({ message: 'A product with this SKU already exists.' });
    const product = await Product.create({ name: name.trim(), sku: sku.trim(), price: Number(price), description: description || '', imageUrl: imageUrl || '', status: status || 'Active', createdBy: req.user._id });
    const populated = await product.populate('createdBy', 'firstName lastName');
    res.status(201).json({ success: true, data: populated });
  } catch (error) { res.status(500).json({ message: 'Failed to create product', error: error.message }); }
};

exports.updateProduct = async (req, res) => {
  try {
    if (!PRODUCT_ROLES.includes(req.user.role)) return res.status(403).json({ message: 'Access denied.' });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    const { name, sku, price, description, imageUrl, status } = req.body;
    if (name !== undefined) product.name = name.trim();
    if (sku !== undefined && sku.trim() !== product.sku) {
      const clash = await Product.findOne({ sku: sku.trim() });
      if (clash) return res.status(400).json({ message: 'Another product already uses this SKU.' });
      product.sku = sku.trim();
    }
    if (price !== undefined) product.price = Number(price);
    if (description !== undefined) product.description = description;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (status !== undefined) product.status = status;
    const updated = await product.save();
    const populated = await updated.populate('createdBy', 'firstName lastName');
    res.json({ success: true, data: populated });
  } catch (error) { res.status(500).json({ message: 'Failed to update product', error: error.message }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (!['Super CRM Administrator', 'System Architect'].includes(req.user.role)) return res.status(403).json({ message: 'Only administrators can delete products.' });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) { res.status(500).json({ message: 'Failed to delete product', error: error.message }); }
};
