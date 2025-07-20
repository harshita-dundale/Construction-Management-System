import express from 'express';
import multer from 'multer';
import cloudinary from '../cloudinaryConfig.js';

const router = express.Router();

// Use memory storage (image ko RAM me temporarily rakhne ke liye)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload-profile', upload.single('image'), async (req, res) => {
  try {
    const fileStr = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${fileStr}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'profile_pics',
    });

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

export default router;