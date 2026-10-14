const newsRepository = require('../repositories/newsRepository');

class NewsService {
  async getNews(query = {}) {
    return newsRepository.find(query);
  }

  async createNews(data) {
    if (!data.title || !data.content) {
      throw new Error('Title and content are required');
    }
    return newsRepository.create(data);
  }

  async updateNews(id, data) {
    const news = await newsRepository.updateById(id, data);
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
