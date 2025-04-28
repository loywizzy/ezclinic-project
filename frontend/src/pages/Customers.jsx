import { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaCheckCircle,
  FaPhone,
} from "react-icons/fa";
import customerService from "../services/customerService";
import * as svc from "../services/customerService";

export default function Customers() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true); // เริ่ม loading
    try {
      const res = await customerService.listCustomers();
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data)
        ? res.data.customers
        : [];
      setList(data);
    } catch (err) {
      console.error("API Error:", err);
      setList([]);
    } finally {
      setLoading(false); // จบ loading
    }
  };

  // useEffect(() => { fetchList(); }, []);
  // const fetchList = async () => {
  //   try {
  //     const res = await svc.listCustomers();
  //     setList(res.data);
  //   } catch (err) { console.error(err); }
  // };

  const openForm = (item = null) => {
    if (item) {
      setEditId(item.id);
      setFormData({ name: item.name, phone: item.phone, email: item.email });
    } else {
      setEditId(null);
      setFormData({ name: "", phone: "", email: "" });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await svc.updateCustomer(editId, formData);
      else await svc.createCustomer(formData);
      setShowForm(false);
      setShowSuccess(true);
      fetchList();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("ลบรายการนี้?")) return;
    try {
      await svc.deleteCustomer(id);
      fetchList();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ข้อมูลลูกค้า</h2>
        <button
          onClick={() => openForm(null)}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow"
        >
          <FaPlus className="mr-2" /> เพิ่มข้อมูล
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">รหัส</th>
              <th className="py-3 px-6 text-left">ชื่อ - นามสกุล</th>
              <th className="py-3 px-6 text-left">เบอร์โทรศัพท์</th>
              <th className="py-3 px-6 text-left">อีเมล</th>
              <th className="py-3 px-6 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
          {list.map((item) => {
            const displayId = String(item.id).padStart(7, '0');
            return (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-6 text-left">{displayId}</td>
                <td className="py-3 px-6 text-left">{item.name}</td>
                <td className="py-3 px-6 text-left">{item.phone}</td>
                <td className="py-3 px-6 text-left">{item.email}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => openForm(item)}
                      className="text-yellow-500 hover:text-yellow-600 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4 text-sm text-gray-500">
        แสดง 1-{list.length} จากทั้งหมด {list.length} รายการ
      </div>
      <div className="flex justify-end space-x-2 mt-2">
        <button className="px-3 py-1 bg-white border rounded hover:bg-gray-100 transition">
          &lt;
        </button>
        {[...Array(7)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 border rounded transition ${
              i === 5 ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button className="px-3 py-1 bg-white border rounded hover:bg-gray-100 transition">
          &gt;
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-10">
        © 2025, Made with SmartCarePro
      </p>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-transform duration-300 scale-95 hover:scale-100">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {editId ? "แก้ไขลูกค้า" : "เพิ่มลูกค้า"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">ชื่อ - นามสกุล</label>
                <input
                  type="text"
                  placeholder="ชื่อ - นามสกุล"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">เบอร์โทรศัพท์</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="0812345678"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 pr-10"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                  <FaPhone className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">อีเมล</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                  onClick={() => setShowForm(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 text-center transform transition-transform">
            <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
            <p className="text-lg font-semibold mb-6">บันทึกข้อมูลสำเร็จ</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
