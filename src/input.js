define(['phaser', 'nav'], function(Phaser, Nav) {
    var input = {};
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