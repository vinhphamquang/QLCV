import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axiosClient from '../api/axiosClient';

const TimetableManagement = () => {
    const [changes, setChanges] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [formData, setFormData] = useState({
        week: '',
        subject: '',
        applyWeek: '',
        endWeek: '',
        notificationDate: '',
        notes: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchChanges = async () => {
        try {
            const res = await axiosClient.get('/timetable-changes');
            setChanges(res.data.data);
        } catch (err) {
            alert('Không thể lấy dữ liệu thay đổi TKB!');
        }
    };

    useEffect(() => { fetchChanges(); }, []);

    const filteredChanges = changes.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        const subject = (item.subject || '').toLowerCase();
        const weekInfo = `tuần ${item.week} - áp dụng ${item.applyWeek} đến ${item.endWeek}`.toLowerCase();
        const notiDate = item.notificationDate ? new Date(item.notificationDate).toLocaleDateString('vi-VN') : '';
        const notes = (item.notes || '').toLowerCase();

        return subject.includes(searchLower) ||
            weekInfo.includes(searchLower) ||
            notiDate.includes(searchLower) ||
            notes.includes(searchLower);
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axiosClient.put(`/timetable-changes/${editingId}`, formData);
            } else {
                await axiosClient.post('/timetable-changes', formData);
            }
            closeModal();
            fetchChanges();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Thầy/Cô có chắc chắn muốn xóa dữ liệu này không?')) {
            try {
                await axiosClient.delete(`/timetable-changes/${id}`);
                fetchChanges();
            } catch (err) {
                alert('Xóa thất bại!');
            }
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        let formattedDate = '';
        if (item.notificationDate) {
            const d = new Date(item.notificationDate);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        }
        setFormData({
            week: item.week,
            subject: item.subject,
            applyWeek: item.applyWeek,
            endWeek: item.endWeek,
            notificationDate: formattedDate,
            notes: item.notes || ''
        });
        setIsModalOpen(true);
    };

    const handleOpenAdd = () => {
        setEditingId(null);
        const today = new Date().toISOString().split('T')[0];
        setFormData({ week: '', subject: '', applyWeek: '', endWeek: '', notificationDate: today, notes: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ week: '', subject: '', applyWeek: '', endWeek: '', notificationDate: '', notes: '' });
    };

    const exportToExcel = () => {
        if (filteredChanges.length === 0) return alert("Không có dữ liệu để xuất!");
        const dataToExport = filteredChanges.map((item, index) => ({
            "STT": index + 1,
            "Tuần Ghi Nhận": item.week,
            "Môn Học": item.subject,
            "Tuần Áp Dụng": item.applyWeek,
            "Tuần Kết Thúc": item.endWeek,
            "Ngày Thông Báo": item.notificationDate ? new Date(item.notificationDate).toLocaleDateString('vi-VN') : "",
            "Ghi Chú": item.notes || ""
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Thay Doi TKB");
        XLSX.writeFile(workbook, "Danh_Sach_Thay_Doi_TKB.xlsx");
    };

    const handleImportExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const rawJsonData = XLSX.utils.sheet_to_json(worksheet);
                const formattedData = rawJsonData.map(row => {
                    let parsedDate = row['Ngày Thông Báo'];
                    let finalDate = new Date(); 
                    if (parsedDate) {
                        if (typeof parsedDate === 'string' && parsedDate.includes('/')) {
                            const parts = parsedDate.split('/');
                            if (parts.length === 3) finalDate = new Date(parts[2], parts[1] - 1, parts[0], 12, 0, 0);
                        } else if (typeof parsedDate === 'number') {
                            finalDate = new Date(Math.round((parsedDate - 25569) * 86400 * 1000));
                            finalDate.setHours(12, 0, 0);
                        } else finalDate = new Date(parsedDate);
                    }
                    return {
                        week: row['Tuần Ghi Nhận'],
                        subject: row['Môn Học'],
                        applyWeek: row['Tuần Áp Dụng'],
                        endWeek: row['Tuần Kết Thúc'],
                        notificationDate: finalDate,
                        notes: row['Ghi Chú'] || ''
                    };
                });
                const res = await axiosClient.post('/timetable-changes/import', formattedData);
                if (res.data.success) { alert(`Tuyệt vời! ${res.data.message}`); fetchChanges(); }
            } catch (error) { alert('Lỗi đọc file Excel!'); } finally { e.target.value = null; }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="w-full h-full flex flex-col font-sans">
            {/* HEADER */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                <h2 className="text-2xl md:text-[2rem] font-bold text-[#2563eb] whitespace-nowrap">
                    Quản Lý Thay Đổi TKB
                </h2>

                <div className="w-full xl:flex-1 xl:max-w-lg xl:mx-4">
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-[#2563eb]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Tìm môn học, tuần, ngày thông báo..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-[#2563eb] text-sm shadow-sm transition-all bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full xl:w-auto">
                    <label className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm cursor-pointer flex items-center gap-2 text-sm transition-colors">
                        <span className="text-lg leading-none">📥</span> Nhập Excel
                        <input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} className="hidden" />
                    </label>

                    <button onClick={exportToExcel} className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm flex items-center gap-2 text-sm transition-colors">
                        <span className="text-lg leading-none">📊</span> Xuất Excel
                    </button>

                    <button onClick={handleOpenAdd} className="w-full sm:w-auto sm:flex-1 xl:flex-none justify-center bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-2.5 px-5 rounded shadow flex items-center gap-2 text-sm border-none transition-colors">
                        <span className="text-lg leading-none">+</span> Ghi Nhận Mới
                    </button>
                </div>
            </div>

            {/* BẢNG DANH SÁCH */}
            <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col relative flex-1 overflow-hidden">
                <div className="overflow-auto relative">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="sticky top-0 z-10 bg-[#3b82f6] text-white shadow-sm">
                            <tr>
                                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap">STT</th>
                                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap">Tuần Ghi Nhận</th>
                                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap">Môn Học</th>
                                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap">Áp Dụng Từ Tuần</th>
                                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap">Đến Tuần</th>
                                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap">Ngày Thông Báo</th>
                                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap">Ghi Chú</th>
                                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap text-center">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredChanges.length > 0 ? filteredChanges.map((item, index) => (
                                <tr key={item._id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{index + 1}</td>
                                    <td className="px-6 py-4 text-base font-semibold text-blue-700">Tuần {item.week}</td>
                                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{item.subject}</td>
                                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">Tuần {item.applyWeek}</td>
                                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">Tuần {item.endWeek}</td>
                                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a] whitespace-nowrap">
                                        {item.notificationDate ? new Date(item.notificationDate).toLocaleDateString('vi-VN') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a] whitespace-pre-wrap leading-relaxed">{item.notes || '-'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleEdit(item)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded text-sm font-medium border-none transition-colors">Sửa</button>
                                            <button onClick={() => handleDelete(item._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium border-none transition-colors">Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-20 text-center text-gray-500 italic">
                                        {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có dữ liệu thay đổi TKB.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-[#2453c9]">
                                {editingId ? 'Chỉnh Sửa Thay Đổi TKB' : 'Ghi Nhận Thay Đổi TKB'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 text-3xl font-light outline-none border-none leading-none">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tuần ghi nhận</label>
                                    <input name="week" type="number" value={formData.week} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Môn học thay đổi</label>
                                    <input name="subject" value={formData.subject} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tuần bắt đầu áp dụng</label>
                                    <input name="applyWeek" type="number" value={formData.applyWeek} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tuần kết thúc</label>
                                    <input name="endWeek" type="number" value={formData.endWeek} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày thông báo cho GV/HS</label>
                                <input type="date" name="notificationDate" value={formData.notificationDate} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú thêm</label>
                                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] outline-none resize-none" />
                            </div>

                            <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">Hủy Bỏ</button>
                                <button type="submit" className="px-5 py-2.5 rounded bg-[#2453c9] text-white text-sm font-medium hover:bg-blue-800 transition-colors border-none">
                                    {editingId ? 'Lưu Cập Nhật' : 'Xác Nhận Thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimetableManagement;