define(['phaser', 'const', 'config'], function(Phaser, Const, Config) {
    var state = new Phaser.State();
    var player;
    var collisionLayer;
    var pickupsLayer;
    var cursors;
    var speed = Config.playerSpeed;
    state.create = function() {
        state.game.stage.backgroundColor = 0xFFFFFF;
        var map = state.add.tilemap('test');
        map.addTilesetImage('test-tiles', 'tiles');
        collisionLayer = map.createLayer('collision');
        map.setCollision(1, true, collisionLayer);
        pickupsLayer = map.createLayer('pickups');
        player = state.add.sprite(Const.TILE_SIZE * 1.5,
            Const.TILE_SIZE * 1.5, 'badman');
        state.physics.arcade.enable(player);
        player.anchor.set(0.5);

        cursors = state.input.keyboard.createCursorKeys();
    };
    state.update = function() {
        if (cursors.left.isDown) player.body.velocity.x = -speed;
        else if (cursors.right.isDown) player.body.velocity.x = speed;
        else if (cursors.up.isDown) player.body.velocity.y = -speed;
        else if (cursors.down.isDown) player.body.velocity.y = speed;
        else player.body.velocity.set(0);
        state.physics.arcade.collide(player, collisionLayer);
    };
    return state;
});