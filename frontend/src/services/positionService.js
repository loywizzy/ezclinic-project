import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export function listPositions() {
  return api.get("/positions");
}

export function getPosition(id) {
  return api.get(`/positions/${id}`);
}

export function createPosition(data) {
  return api.post("/positions", data);
}

export function updatePosition(id, data) {
  return api.put(`/positions/${id}`, data);
}

export function deletePosition(id) {
  return api.delete(`/positions/${id}`);
}

export default {
  listPositions,
  getPosition,
  createPosition,
  updatePosition,
  deletePosition,
};
