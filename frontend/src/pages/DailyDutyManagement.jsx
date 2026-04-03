import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axiosClient from '../api/axiosClient';

const DailyDutyManagement = () => {
    const [duties, setDuties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        dutyDate: '',
        evaluationContent: '',
        notes: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchDuties = async () => {
        try {
            const res = await axiosClient.get('/daily-duties');
            setDuties(res.data.data);
        } catch (err) {
            alert('Không thể lấy dữ liệu trực ban!');
        }
    };

    useEffect(() => { fetchDuties(); }, []);

    const filteredDuties = duties.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        const dateStr = new Date(item.dutyDate).toLocaleDateString('vi-VN');
        const content = item.evaluationContent.toLowerCase();
        const notes = (item.notes || '').toLowerCase();
        return dateStr.includes(searchLower) || content.includes(searchLower) || notes.includes(searchLower);
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleOpenAdd = () => {
        setEditingId(null);
        const today = new Date().toISOString().split('T')[0];
        setFormData({ dutyDate: today, evaluationContent: '', notes: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        let formattedDate = '';
        if (item.dutyDate) {
            const d = new Date(item.dutyDate);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        }
        setFormData({ dutyDate: formattedDate, evaluationContent: item.evaluationContent, notes: item.notes || '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ dutyDate: '', evaluationContent: '', notes: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) await axiosClient.put(`/daily-duties/${editingId}`, formData);
            else await axiosClient.post('/daily-duties', formData);
            closeModal();
            fetchDuties();
        } catch (err) { alert(err.response?.data?.message || 'Có lỗi xảy ra!'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Thầy/Cô có chắc chắn muốn xóa nhật ký này không?')) {
            try {
                await axiosClient.delete(`/daily-duties/${id}`);
                fetchDuties();
            } catch (err) { alert('Xóa thất bại!'); }
        }
    };

    const exportToExcel = () => {
        if (filteredDuties.length === 0) return alert("Không có dữ liệu để xuất!");
        const dataToExport = filteredDuties.map((item, index) => ({
            "STT": index + 1,
            "Ngày Trực": new Date(item.dutyDate).toLocaleDateString('vi-VN'),
            "Nội Dung Xét": item.evaluationContent,
            "Ghi Chú": item.notes || ""
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Nhật Ký Trực");
        XLSX.writeFile(workbook, "Nhat_Ky_Truc_Ban.xlsx");
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
                    let parsedDate = row['Ngày Trực'];
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
                    return { dutyDate: finalDate, evaluationContent: row['Nội Dung Xét'] || 'Chưa cập nhật', notes: row['Ghi Chú'] || '' };
                });
                const res = await axiosClient.post('/daily-duties/import', formattedData);
                if (res.data.success) { alert(`Tuyệt vời! ${res.data.message}`); fetchDuties(); }
            } catch (error) { alert('Lỗi đọc file Excel!'); } finally { e.target.value = null; }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="p-4 md:p-8 max-w-full mx-auto font-sans bg-transparent">
            {/* HEADER: Responsive cho cả Máy tính & Điện thoại */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                
                {/* Tiêu đề */}
                <h2 className="text-2xl md:text-[2rem] font-bold text-[#2563eb] whitespace-nowrap">
                    Quản lý trực ngày
                </h2>

                {/* Thanh tìm kiếm: Cố định khoảng cách trên PC, Full width trên Mobile */}
                <div className="w-full xl:flex-1 xl:max-w-lg xl:mx-4">
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input 
                            type="text"
                            placeholder="Tìm kiếm ngày, nội dung hoặc ghi chú..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-[#2563eb] text-sm shadow-sm transition-all bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Cụm Nút bấm: Dàn ngang trên PC, bẻ dòng trên Mobile */}
                <div className="flex flex-wrap gap-3 w-full xl:w-auto">
                    <label className="flex-1 xl:flex-none justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-5 rounded shadow cursor-pointer flex items-center gap-2 text-sm transition-colors border-none outline-none">
                        <span className="text-lg">📥</span> Nhập Excel
                        <input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} className="hidden" />
                    </label>

                    <button onClick={exportToExcel} className="flex-1 xl:flex-none justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded shadow flex items-center gap-2 text-sm transition-colors border-none outline-none">
                        <span className="text-lg">📊</span> Xuất Excel
                    </button>

                    <button onClick={handleOpenAdd} className="w-full sm:w-auto sm:flex-1 xl:flex-none justify-center bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-2.5 px-5 rounded shadow flex items-center gap-2 text-sm transition-colors border-none outline-none">
                        <span className="text-lg">+</span> Thêm Nhật Ký
                    </button>
                </div>
            </div>

            {/* BẢNG DANH SÁCH: Kỹ thuật Scroll trong khung cố định */}
            <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col h-[600px] relative"> 
                {/* h-[600px] chính là thứ giúp trang web của ông không bao giờ bị giật chiều cao */}
                
                <div className="overflow-auto flex-1 relative">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        {/* THẺ THEAD ĐƯỢC GHIM (STICKY) */}
                        <thead className="sticky top-0 z-10 bg-[linear-gradient(135deg,#2563eb_0%,#1e40af_100%)] text-white shadow-md">
                            <tr>
                                <th className="px-6 py-4 text-base font-medium">STT</th>
                                <th className="px-6 py-4 text-base font-medium whitespace-nowrap">Ngày Trực</th>
                                <th className="px-6 py-4 text-base font-medium">Nội Dung Xét</th>
                                <th className="px-6 py-4 text-base font-medium">Ghi Chú</th>
                                <th className="px-6 py-4 text-base font-medium text-center whitespace-nowrap">Thao Tác</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-200">
                            {filteredDuties.length > 0 ? filteredDuties.map((item, index) => (
                                <tr key={item._id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{index + 1}</td>
                                    <td className="px-6 py-4 font-semibold text-blue-800 whitespace-nowrap">
                                        {new Date(item.dutyDate).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a] whitespace-pre-wrap">{item.evaluationContent}</td>
                                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{item.notes}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleEdit(item)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded text-sm font-medium border-none outline-none">Sửa</button>
                                            <button onClick={() => handleDelete(item._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium border-none outline-none">Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500 italic">
                                        {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có dữ liệu trực ban.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL POPUP (Giữ nguyên) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden animate-fade-in">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-[#2453c9]">
                                {editingId ? 'Chỉnh Sửa Nhật Ký' : 'Thêm Nhật Ký Mới'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 text-3xl font-light leading-none">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày trực</label>
                                <input type="date" name="dutyDate" value={formData.dutyDate} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung xét (Đánh giá)</label>
                                <textarea name="evaluationContent" value={formData.evaluationContent} onChange={handleChange} required rows="5" placeholder="Ví dụ: Lớp 9A1 vi phạm đồng phục..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú thêm</label>
                                <input name="notes" value={formData.notes} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] outline-none" />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 mt-6">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 border rounded hover:bg-gray-50 text-sm font-medium">Hủy bỏ</button>
                                <button type="submit" className="px-5 py-2.5 bg-[#2453c9] text-white rounded hover:bg-blue-800 text-sm font-medium">{editingId ? 'Lưu thay đổi' : 'Xác nhận thêm'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyDutyManagement;