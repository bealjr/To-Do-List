var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var methodOverride = require('method-override');
var hbs = require("hbs");
// hbs.registerHelper("unless", function() {
//
// })


var routes = require('./routes/index');
var users = require('./routes/users');
var lists = require('./routes/lists');
var newlist = require('./routes/newlist');
var userSettings = require('./routes/usersettings');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret: 'poop',
  saveUninitialized: true, //Saving the session to a permanent storage like a database. That allows persistent login even when the server goes down. Sp when the server comes back up, the users are still logged in.
  resave: true//Even if nothing changed, go ahead and save it again (when true)
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use('/', routes);
app.use('/users', users);
app.use('/lists', lists);
app.use('/newlist', newlist);
app.use('/usersettings', userSettings);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
