const LessonLearned = require('../models/LessonLearned');

// [POST] Thêm mới nội dung rút kinh nghiệm
exports.createLesson = async (req, res) => {
    try {
        const newLesson = new LessonLearned(req.body);
        const savedLesson = await newLesson.save();
        res.status(201).json({ success: true, data: savedLesson });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [GET] Lấy toàn bộ danh sách rút kinh nghiệm
exports.getAllLessons = async (req, res) => {
    try {
        const lessons = await LessonLearned.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: lessons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [PUT] Cập nhật nội dung rút kinh nghiệm
exports.updateLesson = async (req, res) => {
    try {
        const updated = await LessonLearned.findByIdAndUpdate(
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

// [DELETE] Xóa nội dung rút kinh nghiệm
exports.deleteLesson = async (req, res) => {
    try {
        const deleted = await LessonLearned.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu" });
        res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// ==========================================
// [POST] NHẬP DỮ LIỆU HÀNG LOẠT TỪ EXCEL
// ==========================================
exports.importLessons = async (req, res) => {
    try {
        const dataArray = req.body; 

        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ hoặc file Excel trống!' });
        }

        const savedData = await LessonLearned.insertMany(dataArray);

        res.status(201).json({ 
            success: true, 
            message: `Đã nhập thành công ${savedData.length} dòng dữ liệu rút kinh nghiệm.`,
            data: savedData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};