const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('GET /judge works');
});

module.exports = router;
