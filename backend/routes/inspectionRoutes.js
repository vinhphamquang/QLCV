const express = require('express');
const router = express.Router();
const Inspection = require('../models/Inspection');

// Get all inspections
router.get('/', async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({ thoiGianKiemTra: -1 });
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming inspections (within 7 days)
router.get('/upcoming', async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingInspections = await Inspection.find({
      thoiGianKiemTra: {
        $gte: today,
        $lte: nextWeek
      }
    }).sort({ thoiGianKiemTra: 1 });
    
    res.json(upcomingInspections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single inspection
router.get('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
    }
    res.json(inspection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create inspection
router.post('/', async (req, res) => {
  const inspection = new Inspection({
    thang: req.body.thang,
    tenGiaoVien: req.body.tenGiaoVien,
    noiDungKiemTra: req.body.noiDungKiemTra,
    tietKiemTra: req.body.tietKiemTra,
    thoiGianKiemTra: req.body.thoiGianKiemTra,
    danhGia: req.body.danhGia,
    rutKinhNghiem: req.body.rutKinhNghiem
  });

  try {
    const newInspection = await inspection.save();
    res.status(201).json(newInspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update inspection
router.put('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
    }

    if (req.body.thang) inspection.thang = req.body.thang;
    if (req.body.tenGiaoVien) inspection.tenGiaoVien = req.body.tenGiaoVien;
    if (req.body.noiDungKiemTra) inspection.noiDungKiemTra = req.body.noiDungKiemTra;
    if (req.body.tietKiemTra) inspection.tietKiemTra = req.body.tietKiemTra;
    if (req.body.thoiGianKiemTra) inspection.thoiGianKiemTra = req.body.thoiGianKiemTra;
    if (req.body.danhGia !== undefined) inspection.danhGia = req.body.danhGia;
    if (req.body.rutKinhNghiem !== undefined) inspection.rutKinhNghiem = req.body.rutKinhNghiem;

    const updatedInspection = await inspection.save();
    res.json(updatedInspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete inspection
router.delete('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
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
