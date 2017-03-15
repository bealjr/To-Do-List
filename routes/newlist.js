var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res, next) {
  res.render('newlist', {
    user: req.session.user || "guest"
  });
});

module.exports = router;

/* GET users listing. */
