var debug = require('debug')('arduino-sunrise:index');

var path = require('path');
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cors = require('cors');
var http = require('http');

var app = express();
app.use(cors());
app.use(favicon(__dirname + '/www/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'www')));

var server = http.createServer(app);
server.listen(process.env.PORT || '8080');