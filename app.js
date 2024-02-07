var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var expressValidator=require('express-validator')
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload=(multer({dest:'./uploads'}));
var flash = require('connect-flash');
var bcrypt=require('bcryptjs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db=mongoose.connection;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var crudRouter = require('./routes/crud');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Handle sessions
app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//validator
const { check, validationResult } = require('express-validator');

app.post('/', [
  // username must be an email
  check('username').isEmail(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 })
], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => res.json(user));
});

app.use(require('connect-flash')());
app.use(function(req,res,next){
  res.locals.messages=require('express-messages')(req,res);
  next();
});
app.get('*',function(req,res,next){
  res.locals.person=req.user || null;
next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/crud', crudRouter);
app.listen(5001,function(){
  console.log('listening on port 5001');
});
module.exports = app;