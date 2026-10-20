const newsRepository = require('../repositories/newsRepository');

class NewsService {
  async getNews(query = {}) {
    const list = await newsRepository.find(query);
    return list.map((item) => {
      const obj = item.toObject ? item.toObject() : { ...item };
      if (!obj.category) {
        obj.category = (Array.isArray(obj.tags) && obj.tags.length > 0) ? obj.tags[0] : 'News';
      }
      if (!Array.isArray(obj.tags) || obj.tags.length === 0) {
        obj.tags = [obj.category];
      }
      return obj;
    });
  }

  async createNews(data) {
    const title = (data.title || data.headline || data.name || '').trim();
    const content = (data.content || data.description || data.summary || data.caption || '').trim();

    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    const category = (data.category || (Array.isArray(data.tags) && data.tags[0]) || 'News').trim();
    const tags = Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : [category];

    const payload = {
      ...data,
      title,
      titleHi: (data.titleHi || title).trim(),
      content,
      contentHi: (data.contentHi || content).trim(),
      date: data.date || new Date().toISOString().split('T')[0],
      author: (data.author || 'संपादक, युवा क्रांति दल').trim(),
      image: data.image || data.imageUrl || (Array.isArray(data.images) && data.images[0]) || '',
      category,
      tags
    };

    return newsRepository.create(payload);
  }

  async updateNews(id, data) {
    const updateData = { ...data };
    if (updateData.title) {
      updateData.title = updateData.title.trim();
      if (!updateData.titleHi) updateData.titleHi = updateData.title;
    }
    if (updateData.description && !updateData.content) {
      updateData.content = updateData.description.trim();
    }
    if (updateData.content) {
      updateData.content = updateData.content.trim();
      if (!updateData.contentHi) updateData.contentHi = updateData.content;
    }
    if (!updateData.image) {
      if (updateData.imageUrl) updateData.image = updateData.imageUrl;
      else if (Array.isArray(updateData.images) && updateData.images[0]) updateData.image = updateData.images[0];
    }
    if (data.category !== undefined || data.tags !== undefined) {
      const category = (data.category || (Array.isArray(data.tags) && data.tags[0]) || 'News').trim();
      updateData.category = category;
      updateData.tags = Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : [category];
    }

    const news = await newsRepository.updateById(id, updateData);
    if (!news) throw new Error('News item not found');
    return news;
  }

  async deleteNews(id) {
    const news = await newsRepository.deleteById(id);
    if (!news) throw new Error('News item not found');
    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(news);
    return news;
  }
}

module.exports = new NewsService();
