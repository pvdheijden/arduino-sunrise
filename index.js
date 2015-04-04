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

app.get('/', function(req, res) {
    res.render('index', {});
});

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var arduinoPort = new SerialPort('/dev/cu.usbmodem621', {
    'baudrate': 115200,
    'parser': serialport.parsers.readline('\r\n')
});

arduinoPort.on('open', function(err) {
    if (err) {
        debug('serial port open error "%s"', err.message);
    }

    arduinoPort.on('data', function(data) {
        debug('serial port data "%s"', data.toString('ascii'));
    });

    arduinoPort.on('close', function() {
        debug('serial port closed');
    });

    arduinoPort.on('error', function(err) {
        debug('serial port error "%s"', err.message);
    });

});


module.exports = app;