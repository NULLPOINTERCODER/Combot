import { api } from "./api.js";

export const uploadService = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
