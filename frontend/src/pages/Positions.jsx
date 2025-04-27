// src/pages/Positions.jsx
import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCheckCircle } from 'react-icons/fa';

export default function Positions() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', salary: '', active: true });

  const positions = [
    { id: '0000001', name: 'ชื่อตำแหน่ง', salary: '20,000', active: true }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
    setShowSuccess(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ตำแหน่ง</h2>
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          onClick={() => setShowForm(true)}
        >
          <FaPlus className="mr-2" /> เพิ่มข้อมูล
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">รหัส</th>
              <th className="py-3 px-6 text-left">ชื่อตำแหน่ง</th>
              <th className="py-3 px-6 text-left">เงินเดือน</th>
              <th className="py-3 px-6 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {positions.map((pos) => (
              <tr key={pos.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{pos.id}</td>
                <td className="py-3 px-6 text-left">{pos.name}</td>
                <td className="py-3 px-6 text-left">{pos.salary}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button className="text-yellow-500 hover:text-yellow-600">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-600">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4 text-sm text-gray-500">
        แสดง 51-60 จากทั้งหมด 85 รายการ
      </div>
      <div className="flex justify-end space-x-2 mt-2">
        <button className="px-3 py-1 bg-white border rounded hover:bg-gray-100">&lt;</button>
        {[1,2,3,4,5,6,7].map((page) => (
          <button
            key={page}
            className={`px-3 py-1 border rounded ${page === 6 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}
        <button className="px-3 py-1 bg-white border rounded hover:bg-gray-100">&gt;</button>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-10">© 2025, Made with SmartCarePro</p>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold mb-4">ตำแหน่ง</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">ชื่อตำแหน่ง</label>
                <input
                  type="text"
                  placeholder="placeholder"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">เงินเดือน</label>
                <input
                  type="text"
                  placeholder="placeholder"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="active" className="mr-2">ใช้งาน</label>
                <input
                  id="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="toggle"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  onClick={() => setShowForm(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 text-center">
            <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
            <p className="text-lg font-semibold mb-6">บันทึกข้อมูลสำเร็จ</p>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
              onClick={() => setShowSuccess(false)}
            >ตกลง</button>
          </div>
        </div>
      )}
    </div>
  );
}
