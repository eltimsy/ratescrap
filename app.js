var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressVue = require('express-vue');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/ttse', { operatorsAliases: false });

var index = require('./routes/index');
var users = require('./routes/users');
var doctorAPI = require('./routes/doctorAPI');
const secrets = require('./config.js');

var app = express();

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
app.set('secrets', secrets)
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/doctorapi', doctorAPI);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
  res.renderVue('error');
});

module.exports = app;
