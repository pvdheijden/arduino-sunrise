var debug = require('debug')('arduino-sunrise:arduino-port');

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var arduinoPort = new SerialPort(process.env.SERIAL_PORT, {
    'baudrate': 9600,
    'parser': serialport.parsers.readline('\r\n')
});

var pubnub = require('pubnub')({
    ssl           : true,
    publish_key   : process.env.PN_PUBLISH_KEY,
    subscribe_key : process.env.PN_SUBSCRIBE_KEY
});


arduinoPort.on('open', function(err) {
    if (err) {
        debug('serial port open error "%s"', err.message);
    }

    arduinoPort.on('data', function(data) {
        data = data.split(':');
        var port = parseInt(data[0]);
        var value = parseInt(data[1]);

        debug('serial port[%d] data "%d"', port, value);

        //var sun = {
        //    brightness: parseInt(data.toString('ascii'));
        //};

        pubnub.publish({
            channel   : 'sun',
            message   : value,
            callback  : function(err) {
                debug( 'sun data published "%j"', err );
            },
            error     : function(err) { debug( 'failed to publish sun data "%j"', err ); },
        });
    });

    arduinoPort.on('close', function() {
        debug('serial port closed');
    });

    arduinoPort.on('error', function(err) {
        debug('serial port error "%s"', err.message);
    });

});

module.exports = arduinoPort;