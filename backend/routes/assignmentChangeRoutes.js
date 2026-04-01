const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentChangeController');

router.post('/', assignmentController.createAssignmentChange);
router.get('/', assignmentController.getAllAssignmentChanges);
router.put('/:id', assignmentController.updateAssignmentChange);
router.delete('/:id', assignmentController.deleteAssignmentChange);

module.exports = router;