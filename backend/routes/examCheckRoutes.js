const express = require('express');
const router = express.Router();
const examCheckController = require('../controllers/examCheckController');

// Đặt route import lên TRÊN các route có /:id
router.post('/import', examCheckController.importExamChecks);

router.post('/', examCheckController.createExamCheck);        
router.get('/', examCheckController.getAllExamChecks);       
router.put('/:id', examCheckController.updateExamCheck);     
router.delete('/:id', examCheckController.deleteExamCheck);  

module.exports = router;