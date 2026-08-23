const legacy = require('../../controllers/gatewayController');
module.exports = {
  getGateways: legacy.getGateways,
  saveGateway: legacy.saveGateway,
  deleteGateway: legacy.deleteGateway,
  getVendors: legacy.getVendors,
  getBankAccounts: legacy.getBankAccounts,
  saveBankAccount: legacy.saveBankAccount,
  verifyBankAccount: legacy.verifyBankAccount,
  deleteBankAccount: legacy.deleteBankAccount,
  getCompanyAccounts: legacy.getCompanyAccounts,
  saveCompanyAccount: legacy.saveCompanyAccount,
  verifyCompanyAccount: legacy.verifyCompanyAccount,
  deleteCompanyAccount: legacy.deleteCompanyAccount,
  getReleaseReadiness: legacy.getReleaseReadiness,
  handleGatewayWebhook: legacy.handleGatewayWebhook,
  getTransactions: legacy.getTransactions,
  retryTransaction: legacy.retryTransaction,
};
