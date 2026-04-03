import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axiosClient from '../api/axiosClient';

const HolidayManagement = () => {
    const [holidays, setHolidays] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        content: '',
        daysCount: '',
        notes: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ==========================================
    // 1. FETCH DATA
    // ==========================================
    const fetchHolidays = async () => {
        try {
            const res = await axiosClient.get('/holidays'); // Đảm bảo đúng tên route ở server.js
            setHolidays(res.data.data);
        } catch (err) {
            alert('Không thể lấy dữ liệu ngày nghỉ!');
        }
    };

    useEffect(() => { fetchHolidays(); }, []);

    // ==========================================
    // 2. LOGIC TÌM KIẾM TƯƠNG ĐỐI
    // ==========================================
    const filteredHolidays = holidays.filter(item => {
        const searchLower = searchTerm.toLowerCase();

        const content = (item.content || '').toLowerCase();
        const days = String(item.daysCount || '').toLowerCase();
        const notes = (item.notes || '').toLowerCase();

        return content.includes(searchLower) ||
               days.includes(searchLower) ||
               notes.includes(searchLower);
    });

    // ==========================================
    // 3. XỬ LÝ FORM
    // ==========================================
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOpenAdd = () => {
        setEditingId(null);
        setFormData({ content: '', daysCount: '', notes: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setFormData({
            content: item.content,
            daysCount: item.daysCount,
            notes: item.notes || ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ content: '', daysCount: '', notes: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axiosClient.put(`/holidays/${editingId}`, formData);
            } else {
                await axiosClient.post('/holidays', formData);
            }
            closeModal();
            fetchHolidays();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Thầy/Cô có chắc chắn muốn xóa ngày nghỉ này không?')) {
            try {
                await axiosClient.delete(`/holidays/${id}`);
                fetchHolidays();
            } catch (err) {
                alert('Xóa thất bại!');
            }
        }
    };

    // ==========================================
    // 4. XUẤT EXCEL 
    // ==========================================
    const exportToExcel = () => {
        if (filteredHolidays.length === 0) {
            alert("Không có dữ liệu để xuất!");
            return;
        }

        const dataToExport = filteredHolidays.map((item, index) => ({
            "STT": index + 1,
            "Nội Dung Ngày Nghỉ": item.content,
            "Số Ngày Nghỉ": item.daysCount,
            "Ghi Chú": item.notes || ""
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ngay Nghi");
        XLSX.writeFile(workbook, "Danh_Sach_Ngay_Nghi.xlsx");
    };

    // ==========================================
    // 5. NHẬP EXCEL
    // ==========================================
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

                // Map dữ liệu (Cực kỳ đơn giản vì không có xử lý Date)
                const formattedData = rawJsonData.map(row => ({
                    content: row['Nội Dung Ngày Nghỉ'],
                    daysCount: row['Số Ngày Nghỉ'],
                    notes: row['Ghi Chú'] || ''
                }));

                const res = await axiosClient.post('/holidays/import', formattedData);

                if (res.data.success) {
                    alert(`Tuyệt vời! ${res.data.message}`);
                    fetchHolidays();
                }
            } catch (error) {
                console.error(error);
                alert('Lỗi đọc file Excel. Vui lòng đảm bảo đúng cột: Nội Dung Ngày Nghỉ, Số Ngày Nghỉ, Ghi Chú');
            } finally {
                e.target.value = null;
            }
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="p-4 md:p-8 max-w-full mx-auto font-sans bg-transparent">

            {/* HEADER */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                <h2 className="text-2xl md:text-[2rem] font-bold text-[#2563eb] whitespace-nowrap">
                    Quản Lý Ngày Nghỉ
                </h2>

                {/* THANH TÌM KIẾM */}
                <div className="w-full xl:flex-1 xl:max-w-lg xl:mx-4">
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-[#2563eb] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm nội dung, số ngày, ghi chú..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-[#2563eb] text-sm shadow-sm transition-all bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* CỤM NÚT BẤM */}
                <div className="flex flex-wrap gap-3 w-full xl:w-auto">
                    <label className="flex-1 xl:flex-none justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-5 rounded shadow transition-colors flex items-center gap-2 text-sm cursor-pointer border-none outline-none">
                        <span className="text-lg leading-none">📥</span> Nhập Excel
                        <input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} className="hidden" />
                    </label>

                    <button onClick={exportToExcel} className="flex-1 xl:flex-none justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded shadow transition-colors flex items-center gap-2 text-sm border-none outline-none">
                        <span className="text-lg leading-none">📊</span> Xuất Excel
                    </button>

                    <button onClick={handleOpenAdd} className="w-full sm:w-auto sm:flex-1 xl:flex-none justify-center bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-2.5 px-5 rounded shadow transition-colors flex items-center gap-2 text-sm border-none outline-none">
                        <span className="text-lg leading-none">+</span> Thêm Ngày Nghỉ
                    </button>
                </div>
            </div>

            {/* BẢNG DANH SÁCH */}
            <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col h-[600px] relative">
                <div className="overflow-auto flex-1 relative">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="sticky top-0 z-10 bg-[linear-gradient(135deg,#2563eb_0%,#1e40af_100%)] text-white shadow-md">
                            <tr>
                                <th className="px-6 py-4 text-base font-medium whitespace-nowrap w-16">STT</th>
                                <th className="px-6 py-4 text-base font-medium w-[30%]">Nội Dung Ngày Nghỉ</th>
                                <th className="px-6 py-4 text-base font-medium whitespace-nowrap">Số Ngày Nghỉ</th>
                                <th className="px-6 py-4 text-base font-medium w-[30%]">Ghi Chú</th>
                                <th className="px-6 py-4 text-base font-medium text-center whitespace-nowrap w-36">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredHolidays.length > 0 ? (
                                filteredHolidays.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{index + 1}</td>
                                        <td className="px-6 py-4 text-base font-[450] text-blue-700 font-semibold whitespace-pre-wrap">{item.content}</td>
                                        <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a] font-medium">{item.daysCount} ngày</td>
                                        <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a] whitespace-pre-wrap">{item.notes}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleEdit(item)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors border-none outline-none">Sửa</button>
                                                <button onClick={() => handleDelete(item._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors border-none outline-none">Xóa</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500 italic text-sm">
                                        {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có dữ liệu ngày nghỉ.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL POPUP FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-xl rounded-lg shadow-xl overflow-hidden animate-fade-in">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-[#2453c9]">
                                {editingId ? 'Chỉnh Sửa Ngày Nghỉ' : 'Thêm Ngày Nghỉ Mới'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 text-3xl font-light leading-none outline-none border-none">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung ngày nghỉ</label>
                                <input 
                                    name="content" value={formData.content} onChange={handleChange} required 
                                    placeholder="Ví dụ: Nghỉ Lễ 30/4 - 1/5..."
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số ngày nghỉ</label>
                                <input 
                                    name="daysCount" type="number" min="1" value={formData.daysCount} onChange={handleChange} required 
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú thêm</label>
                                <textarea 
                                    name="notes" value={formData.notes} onChange={handleChange} rows="3" 
                                    placeholder="Ví dụ: Lịch đi làm bù..."
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors resize-none" 
                                />
                            </div>

                            <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors outline-none">
                                    Hủy Bỏ
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded bg-[#2453c9] text-white text-sm font-medium hover:bg-blue-800 transition-colors outline-none border-none">
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

export default HolidayManagement;