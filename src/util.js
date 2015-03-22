define(['phaser', 'const'], function(Phaser, Const) {
    var util = {};
    util.snapToTile = function(tile, entity) {
        if (typeof(entity) === 'undefined') entity = this;
        if (typeof(tile) === 'undefined') tile = util.getTilePoint(entity);
        var worldCoords = util.tileToWorld(tile);
        entity.x = worldCoords.x;
        entity.y = worldCoords.y;
        if (entity.body) entity.body.reset(entity.x, entity.y);
    };
    util.getTilePoint = function(entity) {
        if (typeof(entity) === 'undefined') entity = this;
        return new Phaser.Point(
            Phaser.Math.snapToFloor(Math.floor(entity.x), Const.TILE_SIZE) / Const.TILE_SIZE,
            Phaser.Math.snapToFloor(Math.floor(entity.y), Const.TILE_SIZE) / Const.TILE_SIZE
        );
    };
    util.tileToWorld = function(tilePoint) {
        return new Phaser.Point(
            tilePoint.x * Const.TILE_SIZE + Const.TILE_SIZE / 2,
            tilePoint.y * Const.TILE_SIZE + Const.TILE_SIZE / 2
        );
    };
    util.setEntityVelocity = function(entity) {
        if (typeof(entity) === 'undefined') entity = this;
        entity.body.velocity.set(0);
        switch (entity.direction) {
            case Phaser.UP:
                entity.body.velocity.y = -entity.speed;
                break;
            case Phaser.DOWN:
                entity.body.velocity.y = entity.speed;
                break;
            case Phaser.LEFT:
                entity.body.velocity.x = -entity.speed;
                break;
            case Phaser.RIGHT:
                entity.body.velocity.x = entity.speed;
                break;
        }
    };
    util.detectIntersection = function(tilePoint, map) {

    };
    util.isExitAvailable = function(tilePoint, map, direction) {
        var target;
        switch (direction) {
            case Phaser.UP:
                target = map.getTileAbove;
                break;
            case Phaser.DOWN:
                target = map.getTileBelow;
                break;
            case Phaser.LEFT:
                target = map.getTileLeft;
                break;
            case Phaser.RIGHT:
                target = map.getTileRight;
                break;
        }
        return !target.call(map, map.getLayerIndex(Const.COLLISION_LAYER),
            tilePoint.x, tilePoint.y).isInteresting(true);
    };
    util.atTurnPoint = function(tile, entity) {
        if (typeof(entity) === 'undefined') entity = this;
        if (typeof(tile) === 'undefined') tile = util.getTilePoint(entity);
        return Phaser.Math.fuzzyEqual(entity.x, util.tileToWorld(tile).x, Const.TURN_THRESHOLD_PX) &&
            Phaser.Math.fuzzyEqual(entity.y, util.tileToWorld(tile).y, Const.TURN_THRESHOLD_PX);
    };
    return util;
});