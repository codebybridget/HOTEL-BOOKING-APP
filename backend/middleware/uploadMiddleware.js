import multer from "multer";

// Temporary storage for Cloudinary uploads
const storage = multer.diskStorage({});

// Allow only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10, // Max 10 images
  },
});

export default upload;