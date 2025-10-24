
const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

//Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage engine for multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'library-books', // Folder name in cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 500, height: 700, crop: 'limit'}], 
    },
});
 
const upload = multer({storage});

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const ext = path.extname(file.originalname);
//         cb(null, uniqueName + ext);
//     }
// });
// //File filter (only images)
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif/;
//     const ext = path.extname(file.originalname).toLowerCase();
//     const mime = file.mimetype;
//     if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image files (jpeg, png, gif) are allowed!'), false)
//     }
// };

// //Exporting configured multer
// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 2 * 1024 * 1024 }// max 2MB
// });

module.exports = upload;