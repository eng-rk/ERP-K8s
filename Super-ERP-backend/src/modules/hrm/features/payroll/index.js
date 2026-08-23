module.exports = {
  controller: require('../../../../controllers/payrollController'),
  models: {
    PayrollEntry: require('../../../../models/PayrollEntry'),
    PayrollRun: require('../../../../models/PayrollRun'),
    PayrollAlert: require('../../../../models/PayrollAlert'),
  },
};
