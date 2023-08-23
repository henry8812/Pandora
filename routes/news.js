const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const news = require('../DAO/news')
const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');

router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const { title, bannerurl, content, expiration_date } = req.body;
    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    let author = email
    
    if (!title) {
      return res.status(400).send('Missing required fields');
    }

    console.log(bannerurl)
    
    const newsData = {
      title,
      author: author,
      banner: bannerurl,
      content: content || '',
      expiration_date
    };
    
    await news.createNews(newsData);
    let response = {
      status: "success",
      message: "news created succesfully",
      data: newsData
    };  
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating news');
  }
});

module.exports = router;
