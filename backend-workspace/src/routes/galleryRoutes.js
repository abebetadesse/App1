import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/gallery');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Mock gallery database
let galleryItems = [
  { 
    id: 1, 
    title: 'Team Building Event', 
    description: 'Annual team building activities',
    category: 'events',
    imageUrl: '/uploads/gallery/team-building.jpg',
    uploadDate: '2024-01-15',
    tags: ['team', 'fun', 'event'],
    uploadedBy: 'admin',
  },
  { 
    id: 2, 
    title: 'Office Workspace', 
    description: 'Our modern office environment',
    category: 'office',
    imageUrl: '/uploads/gallery/office.jpg',
    uploadDate: '2024-01-10',
    tags: ['office', 'work', 'environment'],
    uploadedBy: 'admin',
  },
];

// GET /api/gallery
router.get('/', (req, res) => {
  const { category, tag, search, limit = 20, offset = 0 } = req.query;
  
  let filteredItems = [...galleryItems];
  
  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }
  
  if (tag) {
    filteredItems = filteredItems.filter(item => 
      item.tags && item.tags.includes(tag)
    );
  }
  
  if (search) {
    filteredItems = filteredItems.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  const paginatedItems = filteredItems.slice(offset, offset + limit);
  
  res.json({
    success: true,
    message: 'Gallery items retrieved',
    data: {
      items: paginatedItems,
      pagination: {
        total: filteredItems.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(filteredItems.length / limit),
      },
      categories: [...new Set(galleryItems.map(item => item.category))],
      tags: [...new Set(galleryItems.flatMap(item => item.tags || []))],
    },
  });
});

// GET /api/gallery/:id
router.get('/:id', (req, res) => {
  const item = galleryItems.find(i => i.id === parseInt(req.params.id));
  
  if (item) {
    res.json({
      success: true,
      message: 'Gallery item details',
      data: item,
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Gallery item not found',
    });
  }
});

// POST /api/gallery/upload
router.post('/upload', (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({
      success: false,
      message: 'No image file uploaded',
    });
  }
  
  const image = req.files.image;
  const { title, description, category = 'general', tags = [] } = req.body;
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(image.mimetype)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP',
    });
  }
  
  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024;
  if (image.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 10MB',
    });
  }
  
  // Generate unique filename
  const fileExt = path.extname(image.name);
  const fileName = `gallery_${Date.now()}${fileExt}`;
  const filePath = path.join(uploadsDir, fileName);
  
  // Move file to uploads directory
  image.mv(filePath, (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to save image',
      });
    }
    
    // Create gallery item record
    const newItem = {
      id: galleryItems.length > 0 ? Math.max(...galleryItems.map(i => i.id)) + 1 : 1,
      title: title || `Image ${Date.now()}`,
      description: description || '',
      category,
      imageUrl: `/uploads/gallery/${fileName}`,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
      uploadedBy: req.session.userId || 'anonymous',
      fileSize: image.size,
      mimeType: image.mimetype,
    };
    
    galleryItems.push(newItem);
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: newItem,
    });
  });
});

// PUT /api/gallery/:id
router.put('/:id', (req, res) => {
  const itemIndex = galleryItems.findIndex(i => i.id === parseInt(req.params.id));
  
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Gallery item not found',
    });
  }
  
  galleryItems[itemIndex] = {
    ...galleryItems[itemIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  
  res.json({
    success: true,
    message: 'Gallery item updated',
    data: galleryItems[itemIndex],
  });
});

// DELETE /api/gallery/:id
router.delete('/:id', (req, res) => {
  const itemIndex = galleryItems.findIndex(i => i.id === parseInt(req.params.id));
  
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Gallery item not found',
    });
  }
  
  const deletedItem = galleryItems.splice(itemIndex, 1)[0];
  
  // Try to delete the actual file
  if (deletedItem.imageUrl) {
    const filePath = path.join(__dirname, '../../', deletedItem.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete file:', err);
      });
    }
  }
  
  res.json({
    success: true,
    message: 'Gallery item deleted',
    data: deletedItem,
  });
});

// GET /api/gallery/categories
router.get('/categories/stats', (req, res) => {
  const categoryStats = {};
  
  galleryItems.forEach(item => {
    if (!categoryStats[item.category]) {
      categoryStats[item.category] = {
        count: 0,
        latestUpload: '',
        tags: new Set(),
      };
    }
    
    categoryStats[item.category].count++;
    
    if (!categoryStats[item.category].latestUpload || 
        item.uploadDate > categoryStats[item.category].latestUpload) {
      categoryStats[item.category].latestUpload = item.uploadDate;
    }
    
    if (item.tags) {
      item.tags.forEach(tag => categoryStats[item.category].tags.add(tag));
    }
  });
  
  const formattedStats = Object.entries(categoryStats).map(([category, stats]) => ({
    category,
    count: stats.count,
    latestUpload: stats.latestUpload,
    tags: Array.from(stats.tags),
  }));
  
  res.json({
    success: true,
    message: 'Gallery category statistics',
    data: formattedStats,
  });
});

export default router;