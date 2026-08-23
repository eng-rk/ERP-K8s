const test = require('node:test');
const assert = require('node:assert/strict');
const { validateOfferInput } = require('../src/modules/crm/offers/validation');
const { validateInventoryItemInput, normalizeSku } = require('../src/modules/inventory/items/validation');

const objectId = '507f1f77bcf86cd799439011';

test('offer validation rejects incomplete payloads', () => {
  const errors = validateOfferInput({});
  assert.ok(errors.includes('lead must be a valid id'));
  assert.ok(errors.includes('Offer title is required'));
  assert.ok(errors.includes('Offer description is required'));
  assert.ok(errors.includes('Price is required and must be a valid number'));
  assert.ok(errors.includes('Valid until date is required'));
});

test('offer validation accepts a valid create payload', () => {
  const errors = validateOfferInput({
    lead: objectId,
    title: 'ERP Support',
    description: 'Annual support',
    price: 1500,
    validUntil: '2030-01-01',
    catalogProduct: objectId
  });
  assert.deepEqual(errors, []);
});

test('inventory validation rejects invalid numeric values', () => {
  const errors = validateInventoryItemInput({ sku: 'sku-1', name: 'Item', unitCost: -1, sellingPrice: 'x' });
  assert.ok(errors.includes('unitCost must be a non-negative number'));
  assert.ok(errors.includes('sellingPrice must be a non-negative number'));
});

test('inventory validation accepts a valid item and normalizes SKU', () => {
  const errors = validateInventoryItemInput({ sku: ' abc-123 ', name: 'Item', unitCost: 10, sellingPrice: 20 });
  assert.deepEqual(errors, []);
  assert.equal(normalizeSku(' abc-123 '), 'ABC-123');
});
