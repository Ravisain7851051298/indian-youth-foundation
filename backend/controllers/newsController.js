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
    if (req.file) {
      const category = req.file.category || 'news';
      req.body.image = `/uploads/${category}/${req.file.filename}`;
    } else if (req.body.imageUrl && !req.body.image) {
      req.body.image = req.body.imageUrl;
    } else if (Array.isArray(req.body.images) && req.body.images.length > 0 && !req.body.image) {
      req.body.image = req.body.images[0];
    }

    if (!req.body.content && req.body.description) {
      req.body.content = req.body.description;
    }

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
    if (req.file) {
      const category = req.file.category || 'news';
      req.body.image = `/uploads/${category}/${req.file.filename}`;
    } else if (req.body.imageUrl && !req.body.image) {
      req.body.image = req.body.imageUrl;
    } else if (Array.isArray(req.body.images) && req.body.images.length > 0 && !req.body.image) {
      req.body.image = req.body.images[0];
    }

    if (!req.body.content && req.body.description) {
      req.body.content = req.body.description;
    }

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
