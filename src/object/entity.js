define(['phaser', 'util', 'config'], function(Phaser, Util, Config) {
    var entity = function Entity(state, tilePoint, frame) {
        var worldLocation = Util.tileToWorld(tilePoint);
        Phaser.Sprite.call(this, state.game, worldLocation.x, worldLocation.y,
            frame);
        state.physics.arcade.enable(this);
        this.anchor.set(0.5);
        this.body.bounce = 0;
        this.direction = Phaser.DOWN;
        this.speed = Config.playerSpeed;
        Entity.prototype.updateVelocity = function() {
            Util.setEntityVelocity.call(this);
        };
        Entity.prototype.snapToTile = function() {
            Util.snapToTile.call(this);
        };
        Entity.prototype.atTurnPoint = function() {
            return Util.atTurnPoint.call(this);
        };
    };
    entity.prototype = Object.create(Phaser.Sprite.prototype);
    entity.prototype.constructor = entity;
    return entity;
});