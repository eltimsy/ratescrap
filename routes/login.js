var express = require('express');
const passport = require('passport')
var router = express.Router();

module.exports = function(passport) {
  router.get('/', function(req, res, next) {
    console.log('hello')
    const data = {
      user: 'none'
    };
    const vueOptions = {
      head: {
        title: 'Login',
        meta: [
          { script: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.8/vue.min.js' },
          { script: 'https://unpkg.com/axios/dist/axios.min.js' },
          { script: 'https://code.jquery.com/jquery-3.2.1.slim.min.js' },
          { script: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js' },
          { script: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js' },
          { style: 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css' },
          { property:'og:title', content: 'Stuff'},
        ]
      }
    }
    res.renderVue('login', data, vueOptions);
  });
  router.post('/',
    passport.authenticate('local'),
    function(req, res, next) {
      res.send('ok')
    });
  return router;
};
// module.exports = router;
