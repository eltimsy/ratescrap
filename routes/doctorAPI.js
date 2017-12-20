'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');

let json = [];
let urlList = {vitals: [], ratemds: [], healthgrades: []};

function getHG(clicked, callback) {
  if(clicked === 'true') {
    rp(urlList['healthgrades'][0])
      .then(function(data) {

        let $ = cheerio.load(data);

        json.push({doctor: $('title').html(),
                total: $('.review-count.js-profile-scroll-link').text(),
                rating: $('.provider-rating-score').text(),
                url: urlList.healthgrades[0]})

        return callback()
      })
      .catch(function(error) {
        console.log(error)
      })
  } else {
    return callback()
  }

}

function getRMD(clicked, callback) {
  if(clicked === 'true') {
    rp(urlList['ratemds'][0])
      .then(function(data) {

        let $ = cheerio.load(data);

        json.push({doctor: $('title').html(),
                total: $('.star-rating-count').first().text(),
                rating: $('.star-rating').attr('title'),
                url: urlList.ratemds[0]})

        return callback()
      })
      .catch(function(error) {
        console.log(error)
      })
  } else {
    return callback()
  }

}

function getVitals(clicked, callback) {
  if(clicked === 'true') {
    rp(urlList['vitals'][0])
      .then(function(data) {
        json.push({doctor: "", total: "", rating: "", url: urlList['vitals'][0]});

        let $ = cheerio.load(data);

        json[json.length-1].doctor = $('title').html()
        json[json.length-1].total = $('.card-subtitle', '.card-content.no-pad-bot').first().text()
        if(json[json.length-1].total) {
          json[json.length-1].rating = $('.rating-text', '.rating-5.count').text()
        } else {
          json[json.length-1].total = $('.rating-links').text()
          json[json.length-1].rating = $('.rating-text', '.valign.rating-5.count.center-align').first().text()
        }
         return callback()
      })
      .catch(function(error) {
        console.log(error)
      })
    } else {
      return callback()
    }

}


router.get('/', function(req, res, next) {
  const secrets = req.app.get('secrets')
  let url = '';
  let googleURL = `https://www.googleapis.com/customsearch/v1?key=${secrets.GOOGLE_SEARCH_API_KEY}&cx=${secrets.GOOGLE_SEARCH_CX}&q=${req.query.doctor}`

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

        getHG(req.query.healthgrades, () => {
          getVitals(req.query.vitals, () => {
            getRMD(req.query.ratemds, () => {
              resolve('success');
            });
          });
        });
        // rp(urlList['healthgrades'][0])
        //   .then(function(data) {
        //     json[0] = {doctor: "", total: "", rating: "", url: urlList.healthgrades[0]};

        //     let $ = cheerio.load(data);

        //     json[0].doctor = $('title').html()
        //     json[0].total = $('.review-count.js-profile-scroll-link').text()
        //     json[0].rating = $('.provider-rating-score').text()

        //     rp(urlList['vitals'][0])
        //       .then(function(data) {
        //         json[1] = {doctor: "", total: "", rating: "", url: urlList.vitals[0]};

        //         let $ = cheerio.load(data);

        //         json[1].doctor = $('title').html()
        //         json[1].total = $('.card-subtitle', '.card-content.no-pad-bot').first().text()
        //         if(json[1].total) {
        //           json[1].rating = $('.rating-text', '.rating-5.count').text()
        //         } else {
        //           json[1].total = $('.rating-links').text()
        //           json[1].rating = $('.rating-text', '.valign.rating-5.count.center-align').first().text()
        //         }

        //         rp(urlList['ratemds'][0])
        //           .then(function(data) {
        //             json[2] = {doctor: "", total: "", rating: "", url: urlList.ratemds[0]};

        //             let $ = cheerio.load(data);

        //             json[2].doctor = $('title').html()
        //             json[2].total = $('.star-rating-count').first().text()
        //             json[2].rating = $('.star-rating').attr('title')

        //             resolve('success');
        //           })
        //           .catch(function(err) {
        //             reject(err);
        //           })
        //       })
        //       .catch(function(err) {
        //         // console.log(err)
        //         reject(err);
        //       })
        //   })
        //   .catch(function(err) {
        //     console.log(err)
        //     reject(err);
        //   })
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

module.exports = router;