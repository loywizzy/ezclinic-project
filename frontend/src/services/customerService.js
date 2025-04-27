import axios from 'axios';

// ตั้งค่า base URL ให้ตรงกับ backend ของคุณ
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// ดึงรายการลูกค้า
export function listCustomers() {
  return api.get('/customers');
}

// สร้างลูกค้าใหม่
export function createCustomer(data) {
  return api.post('/customers', data);
}

// แก้ไขลูกค้า
export function updateCustomer(id, data) {
  return api.put(`/customers/${id}`, data);
}

// ลบลูกค้า
export function deleteCustomer(id) {
  return api.delete(`/customers/${id}`);
}

// Default export รวมทุกฟังก์ชัน
export default {
  listCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
