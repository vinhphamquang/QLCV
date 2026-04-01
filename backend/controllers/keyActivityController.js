const KeyActivity = require('../models/KeyActivity');

// [POST] Thêm mới hoạt động trọng điểm
exports.createKeyActivity = async (req, res) => {
    try {
        const newActivity = new KeyActivity(req.body);
        const savedActivity = await newActivity.save();
        res.status(201).json({ success: true, data: savedActivity });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// [GET] Lấy danh sách hoạt động kèm logic cảnh báo trước 1 tháng
exports.getAllKeyActivities = async (req, res) => {
    try {
        const activities = await KeyActivity.find().sort({ month: 1 });
        
        const now = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setDate(now.getDate() + 30); // Tính mốc 30 ngày tới

        // Thêm logic kiểm tra cảnh báo cho từng hoạt động
        const activitiesWithWarning = activities.map(activity => {
            // Kiểm tra xem có ngày nào trong mảng specificDates sắp diễn ra không
            const hasUpcomingDate = activity.specificDates.some(date => {
                const d = new Date(date);
                return d >= now && d <= oneMonthLater;
            });

            return {
                ...activity._doc,
                isWarning: hasUpcomingDate // Trả về true nếu cần cảnh báo
            };
        });

        res.status(200).json({ success: true, data: activitiesWithWarning });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// [PUT] Cập nhật hoạt động
exports.updateKeyActivity = async (req, res) => {
    try {
        const updated = await KeyActivity.findByIdAndUpdate(
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

// [DELETE] Xóa hoạt động
exports.deleteKeyActivity = async (req, res) => {
    try {
        const deleted = await KeyActivity.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu" });
        res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};