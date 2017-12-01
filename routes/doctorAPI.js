var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
const rp = require('request-promise');
var cheerio = require('cheerio');

router.get('/', function(req, res, next) {
  const secrets = req.app.get('secrets')
  let url = '';
  const doctor = `${req.query.doctor}+healthgrades`
  googleURL = `https://www.googleapis.com/customsearch/v1?key=${secrets.GOOGLE_SEARCH_API_KEY}&cx=${secrets.GOOGLE_SEARCH_CX}&q=${doctor}`
  rp(googleURL)
    .then(function (html) {
      let data = JSON.parse(html)
      url = data.items[0].link
      console.log(data.items[0].link)
      rp(url)
      .then(function(data) {
        let doctor, total, rating;
        let json = {doctor: "", total: "", rating: "", url: url};

        console.log('in')
        let $ = cheerio.load(data);

        json.doctor = $('title').html()
        json.total = $('.review-count.js-profile-scroll-link').text()
        json.rating = $('.provider-rating-score').text()

        console.log(json)

        res.send(JSON.stringify(json));
      })
      .catch(function (err) {
        console.log(err)
      })
    })
    .catch(function (err) {
      console.log(err)
    });
});

module.exports = router;