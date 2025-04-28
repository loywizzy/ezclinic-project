import React, { useState, useEffect } from "react";
import employeeService from "../services/employeeService.js";
import positionService from "../services/positionService.js";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle,
  FaCamera,
} from "react-icons/fa";

export default function Employees() {
  /* --------------------------- Table & Lists --------------------------- */
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* --------------------------- Modal & Form ---------------------------- */
  const emptyForm = {
    prefix: "",
    firstName: "",
    lastName: "",
    nickname: "",
    positionId: "",
    color: "",
    salary: "",
    payDate: "",
    hasSS: true,
    ssId: "",
    taxDeduction: "",
    hourlyRate: "",
    overtimeRate: "",
    leavePersonal: "",
    leaveVacation: "",
    leaveSick: "",
    paymentChannel: "",
    accountType: "saving",
    bankName: "",
    accountNumber: "",
    bankBranch: "",
    permission: "",
    email: "",
    password: "",
    status: true,
    profileImage: null,
  };
  const [formData, setFormData] = useState(emptyForm);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /* ----------------------------- Lifecycle ----------------------------- */
  useEffect(() => {
    fetchEmployees();
    fetchPositions();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeService.listEmployees();
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Employees API error", err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const res = await positionService.listPositions();
      setPositions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Positions API error", err);
      setPositions([]);
    }
  };

  /* ------------------------------ Handlers ------------------------------ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, profileImage: file }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ยืนยันลบข้อมูลพนักงาน?")) return;
    try {
      await employeeService.deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries({
      prefix: formData.prefix,
      first_name: formData.firstName,
      last_name: formData.lastName,
      nickname: formData.nickname,
      position_id: formData.positionId,
      color: formData.color,
      salary: formData.salary,
      pay_date: formData.payDate,
      has_social_security: formData.hasSS,
      social_security_id: formData.ssId,
      tax_deduction: formData.taxDeduction,
      hourly_rate: formData.hourlyRate,
      overtime_rate: formData.overtimeRate,
      leave_personal: formData.leavePersonal,
      leave_vacation: formData.leaveVacation,
      leave_sick: formData.leaveSick,
      payment_channel: formData.paymentChannel,
      account_type: formData.accountType,
      bank_name: formData.bankName,
      account_number: formData.accountNumber,
      bank_branch: formData.bankBranch,
      permission: formData.permission,
      email: formData.email,
      password_hash: formData.password,
      status: formData.status,
    }).forEach(([k, v]) => data.append(k, v));

    if (avatarFile) data.append("profile_image", avatarFile);

    try {
      await employeeService.createEmployee(data);
      setShowForm(false);
      setShowSuccess(true);
      fetchEmployees();
      // reset form
      setFormData(emptyForm);
      setAvatarFile(null);
      setAvatarPreview("");
    } catch (err) {
      console.error(err);
    }
  };

  /* --------------------------- Render Section --------------------------- */
  return (
    <div className="p-8">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ข้อมูลพนักงาน</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow"
        >
          <FaPlus className="mr-2" /> เพิ่มข้อมูล
        </button>
      </div>

      {/* ===== Table ===== */}
      {loading ? (
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase leading-normal">
                <th className="py-3 px-6 text-left font-semibold">รหัส</th>
                <th className="py-3 px-6 text-left font-semibold">
                  ชื่อ - นามสกุล
                </th>
                <th className="py-3 px-6 text-left font-semibold">ตำแหน่ง</th>
                <th className="py-3 px-6 text-left font-semibold">อีเมล</th>
                <th className="py-3 px-6 text-center font-semibold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {employees.length ? (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6 whitespace-nowrap">{emp.id}</td>
                    <td className="py-3 px-6">
                      {emp.prefix} {emp.first_name} {emp.last_name}
                    </td>
                    <td className="py-3 px-6">{emp.position_id}</td>
                    <td className="py-3 px-6">{emp.email}</td>
                    <td className="py-3 px-6 text-center space-x-2">
                      <button
                        onClick={() => setShowForm(true)}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-400">
                    ไม่มีข้อมูลพนักงาน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== Footer ===== */}
      {!loading && (
        <>
          <div className="flex justify-end mt-4 text-sm text-gray-500">
            แสดง {employees.length} รายการ
          </div>
          <p className="text-xs text-gray-400 mt-10">
            © 2025, Made with SmartCarePro
          </p>
        </>
      )}

      {/* ===== Modal ===== */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl p-8 relative overflow-y-auto max-h-[90vh] animate-scale-in">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              <FaTimes size={18} />
            </button>
            <h3 className="text-2xl font-bold mb-8">เพิ่มพนักงาน</h3>

            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <img
                  src={avatarPreview || "/avatar-placeholder.png"}
                  alt="avatar"
                  className="h-28 w-28 rounded-full object-cover ring-2 ring-blue-400"
                />
                <label
                  htmlFor="avatarInput"
                  className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <FaCamera size={14} />
                </label>
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm"
            >
              {/* ========= Section 1 ========= */}
              <div className="space-y-4">
                <h4 className="text-blue-500 font-semibold">ข้อมูลพนักงาน</h4>
                <input
                  type="text"
                  name="prefix"
                  value={formData.prefix}
                  onChange={handleChange}
                  placeholder="คำนำหน้า"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="ชื่อ"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="นามสกุล"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="ชื่อเล่น"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />

                <select
                  name="positionId"
                  value={formData.positionId}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                  required
                >
                  <option value="">-- เลือกตำแหน่ง --</option>
                  {positions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">เลือกสี</option>
                  <option value="primary">ฟ้า</option>
                  <option value="success">เขียว</option>
                  <option value="warning">เหลือง</option>
                  <option value="danger">แดง</option>
                </select>
              </div>

              {/* ========= Section 2 ========= */}
              <div className="space-y-4">
                <h4 className="text-blue-500 font-semibold">
                  ข้อมูลเงินเดือน/ค่าจ้าง
                </h4>
                <input
                  type="number"
                  step="0.01"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="เงินเดือน"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="date"
                  name="payDate"
                  value={formData.payDate}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex items-center space-x-2">
                  <input
                    id="hasSS"
                    type="checkbox"
                    name="hasSS"
                    checked={formData.hasSS}
                    onChange={handleChange}
                    className="accent-blue-500"
                  />
                  <label htmlFor="hasSS">มีประกันสังคม</label>
                </div>
                <input
                  type="text"
                  name="ssId"
                  value={formData.ssId}
                  onChange={handleChange}
                  placeholder="เลขประกันสังคม"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="number"
                  step="0.01"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="ค่าชั่วโมง"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="number"
                  step="0.01"
                  name="overtimeRate"
                  value={formData.overtimeRate}
                  onChange={handleChange}
                  placeholder="ค่า OT"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* ========= Section 3 ========= */}
              <div className="space-y-4">
                <h4 className="text-blue-500 font-semibold">
                  ข้อมูลบัญชีธนาคาร
                </h4>
                <select
                  name="paymentChannel"
                  value={formData.paymentChannel}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">ช่องทางการชำระเงิน</option>
                  <option value="transfer">โอนเงิน</option>
                  <option value="cash">เงินสด</option>
                </select>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                >
                  <option value="saving">ออมทรัพย์</option>
                  <option value="current">สะสมทรัพย์</option>
                </select>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="ธนาคาร"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="เลขบัญชี"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  name="bankBranch"
                  value={formData.bankBranch}
                  onChange={handleChange}
                  placeholder="สาขา"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* ========= Section 4 ========= */}
              <div className="col-span-1 md:col-span-2 grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-blue-500 font-semibold">
                    จำนวนวันหยุดประจำปี
                  </h4>
                  <input
                    type="number"
                    name="leavePersonal"
                    value={formData.leavePersonal}
                    onChange={handleChange}
                    placeholder="ลากิจ (วัน/ปี)"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="number"
                    name="leaveVacation"
                    value={formData.leaveVacation}
                    onChange={handleChange}
                    placeholder="ลาพักร้อน (วัน/ปี)"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="number"
                    name="leaveSick"
                    value={formData.leaveSick}
                    onChange={handleChange}
                    placeholder="ลาป่วย (วัน/ปี)"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Permission */}
                <div className="space-y-4">
                  <h4 className="text-blue-500 font-semibold">
                    สิทธิการใช้งาน
                  </h4>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="อีเมล"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="รหัสผ่าน"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  />
                  <select
                    name="permission"
                    value={formData.permission}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">เลือกสิทธิ์</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <div className="flex items-center space-x-2">
                    <input
                      id="status"
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={handleChange}
                      className="accent-blue-500"
                    />
                    <label htmlFor="status">ใช้งาน</label>
                  </div>
                </div>
              </div>
            </form>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 mt-10">
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------- Success Modal --------------------------- */}
      {showSuccess && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-xs text-center animate-fade-in">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <p className="text-lg font-semibold mb-6">บันทึกข้อมูลสำเร็จ</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg shadow"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
