import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './WeeklyTasks.css';
import Modal from '../components/Modal';

function WeeklyTasks() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    thu: '',
    noiDungCongViec: '',
    thoiGian: '',
    diaDiem: '',
    ghiChu: '',
    daHoanThanh: false
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/weekly-tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/weekly-tasks/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/weekly-tasks', formData);
      }
      fetchTasks();
      resetForm();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setFormData({
      thu: task.thu,
      noiDungCongViec: task.noiDungCongViec,
      thoiGian: new Date(task.thoiGian).toISOString().slice(0, 16),
      diaDiem: task.diaDiem || '',
      ghiChu: task.ghiChu || '',
      daHoanThanh: task.daHoanThanh
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/weekly-tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`http://localhost:5000/api/weekly-tasks/${task._id}`, {
        ...task,
        daHoanThanh: !task.daHoanThanh
      });
      fetchTasks();
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      thu: '',
      noiDungCongViec: '',
      thoiGian: '',
      diaDiem: '',
      ghiChu: '',
      daHoanThanh: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTaskStatus = (task) => {
    if (task.daHoanThanh) {
      return 'completed';
    }

    const now = new Date();
    const taskTime = new Date(task.thoiGian);
    const diffHours = (taskTime - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return 'overdue'; // Đỏ - Quá hạn
    } else if (diffHours <= 24) {
      return 'urgent'; // Đỏ - Đến hạn (trong 24h)
    } else if (diffHours <= 48) {
      return 'warning'; // Vàng - Gần đến hạn (trong 48h)
    }
    return 'normal'; // Xanh - Bình thường
  };

  const getStatusText = (task) => {
    if (task.daHoanThanh) {
      return '✓ Hoàn thành';
    }

    const now = new Date();
    const taskTime = new Date(task.thoiGian);
    const diffHours = (taskTime - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return '✗ Quá hạn';
    } else if (diffHours <= 24) {
      return '🔴 Đến hạn';
    } else if (diffHours <= 48) {
      return '🟡 Gần đến hạn';
    }
    return '🟢 Bình thường';
  };

  const excelColumns = [
    { header: 'Thứ', key: 'thu' },
    { header: 'Nội Dung Công Việc', key: 'noiDungCongViec' },
    { header: 'Thời Gian', key: 'thoiGian' },
    { header: 'Địa Điểm', key: 'diaDiem' },
    { header: 'Ghi Chú', key: 'ghiChu' }
  ];

  const handleImportExcel = async (importedData) => {
    if (!importedData || importedData.length === 0) {
      alert('File Excel không có dữ liệu!');
      return;
    }
    try {
      let successCount = 0;
      let errorCount = 0;
      for (const item of importedData) {
        try {
          await axios.post('http://localhost:5000/api/weekly-tasks', item);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }
      alert(`Nhập thành công ${successCount} bản ghi${errorCount > 0 ? `, ${errorCount} lỗi` : ''}`);
      fetchTasks();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  const filteredTasks = tasks.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.thu || '').toLowerCase().includes(searchLower) ||
      (item.noiDungCongViec || '').toLowerCase().includes(searchLower) ||
      (item.diaDiem || '').toLowerCase().includes(searchLower) ||
      (item.ghiChu || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="weekly-tasks">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h2 className="text-2xl md:text-[2rem] font-bold text-[#2563eb] whitespace-nowrap">
          Công Việc Tuần
        </h2>
        <div className="w-full xl:flex-1 xl:max-w-lg xl:mx-4">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-[#2563eb] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-[#2563eb] text-sm shadow-sm transition-all bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <label className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm transition-colors flex items-center gap-2 text-sm cursor-pointer outline-none">
            <span className="text-lg leading-none">📥</span> Nhập Excel
            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={(e) => {
              const file = e.target.files[0]; if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                const data = new Uint8Array(ev.target.result);
                const wb = XLSX.read(data, { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(ws);
                const imported = rows.map(row => { const item = {}; excelColumns.forEach(col => { if (row[col.header] !== undefined) item[col.key] = row[col.header]; }); return item; });
                handleImportExcel(imported);
              };
              reader.readAsArrayBuffer(file); e.target.value = '';
            }} />
          </label>
          <button
            onClick={() => {
              if (!tasks || tasks.length === 0) { alert('Không có dữ liệu để xuất!'); return; }
              const exportData = tasks.map(item => { const row = {}; excelColumns.forEach(col => { row[col.header] = item[col.key] || ''; }); return row; });
              const ws = XLSX.utils.json_to_sheet(exportData); const wb2 = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb2, ws, 'Sheet1');
              const buf = XLSX.write(wb2, { bookType: 'xlsx', type: 'array' });
              saveAs(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `CongViecTuan_${new Date().toISOString().split('T')[0]}.xlsx`);
            }}
            className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm transition-colors flex items-center gap-2 text-sm outline-none"
          >
            <span className="text-lg leading-none">📊</span> Xuất Excel
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto sm:flex-1 xl:flex-none justify-center bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-2.5 px-5 rounded shadow transition-colors flex items-center gap-2 text-sm border-none outline-none"
          >
            <span className="text-lg leading-none">+</span> Thêm Công Việc
          </button>
        </div>
      </div>

      {showForm && (
        <Modal 
          isOpen={showForm} 
          onClose={resetForm}
          title={editingId ? 'Chỉnh Sửa Công Việc' : 'Thêm Công Việc Mới'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Thứ *</label>
                <select
                  value={formData.thu}
                  onChange={(e) => setFormData({...formData, thu: e.target.value})}
                  required
                >
                  <option value="">Chọn thứ</option>
                  <option value="Thứ 2">Thứ 2</option>
                  <option value="Thứ 3">Thứ 3</option>
                  <option value="Thứ 4">Thứ 4</option>
                  <option value="Thứ 5">Thứ 5</option>
                  <option value="Thứ 6">Thứ 6</option>
                  <option value="Thứ 7">Thứ 7</option>
                  <option value="Chủ Nhật">Chủ Nhật</option>
                </select>
              </div>

              <div className="form-group">
                <label>Thời Gian *</label>
                <input
                  type="datetime-local"
                  value={formData.thoiGian}
                  onChange={(e) => setFormData({...formData, thoiGian: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nội Dung Công Việc *</label>
              <textarea
                value={formData.noiDungCongViec}
                onChange={(e) => setFormData({...formData, noiDungCongViec: e.target.value})}
                rows="3"
                placeholder="Mô tả công việc cần làm..."
                required
              />
            </div>

            <div className="form-group">
              <label>Địa Điểm</label>
              <input
                type="text"
                value={formData.diaDiem}
                onChange={(e) => setFormData({...formData, diaDiem: e.target.value})}
                placeholder="VD: Phòng họp, Văn phòng..."
              />
            </div>

            <div className="form-group">
              <label>Ghi Chú</label>
              <textarea
                value={formData.ghiChu}
                onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
                rows="2"
                placeholder="Ghi chú thêm..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? 'Cập Nhật' : 'Thêm Mới'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Hủy
              </button>
            </div>
          </form>
        </Modal>
      )}

      <div className="table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Thứ</th>
              <th>Nội Dung Công Việc</th>
              <th>Thời Gian</th>
              <th>Địa Điểm</th>
              <th>Ghi Chú</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, index) => (
              <tr key={task._id} className={`task-row ${getTaskStatus(task)}`}>
                <td>{index + 1}</td>
                <td>{task.thu}</td>
                <td>{task.noiDungCongViec}</td>
                <td>{formatDateTime(task.thoiGian)}</td>
                <td>{task.diaDiem || '-'}</td>
                <td>{task.ghiChu || '-'}</td>
                <td>
                  <span className={`status-badge ${getTaskStatus(task)}`}>
                    {getStatusText(task)}
                  </span>
                </td>
                <td>
                  <button 
                    className={`btn-complete ${task.daHoanThanh ? 'completed' : ''}`}
                    onClick={() => toggleComplete(task)}
                    title={task.daHoanThanh ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
                  >
                    {task.daHoanThanh ? '✓' : '○'}
                  </button>
                  <button className="btn-edit" onClick={() => handleEdit(task)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDelete(task._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTasks.length === 0 && (
          <p className="no-data">{searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có công việc nào trong tuần'}</p>
        )}
      </div>
    </div>
  );
}

export default WeeklyTasks;
