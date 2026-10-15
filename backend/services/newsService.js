const newsRepository = require('../repositories/newsRepository');

class NewsService {
  async getNews(query = {}) {
    return newsRepository.find(query);
  }

  async createNews(data) {
    const title = (data.title || data.headline || data.name || '').trim();
    const content = (data.content || data.description || data.summary || data.caption || '').trim();

    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    const payload = {
      ...data,
      title,
      titleHi: (data.titleHi || title).trim(),
      content,
      contentHi: (data.contentHi || content).trim(),
      date: data.date || new Date().toISOString().split('T')[0],
      author: (data.author || 'संपादक, भारतीय युवा क्रांति').trim(),
      image: data.image || data.imageUrl || (Array.isArray(data.images) && data.images[0]) || '',
      tags: Array.isArray(data.tags) ? data.tags : (data.category ? [data.category] : [])
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
