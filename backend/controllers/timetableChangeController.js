const TimetableChange = require('../models/TimetableChange');

// [POST] Thêm mới thay đổi TKB
exports.createTimetableChange = async (req, res) => {
    try {
        const newChange = new TimetableChange(req.body);
        const savedChange = await newChange.save();
        res.status(201).json({ success: true, data: savedChange });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [GET] Lấy danh sách thay đổi TKB
exports.getAllTimetableChanges = async (req, res) => {
    try {
        const list = await TimetableChange.find().sort({ applyWeek: -1 });
        res.status(200).json({ success: true, data: list });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [PUT] Cập nhật thay đổi TKB
exports.updateTimetableChange = async (req, res) => {
    try {
        const updated = await TimetableChange.findByIdAndUpdate(
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

// [DELETE] Xóa thay đổi TKB
exports.deleteTimetableChange = async (req, res) => {
    try {
        const deleted = await TimetableChange.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu" });
        res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};