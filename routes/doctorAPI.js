'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
const rp = require('request-promise');
var cheerio = require('cheerio');

router.get('/', function(req, res, next) {
  const secrets = req.app.get('secrets')
  let url = '';
  let urlList = {vitals: [], ratemds: [], healthgrades: []};
  let googleURL = `https://www.googleapis.com/customsearch/v1?key=${secrets.GOOGLE_SEARCH_API_KEY}&cx=${secrets.GOOGLE_SEARCH_CX}&q=${req.query.doctor}`
  let json = [];

  let hg = new Promise((resolve, reject) => {
    rp(googleURL)
      .then(function(html) {
        let data = JSON.parse(html)
        for(var i = 0; i < 10; i++) {
          if(data.items[i].link.match(/.\bwww\.vitals\.com.*reviews\b/) || data.items[i].link.match(/.\bwww\.vitals\.com.*\.html\b/)) {
            urlList.vitals.push(data.items[i].link)
          }
          if(data.items[i].link.match(/.www\.ratemds\.com*?/)) {
            urlList.ratemds.push(data.items[i].link)
          }
          if(data.items[i].link.match(/.www\.healthgrades\.com*?/)) {
            urlList.healthgrades.push(data.items[i].link)
          }
        }

        rp(urlList['healthgrades'][0])
          .then(function(data) {
            json[0] = {doctor: "", total: "", rating: "", url: urlList.healthgrades[0]};

            let $ = cheerio.load(data);

            json[0].doctor = $('title').html()
            json[0].total = $('.review-count.js-profile-scroll-link').text()
            json[0].rating = $('.provider-rating-score').text()

            rp(urlList['vitals'][0])
              .then(function(data) {
                json[1] = {doctor: "", total: "", rating: "", url: urlList.vitals[0]};

                let $ = cheerio.load(data);

                json[1].doctor = $('title').html()
                json[1].total = $('.card-subtitle', '.card-content.no-pad-bot').first().text()
                if(json[1].total) {
                  json[1].rating = $('.rating-text', '.rating-5.count').text()
                } else {
                  json[1].total = $('.rating-links').text()
                  json[1].rating = $('.rating-text', '.valign.rating-5.count.center-align').first().text()
                }

                resolve('success');
              })
              .catch(function(err) {
                // console.log(err)
                reject(err);
              })
          })
          .catch(function(err) {
            console.log(err)
            reject(err);
          })
      })
      .catch(function(err) {
        console.log(err)
        reject(err);
      });
  });

  hg.then((resolve) => {
    console.log(json);
    res.send(JSON.stringify(json));
  })
  .catch((error) => {
    console.log(error);
  })

});

// function getrating(googleURL) {
//   return new Promise((resolve, reject) => {
//     let url = ''
//     rp(googleURL)
//       .then(function (html) {
//       let data = JSON.parse(html)
//       url = data.items[0].link
//       console.log(data.items[0].link)
//     })
//   });
// }

module.exports = router;