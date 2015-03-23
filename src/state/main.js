define(['phaser', 'const', 'config', 'util', 'object/entity', 'input', 'nav', 'object/enemy'], function(Phaser, Const, Config, Util, Entity, Input, Nav, Enemy) {
    var state = new Phaser.State();
    var player;
    var map;
    var collisionLayer;
    var pickupsGroup;
    var enemiesGroup;
    state.create = function() {
        map = state.add.tilemap('test');
        map.addTilesetImage('test_tiles', 'tiles');
        collisionLayer = map.createLayer('collision');
        map.setCollision(1, true, collisionLayer);
        var pickupsLayer = map.createLayer('pickups');
        pickupsGroup = state.add.group();
        map.createFromTiles(4, 0, 'dot', pickupsLayer, pickupsGroup);
        state.physics.arcade.enable(pickupsGroup);
        Input.attachCursors(state);
        // player = new Entity(state.game, 1, 1, 'badman');
        // state.add.existing(player);
        var playerGroup = state.add.group();
        map.createFromObjects('player', 2, 'badman', null, true, false,
            playerGroup, Entity);
        player = playerGroup.getFirstAlive();
        enemiesGroup = state.add.group();
        map.createFromObjects('enemies', 3, 'badman', null, true, false,
            enemiesGroup, Enemy);
    };
    state.update = function() {
        // allow reversing direction any time
        Nav.directions.forEach(function(direction) {
            if (Input.cursors[direction].isDown && player.direction === Nav.opposites[direction])
                player.direction = direction;
        });
        if (player.isAtTurnPoint()) {
            // ...and target tile is open
            var currentTile = player.getCurrentTilePoint();
            var newDirection = null;
            Nav.directions.forEach(function(direction) {
                if (Input.cursors[direction].isDown && Util.isExitAvailable(currentTile, map, direction))
                    newDirection = direction;
            });
            if (newDirection && newDirection !== player.direction) {
                player.direction = newDirection;
                player.snapToTile();
            }
        }
        enemiesGroup.forEachAlive(function(enemy) {
            enemy.moveToTarget(map, player);
        });
        state.physics.arcade.collide(player, collisionLayer);
        state.physics.arcade.collide(enemiesGroup, collisionLayer);
        state.physics.arcade.collide(player, pickupsGroup, function(player, pickup) {
            pickup.kill();
        });
        state.physics.arcade.overlap(player, enemiesGroup, function(player, enemy) {
            player.kill();
            console.log("died");
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
        state.game.debug.body(player);

        if (enemiesGroup.getFirstAlive()) {
            state.game.debug.text("Enemy 1 X: " + enemiesGroup.getFirstAlive().x, 20, 140);
            state.game.debug.text("Enemy 1 Y: " + enemiesGroup.getFirstAlive().y, 20, 160);
            state.game.debug.text("Direction: " + enemiesGroup.getFirstAlive().direction, 20, 180);
            state.game.debug.body(enemiesGroup.getFirstAlive());
        }
    };
    return state;
});