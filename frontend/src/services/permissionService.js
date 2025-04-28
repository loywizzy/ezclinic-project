import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

/* ------------------------------------------------------
   CRUD helpers for /api/permissions (aka roles)
-------------------------------------------------------*/
export const listRoles = () => api.get("/permissions");
export const getRole   = (id) => api.get(`/permissions/${id}`);
export const createRole = (payload) => api.post("/permissions", payload);
export const updateRole = (id, payload) => api.put(`/permissions/${id}`, payload);
export const deleteRole = (id) => api.delete(`/permissions/${id}`);

// keep old names for backward‑compatibility with earlier code, if any
export const listPermissions   = listRoles;
export const getPermission     = getRole;
export const createPermission  = createRole;
export const updatePermission  = updateRole;
export const deletePermission  = deleteRole;

export default {
  listRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
};