export const normalizeCurrencies = (values = []) => {
  const seen = new Set();
  const merged = [];
  const source = [...(Array.isArray(values) ? values : [])];
  source.forEach((currency) => {
    if (!currency || !currency.code) return;
    const code = String(currency.code).trim().toUpperCase();
    if (seen.has(code)) return;
    seen.add(code);
    merged.push({ code, name: currency.name || code, symbol: currency.symbol || '', rate: currency.rate ?? 1 });
  });
  return merged;
};

export const validateOfferPrice = (price, offerType, pricingSettings = {}) => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return 'Price must be a valid number';
  if (numPrice < 0) return 'Price cannot be negative';

  const minSettingKey = offerType === 'Product' ? 'productPriceMin' : 'offerPriceMin';
  const minPrice = pricingSettings[minSettingKey] ?? 0;
  if (numPrice < minPrice) {
    return `Minimum price for ${offerType === 'Product' ? 'product' : 'offer'} is $${minPrice.toFixed(2)}`;
  }
  return null;
};
