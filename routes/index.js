var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const url = 'https://www.healthgrades.com/physician/dr-emefre-udo-yp98t';

  request(url, function(error, response, html) {
    if(!error) {
      let $ = cheerio.load(html);

      let doctor, total, rating;
      let json = {doctor: "", total: "", rating: ""};
    }
  });
  const data = {
    stuff: 'abc'
  };
  const vueOptions = {
    head: {
      title: 'Scrape your stuff',
      meta: [
        { property:'og:title', content: 'Scrape'},
      ]
    }
  }
  res.renderVue('index', data, vueOptions);
});

module.exports = router;
