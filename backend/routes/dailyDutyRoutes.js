const express = require('express');
const router = express.Router();
const dailyDutyController = require('../controllers/dailyDutyController');

router.post('/', dailyDutyController.createDailyDuty);
router.get('/', dailyDutyController.getAllDailyDuties);
router.put('/:id', dailyDutyController.updateDailyDuty);
router.delete('/:id', dailyDutyController.deleteDailyDuty);

module.exports = router;