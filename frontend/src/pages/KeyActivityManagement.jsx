import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axiosClient from '../api/axiosClient';

const KeyActivityManagement = () => {
    const [activities, setActivities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        month: '',
        specificDates: [''], // Khởi tạo mảng có 1 phần tử rỗng để hiện 1 ô input ban đầu
        responsibleDept: '',
        coordinatingDept: '',
        notes: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchActivities = async () => {
        try {
            const res = await axiosClient.get('/key-activities'); 
            setActivities(res.data.data);
        } catch (err) {
            alert('Không thể lấy dữ liệu hoạt động!');
        }
    };

    useEffect(() => { fetchActivities(); }, []);

    // ==========================================
    // LOGIC TÌM KIẾM TƯƠNG ĐỐI
    // ==========================================
    const filteredActivities = activities.filter(item => {
        const searchLower = searchTerm.toLowerCase();

        const monthStr = `tháng ${item.month}`.toLowerCase();
        const datesStr = item.specificDates.map(d => new Date(d).toLocaleDateString('vi-VN')).join(', ');
        const respDept = (item.responsibleDept || '').toLowerCase();
        const coordDept = (item.coordinatingDept || '').toLowerCase();
        const notes = (item.notes || '').toLowerCase();

        return monthStr.includes(searchLower) ||
               datesStr.includes(searchLower) ||
               respDept.includes(searchLower) ||
               coordDept.includes(searchLower) ||
               notes.includes(searchLower);
    });

    // ==========================================
    // XỬ LÝ FORM VÀ MẢNG NGÀY THÁNG
    // ==========================================
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Cập nhật 1 ngày cụ thể trong mảng
    const handleDateChange = (index, value) => {
        const newDates = [...formData.specificDates];
        newDates[index] = value;
        setFormData({ ...formData, specificDates: newDates });
    };

    // Thêm ô nhập ngày mới
    const addDateInput = () => {
        setFormData({ ...formData, specificDates: [...formData.specificDates, ''] });
    };

    // Xóa bớt ô nhập ngày
    const removeDateInput = (index) => {
        const newDates = formData.specificDates.filter((_, i) => i !== index);
        setFormData({ ...formData, specificDates: newDates });
    };

    const handleOpenAdd = () => {
        setEditingId(null);
        setFormData({ month: '', specificDates: [''], responsibleDept: '', coordinatingDept: '', notes: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        
        // Đổi mảng ISO string thành mảng YYYY-MM-DD để nhét vào thẻ input type="date"
        const formattedDates = item.specificDates.map(d => {
            const dt = new Date(d);
            return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
        });

        setFormData({
            month: item.month,
            specificDates: formattedDates.length > 0 ? formattedDates : [''],
            responsibleDept: item.responsibleDept,
            coordinatingDept: item.coordinatingDept || '',
            notes: item.notes || ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ month: '', specificDates: [''], responsibleDept: '', coordinatingDept: '', notes: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Lọc bỏ những ô ngày bị bỏ trống trước khi gửi xuống Backend
        const cleanedData = {
            ...formData,
            specificDates: formData.specificDates.filter(d => d.trim() !== '')
        };

        if (cleanedData.specificDates.length === 0) {
            alert('Vui lòng chọn ít nhất một ngày cụ thể!');
            return;
        }

        try {
            if (editingId) {
                await axiosClient.put(`/key-activities/${editingId}`, cleanedData);
            } else {
                await axiosClient.post('/key-activities', cleanedData);
            }
            closeModal();
            fetchActivities();
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Thầy/Cô có chắc chắn muốn xóa hoạt động này không?')) {
            try {
                await axiosClient.delete(`/key-activities/${id}`);
                fetchActivities();
            } catch (err) {
                alert('Xóa thất bại!');
            }
        }
    };

    // ==========================================
    // XUẤT EXCEL 
    // ==========================================
    const exportToExcel = () => {
        if (filteredActivities.length === 0) {
            alert("Không có dữ liệu để xuất!");
            return;
        }

        const dataToExport = filteredActivities.map((item, index) => ({
            "STT": index + 1,
            "Tháng": `Tháng ${item.month}`,
            "Các Ngày Cụ Thể": item.specificDates.map(d => new Date(d).toLocaleDateString('vi-VN')).join(', '),
            "Chịu Trách Nhiệm": item.responsibleDept,
            "Phối Hợp": item.coordinatingDept || "",
            "Ghi Chú": item.notes || "",
            "Tình Trạng": item.isWarning ? "Sắp diễn ra" : "Bình thường"
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Hoat Dong Trong Diem");
        XLSX.writeFile(workbook, "Danh_Sach_Hoat_Dong_Trong_Diem.xlsx");
    };

    // ==========================================
    // NHẬP EXCEL
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
                    // Xử lý cột "Tháng" (Lọc lấy số nếu họ nhập "Tháng 5")
                    let monthVal = String(row['Tháng']).replace(/\D/g, ''); 

                    // Thuật toán tách chuỗi ngày: "12/04/2026, 15/04/2026" -> [Date, Date]
                    let datesStr = row['Các Ngày Cụ Thể'] || '';
                    let parsedDates = [];
                    
                    if (typeof datesStr === 'string') {
                        const parts = datesStr.split(/[,;\n]/); // Cắt bằng dấu phẩy, chấm phẩy hoặc xuống dòng
                        parts.forEach(p => {
                            let d = p.trim();
                            if(d && d.includes('/')) {
                                const dParts = d.split('/');
                                if(dParts.length === 3) {
                                    parsedDates.push(new Date(dParts[2], dParts[1] - 1, dParts[0], 12, 0, 0));
                                }
                            }
                        });
                    } else if (typeof datesStr === 'number') { // Nếu Excel ép thành 1 ngày chuẩn
                        let finalDate = new Date(Math.round((datesStr - 25569) * 86400 * 1000));
                        finalDate.setHours(12, 0, 0);
                        parsedDates.push(finalDate);
                    }

                    return {
                        month: parseInt(monthVal) || 1,
                        specificDates: parsedDates.length > 0 ? parsedDates : [new Date()],
                        responsibleDept: row['Chịu Trách Nhiệm'] || 'Chưa cập nhật',
                        coordinatingDept: row['Phối Hợp'] || '',
                        notes: row['Ghi Chú'] || ''
                    };
                });

                const res = await axiosClient.post('/key-activities/import', formattedData);

                if (res.data.success) {
                    alert(`Tuyệt vời! ${res.data.message}`);
                    fetchActivities();
                }
            } catch (error) {
                console.error(error);
                alert('Lỗi đọc file Excel. Vui lòng đảm bảo đúng cột: Tháng, Các Ngày Cụ Thể, Chịu Trách Nhiệm, Phối Hợp, Ghi Chú');
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
                    Hoạt Động Trọng Điểm
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
                            placeholder="Tìm kiếm tháng, ngày, bộ phận phụ trách..."
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
                        <span className="text-lg leading-none">+</span> Thêm Hoạt Động
                    </button>
                </div>
            </div>

            {/* BẢNG DANH SÁCH */}
            <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col h-[600px] relative">
                <div className="overflow-auto flex-1 relative">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="sticky top-0 z-10 bg-[linear-gradient(135deg,#2563eb_0%,#1e40af_100%)] text-white shadow-md">
                            <tr>
                                <th className="px-6 py-4 text-base font-medium whitespace-nowrap w-16">STT</th>
                                <th className="px-6 py-4 text-base font-medium whitespace-nowrap">Thời Gian</th>
                                <th className="px-6 py-4 text-base font-medium w-[20%]">Bộ Phận Phụ Trách</th>
                                <th className="px-6 py-4 text-base font-medium w-[20%]">Phối Hợp</th>
                                <th className="px-6 py-4 text-base font-medium">Ghi Chú</th>
                                <th className="px-6 py-4 text-base font-medium text-center whitespace-nowrap w-36">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredActivities.length > 0 ? (
                                filteredActivities.map((item, index) => (
                                    // Highlight nền vàng nhạt nếu isWarning = true
                                    <tr key={item._id} className={`hover:bg-blue-50/50 transition-colors ${item.isWarning ? 'bg-amber-50/80' : ''}`}>
                                        <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">
                                            {item.isWarning ? <span className="text-amber-500 mr-2" title="Sắp diễn ra">⚠️</span> : ''}
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-blue-700 mb-1">Tháng {item.month}</div>
                                            <div className="text-sm font-[450] text-gray-600">
                                                {item.specificDates.map(d => new Date(d).toLocaleDateString('vi-VN')).join(', ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a] font-medium">{item.responsibleDept}</td>
                                        <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{item.coordinatingDept}</td>
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
                                    <td colSpan="6" className="px-6 py-20 text-center text-gray-500 italic text-sm">
                                        {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có hoạt động trọng điểm nào.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL POPUP FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden animate-fade-in my-8">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-[#2453c9]">
                                {editingId ? 'Chỉnh Sửa Hoạt Động' : 'Thêm Hoạt Động Mới'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 text-3xl font-light leading-none outline-none border-none">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tháng diễn ra (1-12)</label>
                                <input 
                                    name="month" type="number" min="1" max="12" value={formData.month} onChange={handleChange} required 
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors" 
                                />
                            </div>

                            {/* Khu vực nhập Mảng Ngày cụ thể */}
                            <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Các ngày cụ thể diễn ra</label>
                                {formData.specificDates.map((date, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input 
                                            type="date" 
                                            value={date} 
                                            onChange={(e) => handleDateChange(index, e.target.value)} 
                                            required 
                                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9]" 
                                        />
                                        {formData.specificDates.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeDateInput(index)}
                                                className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 rounded text-sm font-medium transition-colors outline-none border-none"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button 
                                    type="button" 
                                    onClick={addDateInput}
                                    className="mt-2 text-sm text-[#2453c9] font-medium hover:underline flex items-center gap-1 outline-none border-none"
                                >
                                    + Thêm ngày khác
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bộ phận chịu trách nhiệm</label>
                                    <input 
                                        name="responsibleDept" value={formData.responsibleDept} onChange={handleChange} required 
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bộ phận phối hợp</label>
                                    <input 
                                        name="coordinatingDept" value={formData.coordinatingDept} onChange={handleChange} 
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors" 
                                    />
                                </div>
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

export default KeyActivityManagement;