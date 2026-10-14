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

  async updateGallery(id, data) {
    const item = await galleryRepository.updateById(id, data);
    if (!item) throw new Error('Gallery item not found');
    return item;
  }

  async deleteGallery(id) {
    const item = await galleryRepository.deleteById(id);
    if (!item) throw new Error('Gallery item not found');
    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(item);
    return item;
  }
}

module.exports = new GalleryService();
