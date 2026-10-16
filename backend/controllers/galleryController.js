const galleryService = require('../services/galleryService');

const isVideoUrl = (url = '') => /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i.test(url) || /youtube\.com|youtu\.be/i.test(url);

const getGallery = async (req, res) => {
  try {
    const { category, mediaType, search, q } = req.query;
    const query = {};
    const searchTerm = (search || q || '').trim();

    if (category && category.toLowerCase() !== 'all') {
      if (category.toLowerCase() === 'photo' || category.toLowerCase() === 'video') {
        query.$or = [
          { category: new RegExp(`^${category}$`, 'i') },
          { mediaType: category.toLowerCase() }
        ];
      } else {
        query.category = new RegExp(`^${category}$`, 'i');
      }
    }

    if (mediaType && mediaType.toLowerCase() !== 'all') {
      query.mediaType = mediaType.toLowerCase();
    }

    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      const searchConditions = [
        { title: regex },
        { caption: regex },
        { category: regex }
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    const gallery = await galleryService.getGallery(query);
    return res.json({ success: true, gallery, data: gallery, total: gallery.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createGallery = async (req, res) => {
  try {
    if (req.file) {
      const cat = req.file.category || 'gallery';
      req.body.url = `/uploads/${cat}/${req.file.filename}`;
    } else if (req.body.imageUrl && !req.body.url) {
      req.body.url = req.body.imageUrl;
    } else if (req.body.image && !req.body.url) {
      req.body.url = req.body.image;
    } else if (req.body.videoUrl && !req.body.url) {
      req.body.url = req.body.videoUrl;
    }

    // Auto-detect mediaType
    const url = req.body.url || '';
    const isVid =
      req.body.mediaType === 'video' ||
      req.body.category === 'video' ||
      Boolean(req.body.videoUrl) ||
      (req.file && (req.file.mimetype?.startsWith('video/') || isVideoUrl(req.file.filename))) ||
      isVideoUrl(url);

    req.body.mediaType = isVid ? 'video' : 'photo';
    if (isVid) {
      req.body.videoUrl = req.body.videoUrl || url;
    } else {
      req.body.imageUrl = req.body.imageUrl || url;
    }

    const galleryItem = await galleryService.createGallery(req.body);
    return res.status(201).json({
      success: true,
      message: 'Item added to gallery',
      galleryItem,
      data: galleryItem
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.file) {
      const cat = req.file.category || 'gallery';
      req.body.url = `/uploads/${cat}/${req.file.filename}`;
    } else if (req.body.imageUrl && !req.body.url) {
      req.body.url = req.body.imageUrl;
    } else if (req.body.image && !req.body.url) {
      req.body.url = req.body.image;
    } else if (req.body.videoUrl && !req.body.url) {
      req.body.url = req.body.videoUrl;
    }

    const url = req.body.url || '';
    const isVid =
      req.body.mediaType === 'video' ||
      req.body.category === 'video' ||
      Boolean(req.body.videoUrl) ||
      (req.file && (req.file.mimetype?.startsWith('video/') || isVideoUrl(req.file.filename))) ||
      isVideoUrl(url);

    if (url) {
      req.body.mediaType = isVid ? 'video' : 'photo';
      if (isVid) {
        req.body.videoUrl = req.body.videoUrl || url;
      } else {
        req.body.imageUrl = req.body.imageUrl || url;
      }
    }

    const galleryItem = await galleryService.updateGallery(id, req.body);
    return res.json({
      success: true,
      message: 'Gallery item updated successfully',
      galleryItem,
      data: galleryItem
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    await galleryService.deleteGallery(id);
    return res.json({
      success: true,
      message: 'Item removed from gallery',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery
};
