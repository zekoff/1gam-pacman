define(['phaser', 'util', 'config'], function(Phaser, Util, Config) {
    var Entity = function(game, x, y, key, frame) {
        var tilePoint = Util.getTilePoint(new Phaser.Point(x, y));
        // tilePoint.y--; // fix bug with tiled objects anchor from bottom-left
        var worldLocation = Util.tileToWorld(tilePoint);
        Phaser.Sprite.call(this, game, worldLocation.x, worldLocation.y, key);
        game.physics.arcade.enable(this);
        this.anchor.set(0.5);
        this.body.bounce = 0;
        this.body.setSize(30, 30);
        this.direction = Phaser.DOWN;
        this.speed = Config.playerSpeed;
        this.startPoint = tilePoint;
    };
    Entity.prototype = Object.create(Phaser.Sprite.prototype);
    Entity.prototype.constructor = Entity;
    Entity.prototype.updateVelocity = function() {
        Util.setEntityVelocity.call(this);
    };
    Entity.prototype.snapToTile = function() {
        Util.snapToTile.call(this);
    };
    Entity.prototype.isAtTurnPoint = function() {
        return Util.atTurnPoint.call(this);
    };
    Entity.prototype.getCurrentTilePoint = function() {
        return Util.getTilePoint.call(this);
    };
    Entity.prototype.update = function() {
        this.updateVelocity();
    };
    return Entity;
});