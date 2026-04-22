const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'music_studio/uploads';
    let resource_type = 'auto'; // automatically determine image or raw/video

    if (file.fieldname === 'audio') {
      folder = 'music_studio/songs';
      resource_type = 'video'; // Cloudinary treats audio as video
    } else if (file.fieldname === 'cover') {
      folder = 'music_studio/songs_thumbnails';
      resource_type = 'image';
    } else if (file.fieldname === 'beatAudio') {
      folder = 'music_studio/beats';
      resource_type = 'video';
    } else if (file.fieldname === 'beatCover') {
      folder = 'music_studio/beats_covers';
      resource_type = 'image';
    } else if (file.fieldname === 'galleryImage') {
      folder = 'music_studio/gallery';
      resource_type = 'image';
    } else if (file.fieldname === 'serviceIcon') {
      folder = 'music_studio/services';
      resource_type = 'image';
    }

    return {
      folder: folder,
      resource_type: resource_type,
    };
  },
});

function checkFileType(file, cb) {
  let filetypes;
  if (file.fieldname === 'audio' || file.fieldname === 'beatAudio') {
    filetypes = /wav|mp3/;
  } else if (['cover', 'beatCover', 'galleryImage', 'serviceIcon'].includes(file.fieldname)) {
    filetypes = /jpg|jpeg|png|webp|svg/;
  } else {
    filetypes = /.*/;
  }

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Invalid File Type');
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 75 * 1024 * 1024 }, // 75MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, upload.fields([
  { name: 'audio', maxCount: 1 }, 
  { name: 'cover', maxCount: 1 },
  { name: 'beatAudio', maxCount: 1 },
  { name: 'beatCover', maxCount: 1 },
  { name: 'galleryImage', maxCount: 1 },
  { name: 'serviceIcon', maxCount: 1 }
]), (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  const payload = {};
  
  // With multer-storage-cloudinary, the URL is in file.path
  if (req.files.audio) payload.audioPath = req.files.audio[0].path;
  if (req.files.cover) payload.coverPath = req.files.cover[0].path;
  
  if (req.files.beatAudio) payload.beatAudioPath = req.files.beatAudio[0].path;
  if (req.files.beatCover) payload.beatCoverPath = req.files.beatCover[0].path;
  
  if (req.files.galleryImage) payload.galleryImagePath = req.files.galleryImage[0].path;
  if (req.files.serviceIcon) payload.serviceIconPath = req.files.serviceIcon[0].path;

  res.json({
    message: 'Files Uploaded',
    files: payload,
  });
});

module.exports = router;
