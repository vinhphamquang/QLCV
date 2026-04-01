const express = require('express');
const router = express.Router();
const ExamPeriodInspection = require('../models/ExamPeriodInspection');

// Get all exam period inspections
router.get('/', async (req, res) => {
  try {
    const inspections = await ExamPeriodInspection.find().sort({ ngay: -1 });
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming exam period inspections (within 7 days)
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const inspections = await ExamPeriodInspection.find({
      ngay: {
        $gte: today,
        $lte: nextWeek
      }
    }).sort({ ngay: 1 });
    
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single exam period inspection
router.get('/:id', async (req, res) => {
  try {
    const inspection = await ExamPeriodInspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
    }
    res.json(inspection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create exam period inspection
router.post('/', async (req, res) => {
  const inspection = new ExamPeriodInspection({
    mon: req.body.mon,
    ngay: req.body.ngay,
    noiDungConHanChe: req.body.noiDungConHanChe,
    rutKinhNghiem: req.body.rutKinhNghiem,
    ghiChu: req.body.ghiChu
  });

  try {
    const newInspection = await inspection.save();
    res.status(201).json(newInspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update exam period inspection
router.put('/:id', async (req, res) => {
  try {
    const inspection = await ExamPeriodInspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
    }

    if (req.body.mon) inspection.mon = req.body.mon;
    if (req.body.ngay) inspection.ngay = req.body.ngay;
    if (req.body.noiDungConHanChe !== undefined) inspection.noiDungConHanChe = req.body.noiDungConHanChe;
    if (req.body.rutKinhNghiem !== undefined) inspection.rutKinhNghiem = req.body.rutKinhNghiem;
    if (req.body.ghiChu !== undefined) inspection.ghiChu = req.body.ghiChu;

    const updatedInspection = await inspection.save();
    res.json(updatedInspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete exam period inspection
router.delete('/:id', async (req, res) => {
  try {
    const inspection = await ExamPeriodInspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
    }
    await inspection.deleteOne();
    res.json({ message: 'Đã xóa bản ghi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
