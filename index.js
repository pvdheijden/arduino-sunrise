var debug = require('debug')('arduino-sunrise:index');

var path = require('path');
var express = require('express');
var session = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var validator = require('express-validator');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/www/favicon.ico'));
app.use(logger('dev'));
app.use(session({
    'name': 'arduino-sunrise.sid',
    'secret': 'arduino-sunrise',
    'cookie': {
        'maxAge': null
    },
    'resave': false,
    'saveUninitialized': true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(express.static(path.join(__dirname, 'www')));

var arduinoPort = require('./lib/arduino-port');

app.get('/', function(req, res) {
    res.render('index', {
        publish_key   : process.env.PN_PUBLISH_KEY,
        subscribe_key : process.env.PN_SUBSCRIBE_KEY,
        init: {
            lightVal: arduinoPort.values[0]
        }
    });
});

module.exports = app;