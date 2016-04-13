/*
 root Route
*/
var express = require('express');
var router = express.Router();

// Initial page redirecting to Github
router.get('/', function (req, res) {
    res.json({message:"hello world"});
});

module.exports = router;
