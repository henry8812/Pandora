const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const comments = require('../DAO/comments')

router.post('/', async (req, res) => {
    // Lógica para cerrar sesión del usuario
    console.log(JSON.stringify(req.body, null, 4))
    const {object_id, comment, rating, object_type} = req.body
    const sessionId = req.cookies.sessionId;
    const email = sessionId;
    let author = email
    console.log(object_id)
    console.log(comment)
    console.log(rating)
    console.log(object_type)
    const commentData = {
        object_id,
        author,
        comment,
        object_type
      };

      let response = await comments.createComment(commentData)
      console.log(response)

    res.send({
        status:"sucess"
    })
  });
  
module.exports = router;
