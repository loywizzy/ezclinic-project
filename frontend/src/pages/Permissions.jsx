import React, { useEffect, useState } from "react";
import permissionService from "../services/permissionService.js";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

/* ----------------------------------------------------------------------
  Constants
------------------------------------------------------------------------*/
const MODULES = [
  { key: "customers", label: "ลูกค้า" },
  { key: "employees", label: "พนักงาน" },
  { key: "positions", label: "ตำแหน่ง" },
];
const ACTIONS = ["view", "create", "update", "delete"];

/* ----------------------------------------------------------------------
  Component
------------------------------------------------------------------------*/
export default function Permissions() {
  /* ----------------------------- state --------------------------------*/
  const emptyForm = {
    id: "", // id string for edit, empty for create
    name: "",
    permissions: MODULES.reduce((acc, m) => {
      acc[m.key] = ACTIONS.reduce((o, a) => ({ ...o, [a]: false }), {});
      return acc;
    }, {}),
  };

  const [list, setList] = useState([]); // list of role rows
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  /* ----------------------------- effects ------------------------------*/
  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await permissionService.listRoles();
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Roles API error", err);
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  /* --------------------------- handlers -------------------------------*/
  const openCreate = () => {
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEdit = (role) => {
    // สร้างโครง nested-state สำหรับฟอร์ม
    const nested = MODULES.reduce((acc, m) => {
      const modPerm = role.permissions?.[m.key] || {}; // ← object ของโมดูลนั้น
      acc[m.key] = ACTIONS.reduce((o, a) => {
        o[a] = !!modPerm[a]; // true / false
        return o;
      }, {});
      return acc;
    }, {});

    setFormData({
      id: role.id,
      name: role.name,
      permissions: nested,
    });
    setShowForm(true);
  };

  const handleToggle = (moduleKey, action) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleKey]: {
          ...prev.permissions[moduleKey],
          [action]: !prev.permissions[moduleKey][action],
        },
      },
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    // trim + validate
    if (!formData.name.trim()) {
      alert("กรุณากรอกชื่อสิทธิ์ผู้ใช้งาน");
      return;
    }

    // payload ที่ API main.go รออยู่ → permissions = object
    const payload = {
      name: formData.name.trim(),
      permissions: formData.permissions, // already { moduleKey: {view,…} }
    };

    try {
      if (formData.id) {
        await permissionService.updateRole(formData.id, payload);
      } else {
        await permissionService.createRole(payload);
      }
      setShowForm(false);
      setShowSuccess(true);
      fetchList(); // รีเฟรชตาราง
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "บันทึกไม่สำเร็จ");
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("ยืนยันลบสิทธิ์การใช้งาน?")) return;
    try {
      await permissionService.deleteRole(id);
      fetchList();
    } catch (err) {
      console.error(err);
    }
  };

  /* ----------------------------- render -------------------------------*/
  return (
    <div className="p-8">
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">สิทธิ์การใช้งาน</h2>
        <button
          onClick={openCreate}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow"
        >
          <FaPlus className="mr-2" /> เพิ่มข้อมูล
        </button>
      </div>

      {/* table */}
      {loading ? (
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase leading-normal">
                <th className="py-3 px-6 text-left">รหัส</th>
                <th className="py-3 px-6 text-left">ชื่อสิทธิ์การใช้งาน</th>
                <th className="py-3 px-6 text-left">โมดูลที่เปิดสิทธิ์</th>
                <th className="py-3 px-6 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {list.length ? (
                list.map((role) => (
                  <tr
                    key={role.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6">{role.id}</td>
                    <td className="py-3 px-6">{role.name}</td>
                    <td className="py-3 px-6 truncate max-w-xs">
                      {(() => {
                        const enabled = Object.entries(role.permissions || {})
                          // เหลือเฉพาะโมดูลที่มี flag ใด ๆ เป็น true
                          .filter(([, flags]) =>
                            Object.values(flags).some(Boolean)
                          )
                          // เอาเฉพาะชื่อโมดูล
                          .map(([module]) => module);

                        // ถ้า enabled ว่างให้แสดงขีด
                        return enabled.length ? enabled.join(", ") : "–";
                      })()}
                    </td>
                    <td className="py-3 px-6 text-center space-x-2">
                      <button
                        onClick={() => openEdit(role)}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-400">
                    ไม่มีข้อมูลสิทธิ์
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* footer */}
      {!loading && (
        <p className="text-xs text-gray-400 mt-10">
          © 2025, Made with SmartCarePro
        </p>
      )}

      {/* modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh] animate-scale-in">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setShowForm(false)}
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold mb-4">สิทธิ์ผู้ใช้งาน</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">
                  ชื่อสิทธิ์ผู้ใช้งาน
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="bg-blue-500 text-white">
                      <th className="py-2 px-4 text-left">โมดูล</th>
                      {ACTIONS.map((a) => (
                        <th
                          key={a}
                          className="py-2 px-4 text-center capitalize"
                        >
                          {a}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MODULES.map((m) => (
                      <tr key={m.key} className="border-b">
                        <td className="py-2 px-4">{m.label}</td>
                        {ACTIONS.map((act) => (
                          <td key={act} className="py-2 px-4 text-center">
                            <input
                              type="checkbox"
                              className="accent-blue-500"
                              checked={formData.permissions[m.key][act]}
                              onChange={() => handleToggle(m.key, act)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* success modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl text-center max-w-xs w-full">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <p className="text-lg font-semibold mb-6">บันทึกข้อมูลสำเร็จ</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
