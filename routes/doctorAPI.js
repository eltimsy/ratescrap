'use strict';
require('dotenv').config()
const express = require('express');
const router = express.Router();
const fs = require('fs');
const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');

let json = [];

function getData(clicked, url, scrapeVars, callback) {
  if(clicked === 'true' && url) {
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
  if(clicked === 'true' && url) {
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

function getYelp(clicked, url, callback) {
  if(clicked === 'true') {
    rp(url)
    .then(function(data) {
      let $ = cheerio.load(data);
      let yelplink = $('.biz-name.js-analytics-click', '.indexed-biz-name').attr('href');
      if(yelplink) {
        let doctorURL = `https://www.yelp.com${yelplink}`;
        rp(doctorURL)
        .then(function (data) {
          let $ = cheerio.load(data);

          json.push({doctor: $('title').html(),
                  total: $('.review-count.rating-qualifier').first().text(),
                  rating: $('.i-stars.rating-very-large').attr('title'),
                  url: doctorURL})
          return callback()
        })
        .catch(function(error) {
          console.log(error)
        })
      } else {
        json.push({doctor: 'Yelp no results',
                total: '',
                rating: '',
                url: ''})
        return callback()
      }
    })
    .catch(function(error) {
      console.log(error)
    })
  } else {
    return callback()
  }
}

function getPlaces(clicked, url, callback) {
  if(clicked === 'true') {
    rp(url)
    .then(function(data){
      const placedata = JSON.parse(data)
      rp(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placedata.results[0].place_id}&key=${process.env.GOOGLE_MAPS_API_KEY}`)
        .then(function(data){
          const ratingdata = JSON.parse(data)
          console.log(ratingdata)
          let reviews = 'none'
          try {
            reviews = ratingdata.result.reviews.length;
          }
          catch(error) {
          }
          // if(reviews) {
          //   reviews = ratingdata.result.reviews.length;
          // } else {
          //   reviews = 'none'
          // }
          json.push({doctor: ratingdata.result.name,
                total: reviews,
                rating: ratingdata.result.rating,
                url: ratingdata.result.url})
          return callback()
        })
    })
    .catch(function(error) {
      console.log(error)
    })
  } else {
    return callback()
  }
}

router.get('/', function(req, res, next) {
  const scrapClasses = { hg: {total: '.review-count.js-profile-scroll-link', rating: '.provider-rating-score', type: 'hg'},
                      rmd: {total: '.star-rating-count', rating: '.star-rating', type: 'rmd'}}
  let url = '';
  let urlList = {vitals: [], ratemds: [], healthgrades: []};
  let searchcity = ''
  if(req.query.city !== 'false'){
    searchcity = req.query.city.replace(/\s+/g, '+')
  }
  let googleURL = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_CX}&q=${req.query.doctor}+${req.query.specialty}+${searchcity}`
  let searchdoctor = req.query.doctor.replace(/\s+/g, '+')
  let yelpURL = `https://www.yelp.com/search?find_desc=${searchdoctor}&find_loc=${searchcity}`
  let placesURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchdoctor}+${req.query.specialty}+${req.query.city}&key=${process.env.GOOGLE_PLACES_API_KEY}`

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
            getYelp(req.query.yelp, yelpURL, () => {
              getPlaces(req.query.places, placesURL, () => {
                console.log(json);
                res.send(JSON.stringify(json));
              })
            });
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