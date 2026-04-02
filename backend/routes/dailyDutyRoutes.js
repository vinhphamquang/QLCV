const express = require('express');
const router = express.Router();
const dailyDutyController = require('../controllers/dailyDutyController');

// Route Nhập Excel (Phải đặt ở trên cùng các route có tham số)
router.post('/import', dailyDutyController.importDailyDuties);

// Các route CRUD cơ bản
router.post('/', dailyDutyController.createDailyDuty);
router.get('/', dailyDutyController.getAllDailyDuties);
router.put('/:id', dailyDutyController.updateDailyDuty);
router.delete('/:id', dailyDutyController.deleteDailyDuty);

module.exports = router;