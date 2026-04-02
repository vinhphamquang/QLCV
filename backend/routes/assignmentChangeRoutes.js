const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentChangeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', assignmentController.createAssignmentChange);
router.get('/', assignmentController.getAllAssignmentChanges);
router.put('/:id', assignmentController.updateAssignmentChange);
router.delete('/:id', assignmentController.deleteAssignmentChange);
router.post('/import', assignmentController.importAssignments);

module.exports = router;