define(['phaser', 'const', 'config', 'util'], function(Phaser, Const, Config, Util) {
    var state = new Phaser.State();
    var player;
    var map;
    var collisionLayer;
    var pickupsLayer;
    var cursors;
    var currentTile;
    var threshold = Const.TURN_THRESHOLD_PX;
    var pickupsGroup;
    state.create = function() {
        Phaser.Canvas.setImageRenderingCrisp(state.game.canvas);
        state.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        state.scale.pageAlignHorizontally = true;
        state.scale.pageAlignVertically = true;
        state.game.stage.backgroundColor = 0xFFFFFF;
        map = state.add.tilemap('test');
        map.addTilesetImage('test-tiles', 'tiles');
        collisionLayer = map.createLayer('collision');
        map.setCollision(1, true, collisionLayer);
        pickupsLayer = map.createLayer('pickups');
        pickupsGroup = state.add.group();
        map.createFromTiles(4, 0, 'dot', pickupsLayer, pickupsGroup);
        state.physics.arcade.enable(pickupsGroup);
        player = state.add.sprite(Const.TILE_SIZE * 1.5,
            Const.TILE_SIZE * 1.5, 'badman');
        state.physics.arcade.enable(player);
        player.anchor.set(0.5);
        player.body.bounce = 0;
        player.direction = Phaser.DOWN;
        cursors = state.input.keyboard.createCursorKeys();
        player.speed = Config.playerSpeed;
        player.updateVelocity = function() {
            Util.setEntityVelocity.call(player);
        };
        player.snapToTile = function() {
            Util.snapToTile.call(player);
        };
        player.atTurnPoint = function() {
            return Util.atTurnPoint.call(player);
        };
        currentTile = Util.getTilePoint(player);
    };
    state.update = function() {
        // allow reversing direction any time
        if (cursors.up.isDown && player.direction === Phaser.DOWN) player.direction = Phaser.UP;
        if (cursors.down.isDown && player.direction === Phaser.UP) player.direction = Phaser.DOWN;
        if (cursors.left.isDown && player.direction === Phaser.RIGHT) player.direction = Phaser.LEFT;
        if (cursors.right.isDown && player.direction === Phaser.LEFT) player.direction = Phaser.RIGHT;
        // allow turning if at intersection...
        if (player.atTurnPoint()) {
            // ...and target tile is open
            if (cursors.up.isDown && map.getTileAbove(map.getLayerIndex('collision'), currentTile.x, currentTile.y).isInteresting(true)) return;
            if (cursors.down.isDown && map.getTileBelow(map.getLayerIndex('collision'), currentTile.x, currentTile.y).isInteresting(true)) return;
            if (cursors.left.isDown && map.getTileLeft(map.getLayerIndex('collision'), currentTile.x, currentTile.y).isInteresting(true)) return;
            if (cursors.right.isDown && map.getTileRight(map.getLayerIndex('collision'), currentTile.x, currentTile.y).isInteresting(true)) return;
            // this is just a horrible proof-of-concept
            var newDirection = null;
            if (cursors.up.isDown) newDirection = Phaser.UP;
            if (cursors.down.isDown) newDirection = Phaser.DOWN;
            if (cursors.left.isDown) newDirection = Phaser.LEFT;
            if (cursors.right.isDown) newDirection = Phaser.RIGHT;
            // if player turned, rectify position to currentTile
            var turned = false;
            if (player.direction === Phaser.UP && (newDirection === Phaser.LEFT || newDirection === Phaser.RIGHT)) turned = true;
            if (player.direction === Phaser.DOWN && (newDirection === Phaser.LEFT || newDirection === Phaser.RIGHT)) turned = true;
            if (player.direction === Phaser.LEFT && (newDirection === Phaser.UP || newDirection === Phaser.DOWN)) turned = true;
            if (player.direction === Phaser.RIGHT && (newDirection === Phaser.UP || newDirection === Phaser.DOWN)) turned = true;
            if (turned) player.snapToTile();
            if (newDirection)
                player.direction = newDirection;
        }
        player.updateVelocity();
        currentTile = Util.getTilePoint(player);
        state.physics.arcade.collide(player, collisionLayer);
        state.physics.arcade.collide(player, pickupsGroup, function(player, pickup) {
            pickup.kill();
        });
    };
    state.render = function() {
        state.game.debug.geom(Util.tileToWorld(currentTile), '#F00');
        state.game.debug.text("Player X: " + player.x, 20, 20);
        state.game.debug.text("Player Y: " + player.y, 20, 40);
        state.game.debug.text("Direction: " + player.direction, 20, 60);
        state.game.debug.text("Current Tile X: " + currentTile.x, 20, 80);
        state.game.debug.text("Current Tile Y: " + currentTile.y, 20, 100);
    };
    return state;
});