const Gallery = require('../models/Gallery');

class GalleryRepository {
  async create(data) {
    const item = new Gallery(data);
    return item.save();
  }

  async findById(id) {
    return Gallery.findById(id);
  }

  async find(query = {}, sort = { createdAt: -1 }) {
    return Gallery.find(query).sort(sort);
  }

  async updateById(id, data) {
    return Gallery.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  }

  async deleteById(id) {
    return Gallery.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return Gallery.countDocuments(query);
  }
}

module.exports = new GalleryRepository();
