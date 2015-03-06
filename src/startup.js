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
requirejs(['phaser', 'state/load', 'config', 'const'],
    function(Phaser, LoadState, Config, Const) {
        var game = new Phaser.Game(Const.MAP_WIDTH * Const.TILE_SIZE,
            Const.MAP_HEIGHT * Const.TILE_SIZE);
        game.state.add('load', LoadState);
        game.state.start('load');
    },
    function() {
        document.write("Error during module loading.");
    });