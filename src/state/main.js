define(['phaser', 'const', 'config', 'util', 'object/entity', 'input', 'nav', 'object/enemy'], function(Phaser, Const, Config, Util, Entity, Input, Nav, Enemy) {
    var state = new Phaser.State();
    var player;
    var map;
    var collisionLayer;
    var pickupsGroup;
    var enemiesGroup;
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
        enemiesGroup = state.add.group();
        var enemy = new Enemy(state, new Phaser.Point(27, 24), 'badman');
        enemy.tint = 0x000000;
        enemiesGroup.add(enemy);
        enemy.update = function() {
            if (!enemy.isAtTurnPoint()) return;
            var exits = Util.detectExits(enemy.getCurrentTilePoint(), map);
            if (exits.length > 1) {
                var minimumDistance = Infinity;
                var bestChoice = null;
                exits.forEach(function(direction) {
                    // if (direction === Nav.opposites[enemy.direction]) return;
                    var testPoint = Util.tileToWorld(enemy.getCurrentTilePoint());
                    switch (direction) {
                        case Phaser.LEFT:
                            testPoint.x--;
                            break;
                        case Phaser.RIGHT:
                            testPoint.x++;
                            break;
                        case Phaser.UP:
                            testPoint.y--;
                            break;
                        case Phaser.DOWN:
                            testPoint.y++;
                            break;
                    }
                    var distance = state.math.distance(testPoint.x, testPoint.y, player.x, player.y);
                    if (distance < minimumDistance) {
                        minimumDistance = distance;
                        bestChoice = direction;
                    }
                });
                if (enemy.direction !== bestChoice) {
                    enemy.direction = bestChoice;
                    enemy.snapToTile();
                }
            }
            enemy.updateVelocity();
        };
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
        player.updateVelocity();
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

        state.game.debug.text("Enemy 1 X: " + enemiesGroup.getFirstAlive().x, 20, 140);
        state.game.debug.text("Enemy 1 Y: " + enemiesGroup.getFirstAlive().y, 20, 160);
        state.game.debug.text("Direction: " + enemiesGroup.getFirstAlive().direction, 20, 180);
        state.game.debug.body(enemiesGroup.getFirstAlive());
    };
    return state;
});