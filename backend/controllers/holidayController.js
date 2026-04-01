const Holiday = require('../models/Holiday');

// [POST] Thêm mới ngày nghỉ
exports.createHoliday = async (req, res) => {
    try {
        const newHoliday = new Holiday(req.body);
        const savedHoliday = await newHoliday.save();
        res.status(201).json({ success: true, data: savedHoliday });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [GET] Lấy danh sách tất cả ngày nghỉ
exports.getAllHolidays = async (req, res) => {
    try {
        const holidays = await Holiday.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: holidays });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [PUT] Cập nhật thông tin ngày nghỉ
exports.updateHoliday = async (req, res) => {
    try {
        const updated = await Holiday.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu" });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [DELETE] Xóa ngày nghỉ
exports.deleteHoliday = async (req, res) => {
    try {
        const deleted = await Holiday.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu" });
        res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};