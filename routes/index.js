var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const data = {
    stuff: 'abc'
  };
  const vueOptions = {
    head: {
      title: 'Scrape your stuff',
      meta: [
        { script: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.8/vue.min.js' },
        { script: 'https://unpkg.com/axios/dist/axios.min.js'},
        { property:'og:title', content: 'Scrape'},
      ]
    }
  }
  res.renderVue('index', data, vueOptions);
});

module.exports = router;
