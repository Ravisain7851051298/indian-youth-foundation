const galleryService = require('../services/galleryService');

const getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) query.category = category;

    const gallery = await galleryService.getGallery(query);
    return res.json({ success: true, gallery, total: gallery.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createGallery = async (req, res) => {
  try {
    const galleryItem = await galleryService.createGallery(req.body);
    return res.status(201).json({
      success: true,
      message: 'Item added to gallery',
      galleryItem
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
  deleteGallery
};
