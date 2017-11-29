var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', function(req, res, next) {
  const sequelize = req.app.get('sequelize')
  const secrets = req.app.get('secrets')
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  googleURL = `https://www.googleapis.com/customsearch/v1?key=${secrets.GOOGLE_SEARCH_API_KEY}&cx=${secrets.GOOGLE_SEARCH_CX}&q=john+wick+healthgrades`
  request(googleURL, function (error, response, body) {
    console.log(error);
    console.log('body:', body);
  })
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
