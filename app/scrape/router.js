var express = require('express');
var router = express.Router();
const { getDataSeminar, scrappingSeminar, getDataCompetition, scrappingCompetition } = require("./controller");

router.get('/seminar', getDataSeminar);
router.get('/scrape-seminar', scrappingSeminar);
router.get('/competition', getDataCompetition);
router.get('/scrape-competition', scrappingCompetition);


module.exports = router;
