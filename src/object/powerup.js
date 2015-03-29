define(['phaser', 'util', 'config'], function(Phaser, Util, Config) {
    var Powerup = function(game, x, y, key, frame) {
        var tilePoint = Util.getTilePoint(new Phaser.Point(x, y));
        // tilePoint.y--; // fix bug with tiled objects anchor from bottom-left
        var worldLocation = Util.tileToWorld(tilePoint);
        Phaser.Sprite.call(this, game, worldLocation.x, worldLocation.y, key);
        game.physics.arcade.enable(this);
        this.anchor.set(0.5);
        this.body.bounce = 0;
        this.body.setSize(30, 30);
    };
    Powerup.prototype = Object.create(Phaser.Sprite.prototype);
    Powerup.prototype.constructor = Powerup;
    return Powerup;
});