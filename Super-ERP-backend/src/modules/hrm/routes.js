const express = require('express');

const employeeRoutes = require('./features/employees/routes');
const payrollRoutes = require('./features/payroll/routes');
const trainingRoutes = require('./features/training/routes');
const talentRoutes = require('./features/talent/routes');
const partnershipsRoutes = require('./features/partnerships/routes');
const schedulingRoutes = require('./features/scheduling/routes');

const router = express.Router();

// HRM is now composed from domain feature routers.
// Public paths remain unchanged: /api/hrm/*
router.use(employeeRoutes);
router.use(payrollRoutes);
router.use(trainingRoutes);
router.use(talentRoutes);
router.use(partnershipsRoutes);
router.use(schedulingRoutes);

module.exports = router;
