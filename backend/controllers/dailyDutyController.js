const DailyDuty = require('../models/DailyDuty');

// [POST] Thêm mới nhật ký trực
exports.createDailyDuty = async (req, res) => {
    try {
        const newDuty = new DailyDuty(req.body);
        const savedDuty = await newDuty.save();
        res.status(201).json({ success: true, data: savedDuty });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [GET] Lấy danh sách nhật ký trực (Sắp xếp ngày mới nhất lên trên)
exports.getAllDailyDuties = async (req, res) => {
    try {
        const duties = await DailyDuty.find().sort({ dutyDate: -1 });
        res.status(200).json({ success: true, data: duties });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [PUT] Cập nhật nhật ký trực
exports.updateDailyDuty = async (req, res) => {
    try {
        const updated = await DailyDuty.findByIdAndUpdate(
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

// [DELETE] Xóa nhật ký trực
exports.deleteDailyDuty = async (req, res) => {
    try {
        const deleted = await DailyDuty.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu" });
        res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// [POST] NHẬP DỮ LIỆU HÀNG LOẠT TỪ EXCEL
// ==========================================
exports.importDailyDuties = async (req, res) => {
    try {
        const dataArray = req.body; 

        // Kiểm tra xem có gửi mảng lên không và mảng có trống không
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Dữ liệu không hợp lệ hoặc file Excel trống!' 
            });
        }

        // Dùng lệnh insertMany để lưu toàn bộ mảng vào Database
        const savedData = await DailyDuty.insertMany(dataArray);

        res.status(201).json({ 
            success: true, 
            message: `Đã nhập thành công ${savedData.length} dòng dữ liệu trực ban.`,
            data: savedData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};