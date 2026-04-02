import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExcelButtons = ({ data, columns, fileName, onImport }) => {
  
  // Xuất Excel
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    // Chuyển đổi dữ liệu theo columns
    const exportData = data.map(item => {
      const row = {};
      columns.forEach(col => {
        row[col.header] = item[col.key] || '';
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Nhập Excel
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Chuyển đổi header về key
        const importedData = jsonData.map(row => {
          const item = {};
          columns.forEach(col => {
            if (row[col.header] !== undefined) {
              item[col.key] = row[col.header];
            }
          });
          return item;
        });

        onImport(importedData);
        e.target.value = ''; // Reset input
      } catch (error) {
        alert('Lỗi khi đọc file Excel: ' + error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={handleExport}
        style={{
          padding: '10px 20px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '160px',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        📊 Xuất Excel
      </button>
      
      <label
        style={{
          padding: '10px 20px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: '160px',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        📥 Nhập Excel
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </label>
    </div>
  );
};

export default ExcelButtons;
