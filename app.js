'use strict';
require('dotenv').config()
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressVue = require('express-vue');
const passport = require('passport')
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_HOST, { operatorsAliases: false });

const index = require('./routes/index');
const users = require('./routes/users');
const doctorAPI = require('./routes/api/doctorAPI');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY
});

const app = express();

// view engine setup
const vueOptions = {
  rootPath: path.join(__dirname, 'views'),
  layout: {
    start: '<div id="app">',
    end: '</div>'
  }
};
const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);
app.set('sequelize', sequelize)
app.set('googleMapsClient', googleMapsClient)
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(require('express-session')({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./authenticate/init')(passport);
const login = require('./routes/login')(passport);

app.use('/', index);
app.use('/login', login);
app.use('/users', users);
app.use('/doctorapi', doctorAPI);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  const vueOptions = {
    head: {
      meta: [
        { script: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.8/vue.min.js' },
      ]
    }
  }
  res.renderVue('error', vueOptions);
});

module.exports = app;
