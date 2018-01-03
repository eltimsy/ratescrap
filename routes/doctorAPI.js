'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');

let json = [];

function getData(clicked, url, scrapeVars, callback) {
  if(clicked === 'true') {
    rp(url)
      .then(function(data) {

        let $ = cheerio.load(data);
        let rating = '';

        if(scrapeVars.type === 'rmd') {
          rating = $(scrapeVars.rating).attr('title')
        } else {
          rating = $(scrapeVars.rating).text()
        }

        json.push({doctor: $('title').html(),
                total: $(scrapeVars.total).first().text(),
                rating: rating,
                url: url})

        return callback()
      })
      .catch(function(error) {
        console.log(error)
      })
  } else {
    return callback()
  }

}

function getVitals(clicked, url, callback) {
  if(clicked === 'true') {
    rp(url)
      .then(function(data) {
        json.push({doctor: "", total: "", rating: "", url: url});

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
  const scrapClasses = { hg: {total: '.review-count.js-profile-scroll-link', rating: '.provider-rating-score', type: 'hg'},
                      rmd: {total: '.star-rating-count', rating: '.star-rating', type: 'rmd'}}
  let url = '';
  let urlList = {vitals: [], ratemds: [], healthgrades: []};
  let googleURL = `https://www.googleapis.com/customsearch/v1?key=${secrets.GOOGLE_SEARCH_API_KEY}&cx=${secrets.GOOGLE_SEARCH_CX}&q=${req.query.doctor}`

  rp(googleURL)
    .then(function(html) {
      json = []
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

      getData(req.query.healthgrades, urlList['healthgrades'][0], scrapClasses.hg, () => {
        getVitals(req.query.vitals, urlList['vitals'][0], () => {
          getData(req.query.ratemds, urlList['ratemds'][0], scrapClasses.rmd,() => {
            console.log(json);
            res.send(JSON.stringify(json));
          });
        });
      });
    })
    .catch(function(err) {
      console.log(err)
      reject(err);
    });

});

module.exports = router;