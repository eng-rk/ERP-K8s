module.exports = {
  routes: require('./routes'),
  features: {
    employees: require('./features/employees'),
    payroll: require('./features/payroll'),
    talent: require('./features/talent'),
    training: require('./features/training'),
    partnerships: require('./features/partnerships'),
    scheduling: require('./features/scheduling'),
    banking: require('./features/banking'),
  },
};
