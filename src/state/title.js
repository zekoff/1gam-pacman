define(['phaser'], function(Phaser) {
    var state = new Phaser.State();
    state.create = function() {
        state.game.stage.backgroundColor = 0xFFFFFF;
        var map = state.add.tilemap('test');
        map.addTilesetImage('test-tiles', 'tiles');
        var layer = map.createLayer('collision');
        map.setCollision(1, true, layer);
    };
    state.update = function() {};
    return state;
});