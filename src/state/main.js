define(['phaser', 'const', 'config'], function(Phaser, Const, Config) {
    var state = new Phaser.State();
    var player;
    var map;
    var collisionLayer;
    var pickupsLayer;
    var cursors;
    var speed = Config.playerSpeed;
    var currentTile;
    var direction = Phaser.DOWN;
    var threshold = 3;
    state.create = function() {
        state.game.stage.backgroundColor = 0xFFFFFF;
        map = state.add.tilemap('test');
        map.addTilesetImage('test-tiles', 'tiles');
        collisionLayer = map.createLayer('collision');
        map.setCollision(1, true, collisionLayer);
        pickupsLayer = map.createLayer('pickups');
        player = state.add.sprite(Const.TILE_SIZE * 1.5,
            Const.TILE_SIZE * 1.5, 'badman');
        state.physics.arcade.enable(player);
        player.anchor.set(0.5); // removing this causes weird placement...

        cursors = state.input.keyboard.createCursorKeys();
        currentTile = new Phaser.Point();
    };
    state.update = function() {
        // allow reversing direction any time
        if (cursors.up.isDown && direction === Phaser.DOWN) direction = Phaser.UP;
        if (cursors.down.isDown && direction === Phaser.UP) direction = Phaser.DOWN;
        if (cursors.left.isDown && direction === Phaser.RIGHT) direction = Phaser.LEFT;
        if (cursors.right.isDown && direction === Phaser.LEFT) direction = Phaser.RIGHT;
        // allow turning if at intersection...
        if (state.math.fuzzyEqual(player.x, currentTile.x + Const.TILE_SIZE / 2, threshold) &&
            state.math.fuzzyEqual(player.y, currentTile.y + Const.TILE_SIZE / 2, threshold)) {
            // ...and target tile is open
            if (cursors.up.isDown && map.getTileAbove(map.getLayerIndex('collision'), currentTile.x / 32, currentTile.y / 32).isInteresting(true)) return;
            if (cursors.down.isDown && map.getTileBelow(map.getLayerIndex('collision'), currentTile.x / 32, currentTile.y / 32).isInteresting(true)) return;
            if (cursors.left.isDown && map.getTileLeft(map.getLayerIndex('collision'), currentTile.x / 32, currentTile.y / 32).isInteresting(true)) return;
            if (cursors.right.isDown && map.getTileRight(map.getLayerIndex('collision'), currentTile.x / 32, currentTile.y / 32).isInteresting(true)) return;
            // this is just a horrible proof-of-concept
            var newDirection = null;
            if (cursors.up.isDown) newDirection = Phaser.UP;
            if (cursors.down.isDown) newDirection = Phaser.DOWN;
            if (cursors.left.isDown) newDirection = Phaser.LEFT;
            if (cursors.right.isDown) newDirection = Phaser.RIGHT;
            // if player turned, rectify position to currentTile
            var turned = false;
            if (direction === Phaser.UP && (newDirection === Phaser.LEFT || newDirection === Phaser.RIGHT)) turned = true;
            if (direction === Phaser.DOWN && (newDirection === Phaser.LEFT || newDirection === Phaser.RIGHT)) turned = true;
            if (direction === Phaser.LEFT && (newDirection === Phaser.UP || newDirection === Phaser.DOWN)) turned = true;
            if (direction === Phaser.RIGHT && (newDirection === Phaser.UP || newDirection === Phaser.DOWN)) turned = true;
            if (turned) {
                player.x = currentTile.x + Const.TILE_SIZE / 2;
                player.y = currentTile.y + Const.TILE_SIZE / 2;
                player.body.reset(player.x, player.y);
            }
            if (newDirection)
                direction = newDirection;
        }
        // move player in correct direction
        player.body.velocity.set(0);
        switch (direction) {
            case Phaser.UP:
                player.body.velocity.y = -speed;
                break;
            case Phaser.DOWN:
                player.body.velocity.y = speed;
                break;
            case Phaser.LEFT:
                player.body.velocity.x = -speed;
                break;
            case Phaser.RIGHT:
                player.body.velocity.x = speed;
                break;
        }
        currentTile.x = state.math.snapToFloor(Math.floor(player.x),
            Const.TILE_SIZE);
        currentTile.y = state.math.snapToFloor(Math.floor(player.y),
            Const.TILE_SIZE);
        state.physics.arcade.collide(player, collisionLayer);
    };
    state.render = function() {
        state.game.debug.geom(currentTile, '#F00');
        state.game.debug.text("Player X: " + player.x, 20, 20);
        state.game.debug.text("Player Y: " + player.y, 20, 40);
        state.game.debug.text("Direction: " + direction, 20, 60);
        state.game.debug.text("Current Tile X: " + currentTile.x, 20, 80);
        state.game.debug.text("Current Tile Y: " + currentTile.y, 20, 100);
    };
    return state;
});