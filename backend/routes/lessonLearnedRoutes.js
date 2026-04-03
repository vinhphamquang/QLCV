const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonLearnedController');

router.post('/import', lessonController.importLessons);
router.post('/', lessonController.createLesson);
router.get('/', lessonController.getAllLessons);
router.put('/:id', lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);

module.exports = router;