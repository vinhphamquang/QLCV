const express = require('express');
const router = express.Router();
const MonthlyTask = require('../models/MonthlyTask');

// Get all monthly tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await MonthlyTask.find().sort({ thoiGian: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single monthly task
router.get('/:id', async (req, res) => {
  try {
    const task = await MonthlyTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create monthly task
router.post('/', async (req, res) => {
  const task = new MonthlyTask({
    tuan: req.body.tuan,
    thu: req.body.thu,
    noiDung: req.body.noiDung,
    thoiGian: req.body.thoiGian,
    giaoViec: req.body.giaoViec,
    ghiChu: req.body.ghiChu
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update monthly task
router.put('/:id', async (req, res) => {
  try {
    const task = await MonthlyTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }

    if (req.body.tuan) task.tuan = req.body.tuan;
    if (req.body.thu) task.thu = req.body.thu;
    if (req.body.noiDung) task.noiDung = req.body.noiDung;
    if (req.body.thoiGian) task.thoiGian = req.body.thoiGian;
    if (req.body.giaoViec) task.giaoViec = req.body.giaoViec;
    if (req.body.ghiChu !== undefined) task.ghiChu = req.body.ghiChu;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete monthly task
router.delete('/:id', async (req, res) => {
  try {
    const task = await MonthlyTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    await task.deleteOne();
    res.json({ message: 'Đã xóa công việc' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
