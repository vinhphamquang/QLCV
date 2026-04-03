const ExamCheck = require('../models/ExamCheck');

// [POST] Thêm mới bản ghi
exports.createExamCheck = async (req, res) => {
    try {
        const newRecord = new ExamCheck(req.body);
        const savedRecord = await newRecord.save();
        res.status(201).json({ success: true, data: savedRecord });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [GET] Lấy danh sách tất cả bản ghi
exports.getAllExamChecks = async (req, res) => {
    try {
        const records = await ExamCheck.find().sort({ examDate: -1 }); // Mới nhất hiện lên đầu
        res.status(200).json({ success: true, data: records });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [PUT] Sửa/Cập nhật bản ghi theo ID
exports.updateExamCheck = async (req, res) => {
    try {
        const updatedRecord = await ExamCheck.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedRecord) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi" });
        }
        res.status(200).json({ success: true, data: updatedRecord });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [DELETE] Xóa bản ghi
exports.deleteExamCheck = async (req, res) => {
    try {
        const deletedRecord = await ExamCheck.findByIdAndDelete(req.params.id);
        if (!deletedRecord) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi để xóa" });
        }
        res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// ==========================================
// [POST] NHẬP DỮ LIỆU HÀNG LOẠT TỪ EXCEL
// ==========================================
exports.importExamChecks = async (req, res) => {
    try {
        const dataArray = req.body; 

        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ hoặc file Excel trống!' });
        }

        const savedData = await ExamCheck.insertMany(dataArray);

        res.status(201).json({ 
            success: true, 
            message: `Đã nhập thành công ${savedData.length} dòng dữ liệu kiểm tra đánh giá.`,
            data: savedData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};