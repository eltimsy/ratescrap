var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
const rp = require('request-promise');
var cheerio = require('cheerio');

router.get('/', function(req, res, next) {
  const sequelize = req.app.get('sequelize')
  const secrets = req.app.get('secrets')
  // rp(url)
  //   .then(function(data) {
  //     let json = {doctor: "", total: "", rating: "", url: url};

  //     console.log('in')
  //     let $ = cheerio.load(data);

  //     json.doctor = $('title').html()
  //     json.total = $('.rating-links').text()
  //     json.rating = $('.rating-text').text()

  //     console.log(json)
  //   })
  //   .catch(function (err) {
  //     console.log(err)
  //   })
  // sequelize
  //   .authenticate()
  //   .then(() => {
  //     console.log('Connection has been established successfully.');
  //   })
  //   .catch(err => {
  //     console.error('Unable to connect to the database:', err);
  //   });
  const data = {
    stuff: 'abc'
  };
  const vueOptions = {
    head: {
      title: 'Scrape your stuff',
      meta: [
        { script: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.8/vue.min.js' },
        { script: 'https://unpkg.com/axios/dist/axios.min.js' },
        { script: 'https://code.jquery.com/jquery-3.2.1.slim.min.js' },
        { script: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js' },
        { script: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js' },
        { style: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css' },
        { property:'og:title', content: 'Scrape'},
      ]
    }
  }
  res.renderVue('index', data, vueOptions);
});

module.exports = router;
