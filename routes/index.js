var express = require('express');
var router = express.Router();

/* landing page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Events Map' });
});

module.exports = router;
