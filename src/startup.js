/* global requirejs */
requirejs.config({
    shim: {
        'phaser': {
            exports: 'Phaser'
        }
    },
    paths: {
        phaser: 'https://cdnjs.cloudflare.com/ajax/libs/phaser/2.2.2/phaser.min'
    }
});
requirejs(['phaser','state/load', 'config'], function(Phaser, LoadState) {
    var game = new Phaser.Game();
    game.state.add('load', LoadState);
    game.state.start('load');
}, function() {
    document.write("Error during module loading.");
});