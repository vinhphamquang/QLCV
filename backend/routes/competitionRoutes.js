const express = require('express');
const router = express.Router();
const Competition = require('../models/Competition');

// Get all competitions
router.get('/', async (req, res) => {
  try {
    const competitions = await Competition.find().sort({ thoiGianHoanThanh: -1 });
    res.json(competitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single competition
router.get('/:id', async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: 'Không tìm thấy hội thi' });
    }
    res.json(competition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create competition
router.post('/', async (req, res) => {
  const competition = new Competition({
    tenHoiThi: req.body.tenHoiThi,
    giaoViec: req.body.giaoViec,
    thoiGianHoanThanh: req.body.thoiGianHoanThanh,
    thoiGianThamGiaCacCap: req.body.thoiGianThamGiaCacCap
  });

  try {
    const newCompetition = await competition.save();
    res.status(201).json(newCompetition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update competition
router.put('/:id', async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: 'Không tìm thấy hội thi' });
    }

    if (req.body.tenHoiThi) competition.tenHoiThi = req.body.tenHoiThi;
    if (req.body.giaoViec) competition.giaoViec = req.body.giaoViec;
    if (req.body.thoiGianHoanThanh) competition.thoiGianHoanThanh = req.body.thoiGianHoanThanh;
    if (req.body.thoiGianThamGiaCacCap) competition.thoiGianThamGiaCacCap = req.body.thoiGianThamGiaCacCap;

    const updatedCompetition = await competition.save();
    res.json(updatedCompetition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete competition
router.delete('/:id', async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: 'Không tìm thấy hội thi' });
    }
    await competition.deleteOne();
    res.json({ message: 'Đã xóa hội thi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
