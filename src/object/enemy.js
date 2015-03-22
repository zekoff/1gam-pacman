define(['object/entity', 'config', 'util', 'phaser'], function(Entity, Config, Util, Phaser) {
    var Enemy = function(state, tilePoint, frame) {
        Entity.call(this, state, tilePoint, frame);
        this.speed = Config.playerSpeed * 0.3;
        this.tint = 0x000000;
    };
    Enemy.prototype = Object.create(Entity.prototype);
    Enemy.constructor = Enemy;
    Enemy.prototype.seekPlayer = function(map, player) {
        if (!this.isAtTurnPoint()) return;
        var exits = Util.detectExits(this.getCurrentTilePoint(), map);
        if (exits.length > 1) {
            var minimumDistance = Infinity;
            var bestChoice = null;
            exits.forEach(function(direction) {
                // if (direction === Nav.opposites[enemy.direction]) return;
                var testPoint = Util.tileToWorld(this.getCurrentTilePoint());
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
                var distance = Phaser.Math.distance(testPoint.x, testPoint.y, player.x, player.y);
                if (distance < minimumDistance) {
                    minimumDistance = distance;
                    bestChoice = direction;
                }
            }, this);
            if (this.direction !== bestChoice) {
                this.direction = bestChoice;
                this.snapToTile();
            }
        }
    };
    return Enemy;
});