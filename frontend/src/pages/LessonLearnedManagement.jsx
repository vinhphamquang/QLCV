import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axiosClient from '../api/axiosClient';

const LessonLearnedManagement = () => {
    const [lessons, setLessons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        workTitle: '',
        experienceContent: '',
        notes: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ==========================================
    // 1. FETCH DATA
    // ==========================================
    const fetchLessons = async () => {
        try {
            // Ông nhớ đổi tên API này cho khớp với khai báo trong server.js nhé (ví dụ: '/lessons-learned' hoặc '/lessons')
            const res = await axiosClient.get('/lessons-learned'); 
            setLessons(res.data.data);
        } catch (err) {
            alert('Không thể lấy dữ liệu rút kinh nghiệm!');
        }
    };

    useEffect(() => { fetchLessons(); }, []);

    // ==========================================
    // 2. LOGIC TÌM KIẾM TƯƠNG ĐỐI
    // ==========================================
    const filteredLessons = lessons.filter(item => {
        const searchLower = searchTerm.toLowerCase();

        const title = (item.workTitle || '').toLowerCase();
        const content = (item.experienceContent || '').toLowerCase();
        const notes = (item.notes || '').toLowerCase();

        return title.includes(searchLower) ||
               content.includes(searchLower) ||
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
        setFormData({ workTitle: '', experienceContent: '', notes: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setFormData({
            workTitle: item.workTitle,
            experienceContent: item.experienceContent,
            notes: item.notes || ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ workTitle: '', experienceContent: '', notes: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axiosClient.put(`/lessons-learned/${editingId}`, formData);
            } else {
                await axiosClient.post('/lessons-learned', formData);
            }
            closeModal();
            fetchLessons();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Thầy/Cô có chắc chắn muốn xóa dữ liệu này không?')) {
            try {
                await axiosClient.delete(`/lessons-learned/${id}`);
                fetchLessons();
            } catch (err) {
                alert('Xóa thất bại!');
            }
        }
    };

    // ==========================================
    // 4. XUẤT EXCEL 
    // ==========================================
    const exportToExcel = () => {
        if (filteredLessons.length === 0) {
            alert("Không có dữ liệu để xuất!");
            return;
        }

        const dataToExport = filteredLessons.map((item, index) => ({
            "STT": index + 1,
            "Công Tác": item.workTitle,
            "Nội Dung Rút Kinh Nghiệm": item.experienceContent,
            "Ghi Chú": item.notes || ""
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Rut Kinh Nghiem");
        XLSX.writeFile(workbook, "Danh_Sach_Rut_Kinh_Nghiem.xlsx");
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

                // Map dữ liệu (Chỉ lấy chuỗi, cực kỳ an toàn)
                const formattedData = rawJsonData.map(row => ({
                    workTitle: row['Công Tác'],
                    experienceContent: row['Nội Dung Rút Kinh Nghiệm'],
                    notes: row['Ghi Chú'] || ''
                }));

                const res = await axiosClient.post('/lessons-learned/import', formattedData);

                if (res.data.success) {
                    alert(`Tuyệt vời! ${res.data.message}`);
                    fetchLessons();
                }
            } catch (error) {
                console.error(error);
                alert('Lỗi đọc file Excel. Vui lòng đảm bảo đúng cột: Công Tác, Nội Dung Rút Kinh Nghiệm, Ghi Chú');
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
                    Công Tác Cần Rút Kinh Nghiệm
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
                            placeholder="Tìm tên công tác, nội dung hoặc ghi chú..."
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
                        <span className="text-lg leading-none">+</span> Thêm Bài Học
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
                                <th className="px-6 py-4 text-base font-medium w-[25%]">Công Tác</th>
                                <th className="px-6 py-4 text-base font-medium w-[40%]">Nội Dung Rút Kinh Nghiệm</th>
                                <th className="px-6 py-4 text-base font-medium">Ghi Chú</th>
                                <th className="px-6 py-4 text-base font-medium text-center whitespace-nowrap w-36">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredLessons.length > 0 ? (
                                filteredLessons.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{index + 1}</td>
                                        <td className="px-6 py-4 text-base font-semibold text-blue-700 whitespace-pre-wrap">{item.workTitle}</td>
                                        <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a] whitespace-pre-wrap leading-relaxed">{item.experienceContent}</td>
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
                                        {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có bài học rút kinh nghiệm nào.'}
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
                                {editingId ? 'Chỉnh Sửa Bài Học' : 'Thêm Bài Học Kinh Nghiệm'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 text-3xl font-light leading-none outline-none border-none">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên công tác cần rút kinh nghiệm</label>
                                <input 
                                    name="workTitle" value={formData.workTitle} onChange={handleChange} required 
                                    placeholder="Ví dụ: Tổ chức Lễ Khai giảng..."
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung rút kinh nghiệm / Bài học</label>
                                <textarea 
                                    name="experienceContent" value={formData.experienceContent} onChange={handleChange} required rows="4" 
                                    placeholder="Phân tích lỗi sai, điểm cần cải thiện cho lần sau..."
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors resize-none" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú thêm</label>
                                <textarea 
                                    name="notes" value={formData.notes} onChange={handleChange} rows="2" 
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

export default LessonLearnedManagement;