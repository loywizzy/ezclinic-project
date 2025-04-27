// src/pages/Employees.jsx
import { useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle
} from 'react-icons/fa';

export default function Employees() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    prefix: '',
    firstName: '',
    lastName: '',
    nickname: '',
    position: '',
    color: '',
    salary: '',
    payDate: '',
    hasSS: true,
    ssId: '',
    taxDeduction: '',
    hourlyRate: '',
    overtimeRate: '',
    leavePersonal: '',
    leaveVacation: '',
    leaveSick: '',
    email: '',
    password: '',
    status: 'active',
    paymentChannel: '',
    accountType: 'savings',
    bankName: '',
    accountNumber: '',
    branch: ''
  });

  const employees = [
    {
      id: '0000001',
      name: 'นายทดสอบ นามสกุลสมมติ',
      position: 'ตำแหน่ง',
      email: 'test@example.com'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
    setShowSuccess(true);
  };

  return (
    <div className="p-8">
      {/* List Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ข้อมูลพนักงาน</h2>
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
              <th className="py-3 px-6 text-left">ชื่อ - นามสกุล</th>
              <th className="py-3 px-6 text-left">ตำแหน่ง</th>
              <th className="py-3 px-6 text-left">อีเมล</th>
              <th className="py-3 px-6 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {employees.map(emp => (
              <tr key={emp.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{emp.id}</td>
                <td className="py-3 px-6 text-left">{emp.name}</td>
                <td className="py-3 px-6 text-left">{emp.position}</td>
                <td className="py-3 px-6 text-left">{emp.email}</td>
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
        {[1,2,3,4,5,6,7].map(page => (
          <button
            key={page}
            className={`px-3 py-1 border rounded ${page === 6 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
          >{page}</button>
        ))}
        <button className="px-3 py-1 bg-white border rounded hover:bg-gray-100">&gt;</button>
      </div>

      <p className="text-xs text-gray-400 mt-10">© 2025, Made with SmartCarePro</p>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold mb-4">เพิ่มพนักงาน</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Section 1: ข้อมูลพนักงาน */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">คำนำหน้า</label>
                  <input
                    type="text"
                    placeholder="กรอกคำนำหน้า"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.prefix}
                    onChange={e => setFormData({...formData, prefix: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">ชื่อ</label>
                  <input
                    type="text"
                    placeholder="กรอกชื่อ"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">นามสกุล</label>
                  <input
                    type="text"
                    placeholder="กรอกนามสกุล"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">ชื่อเล่น</label>
                  <input
                    type="text"
                    placeholder="กรอกชื่อเล่น"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.nickname}
                    onChange={e => setFormData({...formData, nickname: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">ตำแหน่ง</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.position}
                    onChange={e => setFormData({...formData, position: e.target.value})}
                    required
                  >
                    <option value="">เลือกตำแหน่ง</option>
                    <option value="ตำแหน่ง A">ตำแหน่ง A</option>
                    <option value="ตำแหน่ง B">ตำแหน่ง B</option>
                  </select>
                </div>
              </div>
              {/* Section 2: ข้อมูลเงินเดือน/ค่าจ้าง */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">เงินเดือน</label>
                  <input
                    type="text"
                    placeholder="กรอกเงินเดือน"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.salary}
                    onChange={e => setFormData({...formData, salary: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">วันที่จ่าย</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.payDate}
                    onChange={e => setFormData({...formData, payDate: e.target.value})}
                  />
                </div>
                <div className="flex items-center">
                  <label className="block text-sm mr-4">ประกันสังคม</label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="ss"
                      checked={formData.hasSS}
                      onChange={() => setFormData({...formData, hasSS: true})}
                    />
                    <span>มี</span>
                  </label>
                  <label className="flex items-center space-x-2 ml-4">
                    <input
                      type="radio"
                      name="ss"
                      checked={!formData.hasSS}
                      onChange={() => setFormData({...formData, hasSS: false})}
                    />
                    <span>ไม่มี</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm mb-1">เลขประกันสังคม</label>
                  <input
                    type="text"
                    placeholder="เลขประกันสังคม"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.ssId}
                    onChange={e => setFormData({...formData, ssId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">หัก ณ ที่จ่าย</label>
                  <input
                    type="text"
                    placeholder="กรอกหัก ณ ที่จ่าย"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.taxDeduction}
                    onChange={e => setFormData({...formData, taxDeduction: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">ค่าจ้างต่อชั่วโมง</label>
                  <input
                    type="text"
                    placeholder="กรอกค่าจ้างต่อชั่วโมง"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.hourlyRate}
                    onChange={e => setFormData({...formData, hourlyRate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">ค่าล่วงเวลา</label>
                  <input
                    type="text"
                    placeholder="กรอกค่าล่วงเวลา"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.overtimeRate}
                    onChange={e => setFormData({...formData, overtimeRate: e.target.value})}
                  />
                </div>
              </div>
              {/* Section 3: วันหยุด & สิทธิ */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">วันลาส่วนตัว/ปี</label>
                  <input
                    type="number"
                    placeholder="จำนวนวัน/ปี"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.leavePersonal}
                    onChange={e => setFormData({...formData, leavePersonal: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">วันลาพักร้อน/ปี</label>
                  <input
                    type="number"
                    placeholder="จำนวนวัน/ปี"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.leaveVacation}
                    onChange={e => setFormData({...formData, leaveVacation: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">วันลาป่วย/ปี</label>
                  <input
                    type="number"
                    placeholder="จำนวนวัน/ปี"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.leaveSick}
                    onChange={e => setFormData({...formData, leaveSick: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">สถานะ</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">ใช้งาน</option>
                    <option value="inactive">พักใช้งาน</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">อีเมล</label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">รหัสผ่าน</label>
                  <input
                    type="password"
                    placeholder="กรอกรหัสผ่าน"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">ช่องทางชำระ</label>
                  <input
                    type="text"
                    placeholder="กรอกช่องทางการชำระ"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.paymentChannel}
                    onChange={e => setFormData({...formData, paymentChannel: e.target.value})}
                  />
                </div>
              </div>
            </form>
            {/* Form Actions */}
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >ยกเลิก</button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg"
              >ยืนยัน</button>
            </div>
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