var debug = require('debug')('arduino-sunrise:index');

var path = require('path');
var express = require('express');
var session = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var cors = require('cors');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(favicon(__dirname + '/www/favicon.ico'));
app.use(logger('dev'));
app.use(session({
    name: 'arduino-sunrise.sid',
    secret: 'arduino-sunrise',
    cookie: {
        maxAg: null
    },
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(express.static(path.join(__dirname, 'www')));

app.get('/', function(req, res) {
    res.render('index', {});
});

module.exports = app;