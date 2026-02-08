import { upload } from '../config/cloudinary.js';

export const fileToBase64 = (file) => {
  // This function is deprecated with Cloudinary but kept to avoid breaking imports immediately if any.
  // However, with Cloudinary, req.file.path is the URL.
  return null;
};

export default upload;
