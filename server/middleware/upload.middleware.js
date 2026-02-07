import multer from 'multer';

// Memory storage for Base64 conversion
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  }
});

/**
 * Helper to convert file buffer to Base64 data URI
 * @param {Object} file - The file object from req.file
 * @returns {string} - The Base64 string with data URI prefix
 */
export const fileToBase64 = (file) => {
  if (!file) return null;
  const b64 = Buffer.from(file.buffer).toString('base64');
  return `data:${file.mimetype};base64,${b64}`;
};

export default upload;
