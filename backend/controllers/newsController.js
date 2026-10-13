const newsService = require('../services/newsService');

const getNews = async (req, res) => {
  try {
    const news = await newsService.getNews();
    return res.json({ success: true, news, total: news.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createNews = async (req, res) => {
  try {
    const news = await newsService.createNews(req.body);
    return res.status(201).json({
      success: true,
      message: 'News published successfully',
      news
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await newsService.updateNews(id, req.body);
    return res.json({
      success: true,
      message: 'News article updated successfully',
      news
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    await newsService.deleteNews(id);
    return res.json({
      success: true,
      message: 'News article deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNews,
  createNews,
  updateNews,
  deleteNews
};
