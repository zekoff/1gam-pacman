define(['phaser', 'const', 'config', 'util', 'object/entity', 'input'], function(Phaser, Const, Config, Util, Entity, Input) {
    var state = new Phaser.State();
    var player;
    var map;
    var collisionLayer;
    var pickupsGroup;
    state.create = function() {
        map = state.add.tilemap('test');
        map.addTilesetImage('test-tiles', 'tiles');
        collisionLayer = map.createLayer('collision');
        map.setCollision(1, true, collisionLayer);
        var pickupsLayer = map.createLayer('pickups');
        pickupsGroup = state.add.group();
        map.createFromTiles(4, 0, 'dot', pickupsLayer, pickupsGroup);
        state.physics.arcade.enable(pickupsGroup);
        Input.attachCursors(state);
        player = new Entity(state, new Phaser.Point(1, 1), 'badman');
        state.add.existing(player);
    };
    state.update = function() {
        // allow reversing direction any time
        Input.directions.forEach(function(direction) {
            if (Input.cursors[direction].isDown && player.direction === Input.opposites[direction])
                player.direction = direction;
        });
        if (player.isAtTurnPoint()) {
            // ...and target tile is open
            var currentTile = player.getCurrentTilePoint();
            var newDirection = null;
            Input.directions.forEach(function(direction) {
                if (Input.cursors[direction].isDown && Util.isExitAvailable(currentTile, map, direction))
                    newDirection = direction;
            });
            if (newDirection && newDirection !== player.direction) {
                player.direction = newDirection;
                player.snapToTile();
            }
        }
        player.updateVelocity();
        state.physics.arcade.collide(player, collisionLayer);
        state.physics.arcade.collide(player, pickupsGroup, function(player, pickup) {
            pickup.kill();
        });
    };
    state.render = function() {
        var currentTile = player.getCurrentTilePoint();
        state.game.debug.geom(Util.tileToWorld(currentTile), '#F00');
        state.game.debug.text("Player X: " + player.x, 20, 20);
        state.game.debug.text("Player Y: " + player.y, 20, 40);
        state.game.debug.text("Direction: " + player.direction, 20, 60);
        state.game.debug.text("Current Tile X: " + currentTile.x, 20, 80);
        state.game.debug.text("Current Tile Y: " + currentTile.y, 20, 100);
    };
    return state;
});