import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // Giới hạn kích thước tệp tin là 50MB
  });
  

  export const uploadFile = (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        // Xử lý lỗi tải lên
        return res.status(500).json({ message: 'Upload failed!', error: err });
      }
      res.status(200).json({ message: 'Upload successful!', file: req.file });
    });
  };