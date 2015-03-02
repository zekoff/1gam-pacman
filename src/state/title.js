define(['phaser','state/main'], function(Phaser, MainState) {
    var state = new Phaser.State();
    state.create = function() {
        state.game.state.add('main', MainState, true);
    };
    state.update = function() {};
    return state;
});