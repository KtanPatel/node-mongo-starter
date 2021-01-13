var express = require('express');
var router = express.Router();
const apiRoutes = require("./api");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Node Mongodb - Boilerplate' });
});
router.get('/ping', function(req, res) {
  res.send("pong");
});

router.use('/api', apiRoutes);

module.exports = router;
