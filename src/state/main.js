define(['phaser', 'const', 'config', 'util', 'object/entity', 'input', 'nav', 'object/enemy'], function(Phaser, Const, Config, Util, Entity, Input, Nav, Enemy) {
    var state = new Phaser.State();
    var player;
    var map;
    var collisionLayer;
    var pickupsGroup;
    var enemiesGroup;
    var powerupsGroup;
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
        var playerGroup = state.add.group();
        map.createFromObjects('player', 2, 'badman', null, true, false,
            playerGroup, Entity);
        player = playerGroup.getFirstAlive();
        enemiesGroup = state.add.group();
        map.createFromObjects('enemies', 3, 'badman', null, true, false,
            enemiesGroup, Enemy);
        Enemy.prototype.player = player;
        Enemy.prototype.map = map;
        powerupsGroup = state.add.group();
        var powerupLocation = Util.tileToWorld({
            x: 9,
            y: 1
        });
        var powerup = new Phaser.Sprite(state.game, powerupLocation.x, powerupLocation.y, 'dot');
        state.physics.arcade.enable(powerup);
        powerup.tint = 0x00FF00;
        powerup.anchor.set(0.5);
        powerupsGroup.add(powerup);
        player.poweredUp = false;
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
        state.physics.arcade.collide(player, collisionLayer);
        state.physics.arcade.collide(enemiesGroup, collisionLayer);
        state.physics.arcade.collide(player, pickupsGroup, function(player, pickup) {
            pickup.kill();
        });
        state.physics.arcade.overlap(player, enemiesGroup, function(player, enemy) {
            player.kill();
            console.log("died");
        });
        state.physics.arcade.overlap(player, powerupsGroup, function(player, powerup) {
            powerup.kill();
            enemiesGroup.forEachAlive(function(enemy) {
                enemy.ai = 'flee';
                player.poweredUp = true;
            });
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
            var e = enemiesGroup.getFirstAlive();
            state.game.debug.text("Enemy 1 X: " + e.x, 20, 140);
            state.game.debug.text("Enemy 1 Y: " + e.y, 20, 160);
            state.game.debug.text("Direction: " + e.direction, 20, 180);
            state.game.debug.text("Velocity X: " + e.body.velocity.x, 20, 200);
            state.game.debug.text("Velocity Y: " + e.body.velocity.y, 20, 220);
            state.game.debug.text("AI: " + e.ai, 20, 240);
            state.game.debug.body(e);
            state.game.debug.geom(e.targetPointDebug, '#00F');
        }
    };
    return state;
});