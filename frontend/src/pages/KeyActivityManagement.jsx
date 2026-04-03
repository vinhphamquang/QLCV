import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axiosClient from '../api/axiosClient';

const KeyActivityManagement = () => {
    const [activities, setActivities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        month: '',
        specificDates: [''],
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (index, value) => {
        const newDates = [...formData.specificDates];
        newDates[index] = value;
        setFormData({ ...formData, specificDates: newDates });
    };

    const addDateInput = () => {
        setFormData({ ...formData, specificDates: [...formData.specificDates, ''] });
    };

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

    const exportToExcel = () => {
        if (filteredActivities.length === 0) return alert("Không có dữ liệu để xuất!");
        const dataToExport = filteredActivities.map((item, index) => ({
            "STT": index + 1,
            "Tháng": `Tháng ${item.month}`,
            "Các Ngày Cụ Thể": item.specificDates.map(d => new Date(d).toLocaleDateString('vi-VN')).join(', '),
            "Chịu Trách Nhiệm": item.responsibleDept,
            "Phối Hợp": item.coordinatingDept || "",
            "Ghi Chú": item.notes || ""
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Hoat Dong Trong Diem");
        XLSX.writeFile(workbook, "Danh_Sach_Hoat_Dong_Trong_Diem.xlsx");
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
                    let monthVal = String(row['Tháng']).replace(/\D/g, ''); 
                    let datesStr = row['Các Ngày Cụ Thể'] || '';
                    let parsedDates = [];
                    if (typeof datesStr === 'string') {
                        const parts = datesStr.split(/[,;\n]/);
                        parts.forEach(p => {
                            let d = p.trim();
                            if(d && d.includes('/')) {
                                const dParts = d.split('/');
                                if(dParts.length === 3) parsedDates.push(new Date(dParts[2], dParts[1] - 1, dParts[0], 12, 0, 0));
                            }
                        });
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
                if (res.data.success) { alert(`Tuyệt vời! ${res.data.message}`); fetchActivities(); }
            } catch (error) { alert('Lỗi đọc file Excel!'); } finally { e.target.value = null; }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="w-full h-full flex flex-col font-sans">
            {/* HEADER */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                <h2 className="text-2xl md:text-[2rem] font-bold text-[#2563eb] whitespace-nowrap">
                    Hoạt Động Trọng Điểm
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
                            placeholder="Tìm kiếm tháng, ngày, bộ phận phụ trách..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-[#2563eb] text-sm shadow-sm transition-all bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full xl:w-auto">
                    <label className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm cursor-pointer flex items-center gap-2 text-sm transition-colors">
                        <span className="text-lg">📥</span> Nhập Excel
                        <input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} className="hidden" />
                    </label>

                    <button onClick={exportToExcel} className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm flex items-center gap-2 text-sm transition-colors">
                        <span className="text-lg">📊</span> Xuất Excel
                    </button>

                    <button onClick={handleOpenAdd} className="w-full sm:w-auto sm:flex-1 xl:flex-none justify-center bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-2.5 px-5 rounded shadow flex items-center gap-2 text-sm transition-colors border-none">
                        <span className="text-lg">+</span> Thêm Hoạt Động
                    </button>
                </div>
            </div>

            {/* BẢNG DANH SÁCH */}
            <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col relative flex-1 overflow-hidden">
                <div className="overflow-auto relative">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="sticky top-0 z-10 bg-[#3b82f6] text-white shadow-sm">
                            <tr>
                                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap w-16">STT</th>
                                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap">Thời Gian</th>
                                <th className="px-6 py-4 text-base font-semibold w-[20%]">Bộ Phận Phụ Trách</th>
                                <th className="px-6 py-4 text-base font-semibold w-[20%]">Phối Hợp</th>
                                <th className="px-6 py-4 text-base font-semibold">Ghi Chú</th>
                                <th className="px-6 py-4 text-base font-semibold text-center whitespace-nowrap w-36">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredActivities.length > 0 ? filteredActivities.map((item, index) => (
                                <tr key={item._id} className={`hover:bg-blue-50/50 transition-colors ${item.isWarning ? 'bg-amber-50/80' : ''}`}>
                                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">
                                        {item.isWarning ? <span className="text-amber-500 mr-2" title="Sắp diễn ra">⚠️</span> : ''}
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-blue-700 mb-1 whitespace-nowrap">Tháng {item.month}</div>
                                        <div className="text-xs font-[450] text-gray-500 leading-relaxed">
                                            {item.specificDates.map(d => new Date(d).toLocaleDateString('vi-VN')).join(', ')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-base font-semibold text-gray-700">{item.responsibleDept}</td>
                                    <td className="px-6 py-4 text-base font-[450] text-gray-600">{item.coordinatingDept || '-'}</td>
                                    <td className="px-6 py-4 text-base font-[450] text-gray-500 whitespace-pre-wrap leading-relaxed">{item.notes || '-'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleEdit(item)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded text-sm font-medium border-none transition-colors">Sửa</button>
                                            <button onClick={() => handleDelete(item._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium border-none transition-colors">Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center text-gray-500 italic">
                                        {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có hoạt động trọng điểm nào.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden my-8">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-[#2453c9]">
                                {editingId ? 'Chỉnh Sửa Hoạt Động' : 'Thêm Hoạt Động Mới'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 text-3xl font-light outline-none border-none leading-none">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tháng diễn ra (1-12)</label>
                                <input name="month" type="number" min="1" max="12" value={formData.month} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] outline-none" />
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Các ngày cụ thể diễn ra</label>
                                {formData.specificDates.map((date, index) => (
                                    <div key={index} className="flex gap-2 mb-2.5 last:mb-0">
                                        <input type="date" value={date} onChange={(e) => handleDateChange(index, e.target.value)} required className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] outline-none" />
                                        {formData.specificDates.length > 1 && (
                                            <button type="button" onClick={() => removeDateInput(index)} className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-xs font-bold transition-colors border-none">Xóa</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addDateInput} className="mt-3 text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 border-none bg-transparent outline-none">+ THÊM NGÀY</button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bộ phận chịu trách nhiệm</label>
                                    <input name="responsibleDept" value={formData.responsibleDept} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bộ phận phối hợp</label>
                                    <input name="coordinatingDept" value={formData.coordinatingDept} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú thêm</label>
                                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] outline-none resize-none" />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-gray-100">
                                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50">Hủy Bỏ</button>
                                <button type="submit" className="px-5 py-2.5 rounded bg-[#2453c9] text-white text-sm font-medium hover:bg-blue-800 transition-colors border-none">{editingId ? 'Lưu Cập Nhật' : 'Xác Nhận Thêm'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KeyActivityManagement;