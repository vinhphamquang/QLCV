const express = require('express');
const router = express.Router();
const keyActivityController = require('../controllers/keyActivityController');

router.post('/', keyActivityController.createKeyActivity);
router.get('/', keyActivityController.getAllKeyActivities);
router.put('/:id', keyActivityController.updateKeyActivity);
router.delete('/:id', keyActivityController.deleteKeyActivity);

module.exports = router;