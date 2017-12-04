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
  const hgDoc = `${req.query.doctor}+healthgrades`
  let googleHGURL = `https://www.googleapis.com/customsearch/v1?key=${secrets.GOOGLE_SEARCH_API_KEY}&cx=${secrets.GOOGLE_SEARCH_CX}&q=${hgDoc}`
  const vDoc = `www.vitals.com+${req.query.doctor}`
  let googleVURL = `https://www.googleapis.com/customsearch/v1?key=${secrets.GOOGLE_SEARCH_API_KEY}&cx=${secrets.GOOGLE_SEARCH_CX}&q=${vDoc}`
  let json = []
  console.log(googleHGURL)
  console.log(googleVURL)
  let hg = new Promise((resolve, reject) => {
    rp(googleHGURL)
      .then(function (html) {
        let data = JSON.parse(html)
        url = data.items[0].link
        rp(url)
          .then(function(data) {
            json[0] = {doctor: "", total: "", rating: "", url: url};

            let $ = cheerio.load(data);

            json[0].doctor = $('title').html()
            json[0].total = $('.review-count.js-profile-scroll-link').text()
            json[0].rating = $('.provider-rating-score').text()

            rp(googleVURL)
              .then(function (html) {
                let data = JSON.parse(html)
                url = data.items[0].link
                rp(url)
                  .then(function(data) {
                    json[1] = {doctor: "", total: "", rating: "", url: url};

                    let $ = cheerio.load(data);

                    json[1].doctor = $('title').html()
                    json[1].total = $('.rating-links').text()
                    json[1].rating = $('.rating-text', '.valign.rating-5.count.center-align').text()

                    resolve('success');
                  })
                  .catch(function (err) {
                    // console.log(err)
                    reject(err);
                  })
              })
              .catch(function (err) {
                // console.log(err)
                reject(err);
              });
          })
          .catch(function (err) {
            console.log(err)
            reject(err);
          })
      })
      .catch(function (err) {
        console.log(err)
        reject(err);
      });
  });
  // let vitals = new Promise((resolve, reject) => {

  // });
  hg.then((resolve) => {
    console.log(json);
    // res.send(JSON.stringify(json));
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