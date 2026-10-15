const News = require('../models/News');

class NewsRepository {
  async create(data) {
    const item = new News(data);
    return item.save();
  }

  async findById(id) {
    return News.findById(id);
  }

  async find(query = {}, sort = { createdAt: -1 }) {
    return News.find(query).sort(sort);
  }

  async updateById(id, data) {
    return News.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  }

  async deleteById(id) {
    return News.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return News.countDocuments(query);
  }
}

module.exports = new NewsRepository();
