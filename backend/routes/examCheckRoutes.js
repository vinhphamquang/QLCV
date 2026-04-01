const express = require('express');
const router = express.Router();
const examCheckController = require('../controllers/examCheckController');

// Định nghĩa các endpoint
router.post('/', examCheckController.createExamCheck);        // Thêm
router.get('/', examCheckController.getAllExamChecks);       // Lấy danh sách
router.put('/:id', examCheckController.updateExamCheck);     // Sửa
router.delete('/:id', examCheckController.deleteExamCheck);  // Xóa

module.exports = router;