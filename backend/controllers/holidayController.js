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
// ==========================================
// [POST] NHẬP DỮ LIỆU HÀNG LOẠT TỪ EXCEL
// ==========================================
exports.importHolidays = async (req, res) => {
    try {
        const dataArray = req.body; 

        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ hoặc file Excel trống!' });
        }

        const savedData = await Holiday.insertMany(dataArray);

        res.status(201).json({ 
            success: true, 
            message: `Đã nhập thành công ${savedData.length} dòng dữ liệu ngày nghỉ.`,
            data: savedData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};