import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axiosClient from '../api/axiosClient';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [formData, setFormData] = useState({
    subject: '',
    lessonCount: '',
    startWeek: '',
    endWeek: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAssignments = async () => {
    try {
      const res = await axiosClient.get('/assignment-changes');
      setAssignments(res.data.data);
    } catch (err) {
      alert('Không thể lấy dữ liệu!');
    }
  };

  useEffect(() => { fetchAssignments(); }, []);

  // ==========================================
  // LOGIC TÌM KIẾM TƯƠNG ĐỐI
  // ==========================================
  const filteredAssignments = assignments.filter(item => {
    const searchLower = searchTerm.toLowerCase();

    const subject = (item.subject || '').toLowerCase();
    const lessonCount = String(item.lessonCount || '').toLowerCase();
    const time = `tuần ${item.startWeek} - ${item.endWeek}`.toLowerCase();
    const notes = (item.notes || '').toLowerCase();

    return subject.includes(searchLower) ||
      lessonCount.includes(searchLower) ||
      time.includes(searchLower) ||
      notes.includes(searchLower);
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosClient.put(`/assignment-changes/${editingId}`, formData);
      } else {
        await axiosClient.post('/assignment-changes', formData);
      }
      closeModal();
      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn xóa dòng này không?')) {
      try {
        await axiosClient.delete(`/assignment-changes/${id}`);
        fetchAssignments();
      } catch (err) {
        alert('Xóa thất bại!');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      subject: item.subject,
      lessonCount: item.lessonCount,
      startWeek: item.startWeek,
      endWeek: item.endWeek,
      notes: item.notes
    });
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ subject: '', lessonCount: '', startWeek: '', endWeek: '', notes: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ subject: '', lessonCount: '', startWeek: '', endWeek: '', notes: '' });
  };

  // ==========================================
  // XỬ LÝ XUẤT EXCEL
  // ==========================================
  const exportToExcel = () => {
    if (filteredAssignments.length === 0) {
      alert("Không có dữ liệu để xuất!");
      return;
    }

    const dataToExport = filteredAssignments.map((item, index) => ({
      "STT": index + 1,
      "Môn Học": item.subject,
      "Số Tiết": item.lessonCount,
      "Tuần Bắt Đầu": item.startWeek,
      "Tuần Kết Thúc": item.endWeek,
      "Ghi Chú": item.notes || ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Phân công");
    XLSX.writeFile(workbook, "Danh_Sach_Phan_Cong_Tiet.xlsx");
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

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const rawJsonData = XLSX.utils.sheet_to_json(worksheet);

        const formattedData = rawJsonData.map(row => ({
          subject: row['Môn Học'],
          lessonCount: row['Số Tiết'],
          startWeek: row['Tuần Bắt Đầu'],
          endWeek: row['Tuần Kết Thúc'],
          notes: row['Ghi Chú'] || ''
        }));

        const res = await axiosClient.post('/assignment-changes/import', formattedData);

        if (res.data.success) {
          alert(`Tuyệt vời! ${res.data.message}`);
          fetchAssignments();
        }
      } catch (error) {
        console.error(error);
        alert('Có lỗi xảy ra khi đọc file. Vui lòng đảm bảo các cột đúng định dạng!');
      } finally {
        e.target.value = null;
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="w-full h-full flex flex-col font-sans">

      {/* HEADER: Responsive cho PC & Điện thoại */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        
        <h2 className="text-2xl md:text-[2rem] font-bold text-[#2563eb] whitespace-nowrap">
          Quản lý Phân môn - Số tiết
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
              placeholder="Tìm theo môn học, số tiết, tuần hoặc ghi chú..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-[#2563eb] text-sm shadow-sm transition-all bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* CỤM NÚT BẤM - Nút Excel được làm viền nhẹ lại */}
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <label className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm transition-colors flex items-center gap-2 text-sm cursor-pointer outline-none">
            <span className="text-lg leading-none">📥</span> Nhập Excel
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              onChange={handleImportExcel} 
              className="hidden" 
            />
          </label>

          <button
            onClick={exportToExcel}
            className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm transition-colors flex items-center gap-2 text-sm outline-none"
          >
            <span className="text-lg leading-none">📊</span> Xuất Excel
          </button>

          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto sm:flex-1 xl:flex-none justify-center bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-2.5 px-5 rounded shadow transition-colors flex items-center gap-2 text-sm border-none outline-none"
          >
            <span className="text-lg leading-none">+</span> Thêm Phân Công
          </button>
        </div>
      </div>

      {/* BẢNG DANH SÁCH: Giữ nguyên form gốc, làm dịu màu nền xanh của Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col relative flex-1">
        <div className="overflow-auto relative">
          <table className="w-full text-left border-collapse min-w-[800px]">
            {/* Màu nền xanh dương dịu mắt (bg-[#3b82f6]) và chữ trắng (text-white) */}
            <thead className="sticky top-0 z-10 bg-[#3b82f6] text-white shadow-sm">
              <tr>
                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap">STT</th>
                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap">Môn Học</th>
                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap">Số Tiết</th>
                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap">Thời Gian</th>
                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap">Ghi Chú</th>
                <th className="px-6 py-4 text-base font-semibold whitespace-nowrap text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((item, index) => (
                  <tr key={item._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{index + 1}</td>
                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{item.subject}</td>
                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{item.lessonCount}</td>
                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">Tuần {item.startWeek} - {item.endWeek}</td>
                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a] whitespace-pre-wrap">{item.notes || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {/* Giữ nguyên nút màu Cam - Đỏ của bạn */}
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors border-none outline-none"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors border-none outline-none"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-500 italic text-sm">
                    {searchTerm ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có dữ liệu phân công.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL POPUP FORM - Trả về nguyên bản */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden animate-fade-in">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#2453c9]">
                {editingId ? 'Chỉnh Sửa Phân Công' : 'Thêm Phân Công Mới'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-red-500 text-3xl font-light leading-none outline-none border-none">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên môn học</label>
                <input
                  name="subject" value={formData.subject} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Số tiết</label>
                  <input
                    name="lessonCount" type="number" value={formData.lessonCount} onChange={handleChange} required min="1"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tuần bắt đầu</label>
                  <input
                    name="startWeek" type="number" value={formData.startWeek} onChange={handleChange} required min="1"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tuần kết thúc</label>
                  <input
                    name="endWeek" type="number" value={formData.endWeek} onChange={handleChange} required min="1"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú thêm</label>
                <textarea
                  name="notes" value={formData.notes} onChange={handleChange} rows="3"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors resize-none"
                />
              </div>

              <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button" onClick={closeModal}
                  className="px-5 py-2.5 rounded border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors outline-none"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded bg-[#2453c9] text-white text-sm font-medium hover:bg-blue-800 transition-colors outline-none border-none"
                >
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

export default AssignmentManagement;