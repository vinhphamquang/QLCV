const AssignmentChange = require('../models/AssignmentChange');

// [POST] Thêm mới thay đổi phân công
exports.createAssignmentChange = async (req, res) => {
    try {
        const newAssignment = new AssignmentChange(req.body);
        const savedAssignment = await newAssignment.save();
        res.status(201).json({ success: true, data: savedAssignment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [GET] Lấy danh sách tất cả thay đổi
exports.getAllAssignmentChanges = async (req, res) => {
    try {
        const list = await AssignmentChange.find().sort({ startWeek: 1 }); // Sắp xếp theo tuần bắt đầu
        res.status(200).json({ success: true, data: list });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [PUT] Cập nhật thay đổi theo ID
exports.updateAssignmentChange = async (req, res) => {
    try {
        const updated = await AssignmentChange.findByIdAndUpdate(
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

// [DELETE] Xóa thay đổi
exports.deleteAssignmentChange = async (req, res) => {
    try {
        const deleted = await AssignmentChange.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy để xóa" });
        res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};