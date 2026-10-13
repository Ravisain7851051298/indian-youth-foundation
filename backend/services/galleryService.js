const galleryRepository = require('../repositories/galleryRepository');

class GalleryService {
  async getGallery(query = {}) {
    return galleryRepository.find(query);
  }

  async createGallery(data) {
    if (!data.title || !data.url) {
      throw new Error('Title and media URL are required');
    }
    return galleryRepository.create(data);
  }

  async deleteGallery(id) {
    const item = await galleryRepository.deleteById(id);
    if (!item) throw new Error('Gallery item not found');
    return item;
  }
}

module.exports = new GalleryService();
