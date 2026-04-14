import express from 'express';
const router = express.Router();
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.js';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Validate file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

router.post('/document', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    import externalServiceManager from '../server.js';.serviceManager.getExternalServiceManager();
    
    // Convert buffer to base64 for Cloudinary
    const fileBuffer = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${fileBuffer}`;
    
    const uploadResult = await externalServiceManager.uploadToCloudinary(dataURI, {
      folder: `tham-platform/documents/${req.user.id}`,
      resource_type: 'auto'
    });

    // Save document info to database
    import { Document } from '../models.js';
    await Document.create({
      userId: req.user.id,
      filename: req.file.originalname,
      fileUrl: uploadResult.secure_url,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      publicId: uploadResult.public_id
    });

    res.json({
      success: true,
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        format: uploadResult.format,
        bytes: uploadResult.bytes
      }
    });
  } catch (error) {
    console.error('File upload failed:', error);
    res.status(500).json({
      success: false,
      error: 'File upload failed',
      message: error.message
    });
  }
});

router.post('/profile-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image uploaded'
      });
    }

    import externalServiceManager from '../server.js';.serviceManager.getExternalServiceManager();
    
    const fileBuffer = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${fileBuffer}`;
    
    const uploadResult = await externalServiceManager.uploadToCloudinary(dataURI, {
      folder: `tham-platform/profile-images/${req.user.id}`,
      transformation: [
        { width: 400, height: 400, crop: 'fill' },
        { quality: 'auto' },
        { format: 'jpg' }
      ]
    });

    res.json({
      success: true,
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      }
    });
  } catch (error) {
    console.error('Profile image upload failed:', error);
    res.status(500).json({
      success: false,
      error: 'Image upload failed'
    });
  }
});

export default router;