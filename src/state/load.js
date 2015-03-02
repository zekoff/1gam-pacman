define(['phaser', 'state/title'], function(Phaser, TitleState) {
    var state = new Phaser.State();
    state.preload = function() {
        // state.load.image('preload_sprite', 'my_preload_sprite.png');
    };
    state.create = function() {
        // set up preload sprite
        state.load.baseURL = '../assets/';
        state.load.tilemap('test', 'test_level_2.json', null, Phaser.Tilemap.TILED_JSON);
        state.load.image('tiles', 'test_tiles.png');
        state.load.image('badman', 'badman.png');
        state.load.onLoadComplete.add(function() {
            state.game.state.add('title', TitleState, true);
        });
        state.load.start();
    };
    return state;
});