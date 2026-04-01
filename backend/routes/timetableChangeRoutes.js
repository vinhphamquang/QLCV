const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableChangeController');

router.post('/', timetableController.createTimetableChange);
router.get('/', timetableController.getAllTimetableChanges);
router.put('/:id', timetableController.updateTimetableChange);
router.delete('/:id', timetableController.deleteTimetableChange);

module.exports = router;