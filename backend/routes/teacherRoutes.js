const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// Get all teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ ngayNhap: -1 });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single teacher
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create teacher
router.post('/', async (req, res) => {
  const teacher = new Teacher({
    hoTen: req.body.hoTen,
    noiDungViPham: req.body.noiDungViPham,
    noiDungTuyenDuong: req.body.noiDungTuyenDuong,
    ngayVang: req.body.ngayVang,
    ngayNhap: new Date()
  });

  try {
    const newTeacher = await teacher.save();
    res.status(201).json(newTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update teacher
router.put('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
    }

    if (req.body.hoTen) teacher.hoTen = req.body.hoTen;
    if (req.body.noiDungViPham !== undefined) teacher.noiDungViPham = req.body.noiDungViPham;
    if (req.body.noiDungTuyenDuong !== undefined) teacher.noiDungTuyenDuong = req.body.noiDungTuyenDuong;
    if (req.body.ngayVang !== undefined) teacher.ngayVang = req.body.ngayVang;

    const updatedTeacher = await teacher.save();
    res.json(updatedTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete teacher
router.delete('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Không tìm thấy giáo viên' });
    }
    await teacher.deleteOne();
    res.json({ message: 'Đã xóa giáo viên' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
