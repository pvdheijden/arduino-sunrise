'use strict';

var lightVal = 0;
var tempVal = 0;

var pubnub = PUBNUB.init({
    publish_key   : process.env.PN_PUBLISH_KEY,
    subscribe_key : process.env.PN_SUBSCRIBE_KEY,
    ssl: true
});

pubnub.subscribe({
    channel: process.env.PN_CHANNEL,
    message: function(values) {
        console.log('measurement values', values);

        if (values[0]) {
            lightVal = values[0];
            console.log('lightVal', lightVal);
        }

        if (values[5]) {
            tempVal = values[5];
            console.log('tempVal', tempVal);
        }
    }
});

var sun;
var tempText;

var preload = function () {

    game.load.image('sky', 'assets/sky.jpg');
    game.load.image('ground', 'assets/ground.png');

    game.load.image('sun', 'assets/sun.png');
};

var create = function () {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'sky');

    sun = game.add.sprite(game.world.centerX, game.world.height - 64, 'sun');
    sun.anchor.setTo(0.5, 0.5);

    tempText = game.add.text(game.world.centerX, game.world.height - 64, '...', {
        size: '20px',
        fill: '#FFF',
        align: 'center'
    });
    tempText.anchor.setTo(0.5, 0.5);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    var platforms = game.add.group();
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

};

var update = function() {
    var y = (-(game.world.height - 64) / 1023) * lightVal + (game.world.height - 64);

    sun.y = y;

    tempText.setText(tempVal.toFixed(1));
    tempText.y = y;
};

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
    preload: preload,
    create: create,
    update: update
});
