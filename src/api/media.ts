import { api } from "@/lib/api";

export const mediaClient = {
  uploadImage: api.uploadImage,
  deleteImage: (imageLocalPath: string) => api.delete<void>("/media/images", { imageLocalPath }),
};

