define(['phaser'], function(Phaser) {
    var nav = {};
    nav.directions = [Phaser.LEFT, Phaser.RIGHT, Phaser.UP, Phaser.DOWN];
    nav.opposites = [null, Phaser.RIGHT, Phaser.LEFT, Phaser.DOWN, Phaser.UP];
    return nav;
});