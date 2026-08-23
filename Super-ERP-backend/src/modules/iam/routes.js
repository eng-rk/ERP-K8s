const express = require('express');
const permissionRoutes = require('./features/permissions/routes');
const roleRoutes = require('./features/roles/routes');
const userRoutes = require('./features/users/routes');

const router = express.Router();
router.use(permissionRoutes);
router.use(roleRoutes);
router.use(userRoutes);
module.exports = router;
