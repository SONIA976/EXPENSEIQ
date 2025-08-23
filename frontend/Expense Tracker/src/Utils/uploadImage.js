import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

export const uploadImage = async (file) => {
  try {
    console.log('Starting image upload for file:', file);
    const formData = new FormData();
    // Backend expects "image" field name
    formData.append("image", file);
    
    console.log('FormData created, sending to:', API_PATHS.IMAGE.UPLOAD_IMAGE);

    const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData);
    
    console.log('Upload response:', response.data);
    return response.data; // should include { imageUrl: "..." }
  } catch (error) {
    console.error("Error uploading image:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error;
  }
};
