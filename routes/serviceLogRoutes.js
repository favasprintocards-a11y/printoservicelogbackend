const express = require('express');
const router = express.Router();
const {
    createServiceLog,
    getServiceLogs,
    getServiceLogById,
    updateServiceLog,
    getNextTicketNumber,
    deleteServiceLog,
} = require('../controllers/serviceLogController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.route('/').post(createServiceLog).get(getServiceLogs);
router.route('/next-number').get(getNextTicketNumber);
router.route('/:id').get(getServiceLogById).put(updateServiceLog).delete(deleteServiceLog);

module.exports = router;
