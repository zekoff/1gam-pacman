define(['object/entity', 'config'], function(Entity, Config) {
    var Enemy = function(state, tilePoint, frame) {
        Entity.call(this, state, tilePoint, frame);
        this.speed = Config.playerSpeed * 0.3;
    };
    Enemy.prototype = Object.create(Entity.prototype);
    Enemy.constructor = Enemy;
    return Enemy;
});