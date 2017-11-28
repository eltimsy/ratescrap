var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

router.get('/', function(req, res, next) {
  const url = 'https://www.healthgrades.com/physician/dr-emefre-udo-yp98t';
  console.log(req.query)
  request(url, function(error, response, html) {
    let doctor, total, rating;
    let json = {doctor: "", total: "", rating: ""};

    if(!error) {
      console.log('in')
      let $ = cheerio.load(html);

      json.doctor = $('title').html()
      json.total = $('.review-count.js-profile-scroll-link').text()
      json.rating = $('.provider-rating-score').text()
      // $('.header').filter(function() {
      //   var data = $(this);

      //   title = data.children().first().text();
      //   json.doctor = title;
      // })
      console.log(json)
    }
    res.send(JSON.stringify(json));
  });
});

module.exports = router;