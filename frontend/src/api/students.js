import { api } from "./client";

export const listStudents = (params = {}) => api.get("/students/", { params });
export const getStudent = (id) => api.get(`/students/${id}/`);
export const createStudent = (payload) => api.post("/students/", payload);
export const updateStudent = (id, payload) => api.patch(`/students/${id}/`, payload);
export const deleteStudent = (id) => api.delete(`/students/${id}/`);

export const getMyStudentRecord = () => api.get("/students/me/");

export const uploadStudentPhoto = (id, file) => {
  const form = new FormData();
  form.append("photo", file);
  return api.post(`/students/${id}/photo/`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};