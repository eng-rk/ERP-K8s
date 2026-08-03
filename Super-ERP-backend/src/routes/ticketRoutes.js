const express = require('express');
const router = express.Router();
const { getTickets, getTechnologyUsers, getTicketById, addComment, createTicket, updateTicket } = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/authorize');

router.use(protect);

router.get('/technology-users', checkPermission('tickets.desk.view'), getTechnologyUsers);

router.get('/:id', checkPermission('tickets.desk.view'), getTicketById);
router.post('/:id/comments', checkPermission('tickets.desk.edit'), addComment);

router.route('/')
  .get(checkPermission('tickets.desk.view'), getTickets)
  .post(checkPermission('tickets.desk.create'), createTicket);

router.route('/:id')
  .put(checkPermission('tickets.desk.edit'), updateTicket);

module.exports = router;
