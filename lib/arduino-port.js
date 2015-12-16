var debug = require('debug')('arduino-sunrise:arduino-port');

var pubnub = require('pubnub')({
    ssl           : true,
    publish_key   : process.env.PN_PUBLISH_KEY,
    subscribe_key : process.env.PN_SUBSCRIBE_KEY
});


var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var arduinoPort = new SerialPort(process.env.SERIAL_PORT, {
    baudrate: 9600,
    parser: serialport.parsers.readline('\r\n')
});
arduinoPort.values = {};


arduinoPort.on('open', function(err) {
    if (err) {
        debug('serial port open error "%s"', err.message);
    }

    arduinoPort.on('data', function(data) {

        data = data.split(':');
        var port = parseInt(data[0]);
        var value = parseInt(data[1]);

        switch(port) {
            case 0: // light
                break;

            case 5: // temperature
                value = ((value * (5.0 / 1024.0)) - 0.5) * 100;
                break;

            default:
                break;
        }

        arduinoPort.values[port] = value;
        debug('serial port[%d] data "%d"', port, arduinoPort.values[port]);

        pubnub.publish({
            channel   : process.env.CHANNEL,
            message   : arduinoPort.values,
            callback  : function(err) {
                debug( 'measurement data published "%j"', err );
            },
            error     : function(err) { debug( 'failed to publish measurement data "%j"', err ); }
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