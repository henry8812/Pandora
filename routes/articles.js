const express = require('express');
const router = express.Router();
const articles = require("../DAO/articles");
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

router.get('/', async(req, res) => {
  try {
    const items = await articles.listArticles();
    res.render('articles/index', { title: 'Articles', articles: items, req });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving articles');
  }
});

router.get('/new', async (req, res) => {
  try {
    res.render('articles/new', { title: 'New Article', req });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving new article form');
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, bannerurl, shortDescription, content } = req.body;

    if (!title || !shortDescription || !content) {
      return res.status(400).send('Missing required fields');
    }

    let bannerPath = '';

    if (bannerurl) {
      const fileName = `${uuidv4()}.jpg`;
      const imagePath = path.join(__dirname, '../public/assets/images/uploads', fileName);

      await downloadImage(bannerurl, imagePath);

      bannerPath = `/assets/images/uploads/${fileName}`;
    }

    const articleData = {
      title,
      banner: bannerPath,
      shortDescription,
      content,
    };

    await articles.createArticle(articleData);

    res.redirect('/articles');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating article');
  }
});

async function downloadImage(url, imagePath) {
  const response = await axios.get(url, { responseType: 'stream' });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

router.get('/:id', async (req, res) => {
  try {
    const article = await articles.getArticle(req.params.id);
    res.render('articles/article', { title: article.title, article: article, req });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving article');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const article = await articles.getArticle(req.params.id);
    res.render('articles/edit', { title: 'Edit Article', article: article, req });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving article');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, bannerurl, shortDescription, content } = req.body;

    const articleData = {
      title,
      bannerurl,
      shortDescription,
      content,
    };

    await articles.updateArticle(req.params.id, articleData);

    res.redirect(`/articles/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating article');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await articles.deleteArticle(req.params.id);

    res.redirect('/articles');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting article');
  }
});

router.post('/uploadBanner', async (req, res) => {
  try {
    if (!req.files || !req.files.banner) {
      return res.status(400).send('No banner image provided');
    }

    const banner = req.files.banner;
    const fileName = `${uuidv4()}.jpg`;
    const imagePath = path.join(__dirname, '/assets/images/uploads', fileName);

    await banner.mv(imagePath);

    const bannerPath = `/assets/images/uploads/${fileName}`;

    res.json({ imagePath: bannerPath });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading banner image');
  }
});

module.exports = router;
