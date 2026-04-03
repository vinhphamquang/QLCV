import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axiosClient from '../api/axiosClient';

const ExamCheckManagement = () => {
    const [records, setRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        subject: '',
        examDate: '',
        limitations: '',
        experience: '',
        notes: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchRecords = async () => {
        try {
            const res = await axiosClient.get('/examCheck'); // Sửa đúng đường dẫn API của ông nhé
            setRecords(res.data.data);
        } catch (err) {
            alert('Không thể lấy dữ liệu kiểm tra đánh giá!');
        }
    };

    useEffect(() => { fetchRecords(); }, []);

    // ==========================================
    // LOGIC TÌM KIẾM TƯƠNG ĐỐI
    // ==========================================
    const filteredRecords = records.filter(item => {
        const searchLower = searchTerm.toLowerCase();

        const subject = (item.subject || '').toLowerCase();
        const dateStr = item.examDate ? new Date(item.examDate).toLocaleDateString('vi-VN') : '';
        const limitations = (item.limitations || '').toLowerCase();
        const experience = (item.experience || '').toLowerCase();
        const notes = (item.notes || '').toLowerCase();

        return subject.includes(searchLower) ||
            dateStr.includes(searchLower) ||
            limitations.includes(searchLower) ||
            experience.includes(searchLower) ||
            notes.includes(searchLower);
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axiosClient.put(`/examCheck/${editingId}`, formData);
            } else {
                await axiosClient.post('/examCheck', formData);
            }
            closeModal();
            fetchRecords();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Thầy/Cô có chắc chắn muốn xóa đánh giá này không?')) {
            try {
                await axiosClient.delete(`/examCheck/${id}`);
                fetchRecords();
            } catch (err) {
                alert('Xóa thất bại!');
            }
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        
        let formattedDate = '';
        if (item.examDate) {
            const d = new Date(item.examDate);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        }

        setFormData({
            subject: item.subject,
            examDate: formattedDate,
            limitations: item.limitations || '',
            experience: item.experience || '',
            notes: item.notes || ''
        });
        setIsModalOpen(true);
    };

    const handleOpenAdd = () => {
        setEditingId(null);
        const today = new Date().toISOString().split('T')[0];
        setFormData({ subject: '', examDate: today, limitations: '', experience: '', notes: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ subject: '', examDate: '', limitations: '', experience: '', notes: '' });
    };

    // ==========================================
    // XỬ LÝ XUẤT EXCEL 
    // ==========================================
    const exportToExcel = () => {
        if (filteredRecords.length === 0) {
            alert("Không có dữ liệu để xuất!");
            return;
        }

        const dataToExport = filteredRecords.map((item, index) => ({
            "STT": index + 1,
            "Ngày Kiểm Tra": item.examDate ? new Date(item.examDate).toLocaleDateString('vi-VN') : "",
            "Môn Học": item.subject,
            "Hạn Chế": item.limitations || "",
            "Rút Kinh Nghiệm": item.experience || "",
            "Ghi Chú": item.notes || ""
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "KT Đánh Giá");
        XLSX.writeFile(workbook, "Danh_Sach_Kiem_Tra_Danh_Gia.xlsx");
    };

    // ==========================================
    // XỬ LÝ NHẬP EXCEL
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

                const formattedData = rawJsonData.map(row => {
                    let parsedDate = row['Ngày Kiểm Tra'];
                    let finalDate = new Date(); 
                    
                    if (parsedDate) {
                        if (typeof parsedDate === 'string' && parsedDate.includes('/')) {
                            const parts = parsedDate.split('/');
                            if (parts.length === 3) {
                                finalDate = new Date(parts[2], parts[1] - 1, parts[0], 12, 0, 0);
                            }
                        } else if (typeof parsedDate === 'number') {
                            finalDate = new Date(Math.round((parsedDate - 25569) * 86400 * 1000));
                            finalDate.setHours(12, 0, 0);
                        } else {
                            finalDate = new Date(parsedDate);
                        }
                    }

                    return {
                        examDate: finalDate,
                        subject: row['Môn Học'],
                        limitations: row['Hạn Chế'] || '',
                        experience: row['Rút Kinh Nghiệm'] || '',
                        notes: row['Ghi Chú'] || ''
                    };
                });

                const res = await axiosClient.post('/examCheck/import', formattedData);

                if (res.data.success) {
                    alert(`Tuyệt vời! ${res.data.message}`);
                    fetchRecords();
                }
            } catch (error) {
                console.error(error);
                alert('Có lỗi xảy ra. Vui lòng đảm bảo file Excel đúng các cột: Ngày Kiểm Tra, Môn Học, Hạn Chế, Rút Kinh Nghiệm, Ghi Chú');
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
                    Kiểm Tra & Đánh Giá
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
                            placeholder="Tìm kiếm môn học, hạn chế, rút kinh nghiệm..."
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
                        <span className="text-lg leading-none">+</span> Ghi Nhận Mới
                    </button>
                </div>
            </div>

            {/* BẢNG DANH SÁCH */}
            <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col h-[600px] relative">
                <div className="overflow-auto flex-1 relative">
                    {/* Bảng này có nhiều cột chữ dài, nên min-w-[1000px] là hợp lý */}
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="sticky top-0 z-10 bg-[linear-gradient(135deg,#2563eb_0%,#1e40af_100%)] text-white shadow-md">
                            <tr>
                                <th className="px-6 py-4 text-base font-medium whitespace-nowrap w-16">STT</th>
                                <th className="px-6 py-4 text-base font-medium whitespace-nowrap w-36">Ngày KT</th>
                                <th className="px-6 py-4 text-base font-medium whitespace-nowrap w-36">Môn Học</th>
                                <th className="px-6 py-4 text-base font-medium w-[25%]">Nội Dung Hạn Chế</th>
                                <th className="px-6 py-4 text-base font-medium w-[25%]">Rút Kinh Nghiệm</th>
                                <th className="px-6 py-4 text-base font-medium">Ghi Chú</th>
                                <th className="px-6 py-4 text-base font-medium text-center whitespace-nowrap w-36">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{index + 1}</td>
                                        <td className="px-6 py-4 text-base font-[450] text-blue-700 font-semibold whitespace-nowrap">
                                            {item.examDate ? new Date(item.examDate).toLocaleDateString('vi-VN') : ''}
                                        </td>
                                        <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{item.subject}</td>
                                        <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a] whitespace-pre-wrap">{item.limitations}</td>
                                        <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a] whitespace-pre-wrap">{item.experience}</td>
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
                                    <td colSpan="7" className="px-6 py-20 text-center text-gray-500 italic text-sm">
                                        {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có dữ liệu kiểm tra đánh giá.'}
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
                    <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden animate-fade-in">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-[#2453c9]">
                                {editingId ? 'Chỉnh Sửa Đánh Giá' : 'Ghi Nhận Đánh Giá Mới'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 text-3xl font-light leading-none outline-none border-none">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày kiểm tra</label>
                                    <input type="date" name="examDate" value={formData.examDate} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Môn học</label>
                                    <input name="subject" value={formData.subject} onChange={handleChange} required placeholder="Ví dụ: Toán, Văn..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung hạn chế</label>
                                <textarea name="limitations" value={formData.limitations} onChange={handleChange} rows="3" placeholder="Ghi nhận các điểm chưa tốt trong bài kiểm tra..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Rút kinh nghiệm / Giải pháp</label>
                                <textarea name="experience" value={formData.experience} onChange={handleChange} rows="3" placeholder="Bài học rút ra hoặc giải pháp khắc phục..." className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú thêm</label>
                                <input name="notes" value={formData.notes} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors" />
                            </div>

                            <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors outline-none">Hủy Bỏ</button>
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

export default ExamCheckManagement;