const express = require('express');
const router = express.Router();
const WeeklyTask = require('../models/WeeklyTask');

// Get all weekly tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await WeeklyTask.find().sort({ thoiGian: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single weekly task
router.get('/:id', async (req, res) => {
  try {
    const task = await WeeklyTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create weekly task
router.post('/', async (req, res) => {
  const task = new WeeklyTask({
    thu: req.body.thu,
    noiDungCongViec: req.body.noiDungCongViec,
    thoiGian: req.body.thoiGian,
    diaDiem: req.body.diaDiem,
    ghiChu: req.body.ghiChu,
    daHoanThanh: req.body.daHoanThanh || false
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update weekly task
router.put('/:id', async (req, res) => {
  try {
    const task = await WeeklyTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Không tìm thấy công việc' });
    }

    if (req.body.thu) task.thu = req.body.thu;
    if (req.body.noiDungCongViec) task.noiDungCongViec = req.body.noiDungCongViec;
    if (req.body.thoiGian) task.thoiGian = req.body.thoiGian;
    if (req.body.diaDiem !== undefined) task.diaDiem = req.body.diaDiem;
    if (req.body.ghiChu !== undefined) task.ghiChu = req.body.ghiChu;
    if (req.body.daHoanThanh !== undefined) task.daHoanThanh = req.body.daHoanThanh;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete weekly task
router.delete('/:id', async (req, res) => {
  try {
    const task = await WeeklyTask.findById(req.params.id);
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
