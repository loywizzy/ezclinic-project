import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// ดึงข้อมูลพนักงานทั้งหมด
export function listEmployees() {
  return api.get("/employees");
}

// ดึงข้อมูลพนักงานรายคน
export function getEmployee(id) {
  return api.get(`/employees/${id}`);
}

// สร้างพนักงานใหม่ (พร้อมแนบไฟล์)
export function createEmployee(formData) {
  return api.post("/employees", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// อัปเดตข้อมูลพนักงาน
export function updateEmployee(id, formData) {
  return api.put(`/employees/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// ลบพนักงาน
export function deleteEmployee(id) {
  return api.delete(`/employees/${id}`);
}

export default {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
