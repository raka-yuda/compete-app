var express = require('express');
var router = express.Router();
const { getDataSeminar, getDataContest } = require("./controller")
const { isAuthenticated } = require("../middleware/auth");

/* GET home page. */
router.get('/seminar', isAuthenticated, getDataSeminar);
router.get('/contest', isAuthenticated, getDataContest);

module.exports = router;

