const express = require('express');
const router = express.Router();
const ExamPreparation = require('../models/ExamPreparation');

// Get all exam preparations
router.get('/', async (req, res) => {
  try {
    const exams = await ExamPreparation.find().sort({ ngayNop: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming deadlines (within 7 days)
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingExams = await ExamPreparation.find({
      ngayNop: {
        $gte: today,
        $lte: nextWeek
      }
    }).sort({ ngayNop: 1 });
    
    res.json(upcomingExams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single exam preparation
router.get('/:id', async (req, res) => {
  try {
    const exam = await ExamPreparation.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create exam preparation
router.post('/', async (req, res) => {
  const exam = new ExamPreparation({
    mon: req.body.mon,
    ngayNop: req.body.ngayNop,
    nguoiNop: req.body.nguoiNop,
    nguoiRaDe: req.body.nguoiRaDe,
    thoiGianLamBai: req.body.thoiGianLamBai,
    tot: req.body.tot !== undefined ? req.body.tot : true,
    noiDungLoi: req.body.noiDungLoi,
    ghiChu: req.body.ghiChu
  });

  try {
    const newExam = await exam.save();
    res.status(201).json(newExam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update exam preparation
router.put('/:id', async (req, res) => {
  try {
    const exam = await ExamPreparation.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
    }

    if (req.body.mon) exam.mon = req.body.mon;
    if (req.body.ngayNop) exam.ngayNop = req.body.ngayNop;
    if (req.body.nguoiNop) exam.nguoiNop = req.body.nguoiNop;
    if (req.body.nguoiRaDe) exam.nguoiRaDe = req.body.nguoiRaDe;
    if (req.body.thoiGianLamBai) exam.thoiGianLamBai = req.body.thoiGianLamBai;
    if (req.body.tot !== undefined) exam.tot = req.body.tot;
    if (req.body.noiDungLoi !== undefined) exam.noiDungLoi = req.body.noiDungLoi;
    if (req.body.ghiChu !== undefined) exam.ghiChu = req.body.ghiChu;

    const updatedExam = await exam.save();
    res.json(updatedExam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete exam preparation
router.delete('/:id', async (req, res) => {
  try {
    const exam = await ExamPreparation.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
    }
    await exam.deleteOne();
    res.json({ message: 'Đã xóa bản ghi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
