// src/pages/Permissions.jsx
import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCheckCircle } from 'react-icons/fa';

const modules = [
  { key: 'customers', label: 'ลูกค้า' },
  { key: 'employees', label: 'พนักงาน' },
  { key: 'positions', label: 'ตำแหน่ง' },
];

export default function Permissions() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    permissions: modules.reduce((acc, m) => {
      acc[m.key] = { view: true, create: false, update: false, delete: false };
      return acc;
    }, {}),
  });

  const list = [
    { id: '0000001', name: 'พนักงาน', details: 'ลูกค้า, พนักงาน, ตำแหน่ง' },
  ];

  const handleToggle = (modKey, type) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [modKey]: {
          ...formData.permissions[modKey],
          [type]: !formData.permissions[modKey][type],
        },
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
    setShowSuccess(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">สิทธิ์การใช้งาน</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
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
              <th className="py-3 px-6 text-left">ชื่อสิทธิ์การใช้งาน</th>
              <th className="py-3 px-6 text-left">รายละเอียด</th>
              <th className="py-3 px-6 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {list.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{item.id}</td>
                <td className="py-3 px-6 text-left">{item.name}</td>
                <td className="py-3 px-6 text-left">{item.details}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex justify-center space-x-2">
                    <button className="text-yellow-500 hover:text-yellow-600"><FaEdit/></button>
                    <button className="text-red-500 hover:text-red-600"><FaTrash/></button>
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
        {[1, 2, 3, 4, 5, 6, 7].map((page) => (
          <button
            key={page}
            className={`px-3 py-1 border rounded ${page === 6 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}
        <button className="px-3 py-1 bg-white border rounded hover:bg-gray-100">&gt;</button>
      </div>

      <p className="text-xs text-gray-400 mt-10">© 2025, Made with SmartCarePro</p>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            ><FaTimes/></button>
            <h3 className="text-xl font-semibold mb-4">สิทธิ์ผู้ใช้งาน</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">ชื่อสิทธิ์ผู้ใช้งาน</label>
                <input
                  type="text"
                  placeholder="placeholder"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-blue-500 text-white text-sm">
                      <th className="py-2 px-4 text-left">รายการ</th>
                      <th className="py-2 px-4 text-center">ดู</th>
                      <th className="py-2 px-4 text-center">สร้าง</th>
                      <th className="py-2 px-4 text-center">แก้ไข</th>
                      <th className="py-2 px-4 text-center">ลบ</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {modules.map((m) => (
                      <tr key={m.key} className="border-b border-gray-200">
                        <td className="py-2 px-4">{m.label}</td>
                        {['view','create','update','delete'].map((type) => (
                          <td key={type} className="py-2 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={formData.permissions[m.key][type]}
                              onChange={() => handleToggle(m.key, type)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  onClick={() => setShowForm(false)}
                >ยกเลิก</button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 text-center">
            <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
            <p className="text-lg font-semibold mb-6">บันทึกข้อมูลสำเร็จ</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg"
            >ตกลง</button>
          </div>
        </div>
      )}
    </div>
  );
}
