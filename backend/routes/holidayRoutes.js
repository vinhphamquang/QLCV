const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holidayController');

router.post('/import', holidayController.importHolidays);
router.post('/', holidayController.createHoliday);
router.get('/', holidayController.getAllHolidays);
router.put('/:id', holidayController.updateHoliday);
router.delete('/:id', holidayController.deleteHoliday);

module.exports = router;