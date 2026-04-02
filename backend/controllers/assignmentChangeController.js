const AssignmentChange = require('../models/AssignmentChange');

// [POST] Thêm mới thay đổi phân công
exports.createAssignmentChange = async (req, res) => {
    try {
        const { startWeek, endWeek } = req.body;

        // 1. CHỐT CHẶN LOGIC: Kiểm tra tuần
        if (parseInt(startWeek) > parseInt(endWeek)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Tuần kết thúc phải lớn hơn hoặc bằng tuần bắt đầu!' 
            });
        }

        // 2. Pass qua chốt thì mới lưu
        const newAssignment = new AssignmentChange(req.body);
        const savedAssignment = await newAssignment.save();
        res.status(201).json({ success: true, data: savedAssignment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [GET] Lấy danh sách tất cả thay đổi (Giữ nguyên của ông - Chuẩn rồi)
exports.getAllAssignmentChanges = async (req, res) => {
    try {
        const list = await AssignmentChange.find().sort({ startWeek: 1 });
        res.status(200).json({ success: true, data: list });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [PUT] Cập nhật thay đổi theo ID
exports.updateAssignmentChange = async (req, res) => {
    try {
        const { startWeek, endWeek } = req.body;

        // 1. CHỐT CHẶN LOGIC: 
        // Phải kiểm tra xem người dùng có gửi lên 2 trường này không (tránh lỗi khi họ chỉ update mỗi dòng ghi chú)
        if (startWeek !== undefined && endWeek !== undefined) {
            if (parseInt(startWeek) > parseInt(endWeek)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Tuần kết thúc phải lớn hơn hoặc bằng tuần bắt đầu!' 
                });
            }
        }

        // 2. Pass qua chốt thì mới cho cập nhật
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

// [DELETE] Xóa thay đổi (Giữ nguyên của ông - Chuẩn rồi)
exports.deleteAssignmentChange = async (req, res) => {
    try {
        const deleted = await AssignmentChange.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy để xóa" });
        res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// [POST] Nhập dữ liệu hàng loạt từ Excel
exports.importAssignments = async (req, res) => {
  try {
    const dataArray = req.body; // Frontend sẽ gửi lên một mảng các object

    // Kiểm tra xem có gửi mảng lên không
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ hoặc trống!' });
    }

    // (Tùy chọn) Ông có thể viết vòng lặp để kiểm tra logic từng dòng ở đây
    // Ví dụ: check startWeek <= endWeek cho từng object trong dataArray

    // Dùng lệnh insertMany của Mongoose để lưu toàn bộ mảng vào Database cực nhanh
    const savedData = await AssignmentChange.insertMany(dataArray);

    res.status(201).json({ 
      success: true, 
      message: `Đã nhập thành công ${savedData.length} dòng dữ liệu!`,
      data: savedData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};