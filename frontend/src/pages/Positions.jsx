import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCheckCircle } from "react-icons/fa";
import positionService from "../services/positionService";

export default function Positions() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ id: "", name: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await positionService.listPositions();
      setList(res.data);
    } catch (err) {
      console.error("API Error:", err);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const openForm = (item = null) => {
    if (item) {
      setEditId(item.id);
      setFormData({ id: item.id, name: item.name });
    } else {
      setEditId(null);
      setFormData({ id: "", name: "" });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData:", formData);
    console.log("editId:", editId);
  
    try {
      if (editId) {
        await positionService.updatePosition(editId, {
          id: editId,
          name: formData.name,
        });
      } else {
        await positionService.createPosition(formData);
      }
      setShowForm(false);
      setShowSuccess(true);
      fetchList();
    } catch (err) {
      console.error("API Error:", err);
    }
  };
  

  const handleDelete = async (id) => {
    if (!confirm("ลบตำแหน่งนี้?")) return;
    try {
      await positionService.deletePosition(id);
      fetchList();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">ข้อมูลตำแหน่ง</h2>
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
              <th className="py-3 px-6 text-left">ชื่อตำแหน่ง</th>
              <th className="py-3 px-6 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {list.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-6 text-left">{item.id}</td>
                <td className="py-3 px-6 text-left">{item.name}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4 text-sm text-gray-500">
        แสดง 1-{list.length} จากทั้งหมด {list.length} รายการ
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold mb-4">{editId ? "แก้ไขตำแหน่ง" : "เพิ่มตำแหน่ง"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editId && (
                <div>
                  <label className="block text-sm mb-1">รหัส</label>
                  <input
                    type="text"
                    placeholder="รหัส (7 ตัวอักษร)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm mb-1">ชื่อตำแหน่ง</label>
                <input
                  type="text"
                  placeholder="ชื่อตำแหน่ง"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 text-center">
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
