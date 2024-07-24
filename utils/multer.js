const multer = require("fastify-multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const today = new Date();
    const formattedDate = `${today.getDate()}-${
      today.getMonth() + 1
    }-${today.getFullYear()}-${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;
    cb(null, file.fieldname + "--" + formattedDate + "--" + file.originalname); // Fayl nomi
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      return cb(
        new Error("Faqat JPG yoki PNG formatdagi fayllarni yuklash mumkin(!"),
        false
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 20, // 20MB
  },
});

let fieldsUpload = (count) => upload.array("image", count);

const uploadFile = async (req) => {
  // console.log(req.files);
};

module.exports = {
  fieldsUpload,
  uploadFile,
  multer,
};
