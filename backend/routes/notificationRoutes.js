const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ ngay: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single notification
router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create notification
router.post('/', async (req, res) => {
  const notification = new Notification({
    mon: req.body.mon,
    ngay: req.body.ngay,
    noiDungConHanChe: req.body.noiDungConHanChe,
    rutKinhNghiem: req.body.rutKinhNghiem,
    ghiChu: req.body.ghiChu
  });

  try {
    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update notification
router.put('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
    }

    if (req.body.mon) notification.mon = req.body.mon;
    if (req.body.ngay) notification.ngay = req.body.ngay;
    if (req.body.noiDungConHanChe !== undefined) notification.noiDungConHanChe = req.body.noiDungConHanChe;
    if (req.body.rutKinhNghiem !== undefined) notification.rutKinhNghiem = req.body.rutKinhNghiem;
    if (req.body.ghiChu !== undefined) notification.ghiChu = req.body.ghiChu;

    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi' });
    }
    await notification.deleteOne();
    res.json({ message: 'Đã xóa bản ghi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
