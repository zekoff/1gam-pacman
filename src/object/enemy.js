define(['object/entity', 'config', 'util', 'phaser', 'nav', 'const'], function(Entity, Config, Util, Phaser, Nav, Const) {
    var rnd = new Phaser.RandomDataGenerator();
    var Enemy = function(game, x, y, key, frame) {
        Entity.call(this, game, x, y, key, frame);
        this.speed = Config.playerSpeed * 0.5;
        this.tint = 0x000000;
    };
    Enemy.prototype = Object.create(Entity.prototype);
    Enemy.constructor = Enemy;
    Enemy.prototype.moveToTarget = function(map, targetPoint) {
        if (!this.isAtTurnPoint()) return;
        var exits = Util.detectExits(this.getCurrentTilePoint(), map);
        var minimumDistance = Infinity;
        var bestChoice = null;
        exits.forEach(function(direction) {
            if (direction === Nav.opposites[this.direction])
                return; // don't allow about-faces
            var testPoint = this.getCurrentTilePoint();
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
            testPoint = Util.tileToWorld(testPoint);
            var distance = Phaser.Math.distance(testPoint.x, testPoint.y,
                targetPoint.x, targetPoint.y);
            if (distance < minimumDistance) {
                minimumDistance = distance;
                bestChoice = direction;
            }
        }, this);
        if (this.direction !== bestChoice) {
            this.direction = bestChoice;
            this.snapToTile();
        }
    };
    var targetUpdateCounter = 0;
    Enemy.prototype.update = function() {
        var targetPoint = null;
        switch (this.ai) {
            case 'ambush':
                targetPoint = this.player.getCurrentTilePoint();
                switch (this.player.direction) {
                    case Phaser.LEFT:
                        targetPoint.x -= 4;
                        break;
                    case Phaser.RIGHT:
                        targetPoint.x += 4;
                        break;
                    case Phaser.UP:
                        targetPoint.y -= 4;
                        break;
                    case Phaser.DOWN:
                        targetPoint.y += 4;
                        break;
                }
                targetPoint = Util.tileToWorld(targetPoint);
                break;
            case 'wander':
                if (--targetUpdateCounter < 0) {
                    targetUpdateCounter = 300;
                    this.lastWanderTarget = {
                        x: rnd.between(0, Const.MAP_WIDTH),
                        y: rnd.between(0, Const.MAP_HEIGHT)
                    };
                    this.lastWanderTarget = Util.tileToWorld(this.lastWanderTarget);
                }
                targetPoint = this.lastWanderTarget;
                break;
            case 'seek':
            default:
                targetPoint = this.player;
                break;
        }
        this.targetPointDebug = targetPoint;
        this.moveToTarget(this.map, targetPoint);
        this.updateVelocity();
    };
    Enemy.prototype.separate = function(map, enemiesGroup) {

    };
    return Enemy;
});