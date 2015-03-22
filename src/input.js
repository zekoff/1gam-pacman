define(['phaser'], function(Phaser) {
    var input = {};
    input.directions = [Phaser.LEFT, Phaser.RIGHT, Phaser.UP, Phaser.DOWN];
    input.opposites = [];
    input.opposites[1] = Phaser.RIGHT;
    input.opposites[2] = Phaser.LEFT;
    input.opposites[3] = Phaser.DOWN;
    input.opposites[4] = Phaser.UP;
    input.cursors = [];
    input.attachCursors = function(state) {
        var cursorsKeys = state.input.keyboard.createCursorKeys();
        input.cursors[1] = cursorsKeys.left;
        input.cursors[2] = cursorsKeys.right;
        input.cursors[3] = cursorsKeys.up;
        input.cursors[4] = cursorsKeys.down;
    };
    return input;
});