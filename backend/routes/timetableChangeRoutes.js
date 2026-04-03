const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableChangeController');

// Phải đặt import lên trên các route có chứa /:id
router.post('/import', timetableController.importTimetableChanges);

router.post('/', timetableController.createTimetableChange);
router.get('/', timetableController.getAllTimetableChanges);
router.put('/:id', timetableController.updateTimetableChange);
router.delete('/:id', timetableController.deleteTimetableChange);

module.exports = router;