const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/:id/:filename', (req, res) => {
  const { id, filename } = req.params;
  const filePath = path.join(__dirname, '..', 'files', id, filename);

  res.sendFile(filePath);
});

module.exports = router;
