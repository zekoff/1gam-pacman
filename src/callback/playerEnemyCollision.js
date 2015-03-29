define(function() {
    return function(player, enemy) {
        if (!player.poweredUp) {
            player.kill();
            console.log("died");
            return;
        }
        enemy.kill();
        // start timer to add defeated enemy back into map (maybe)
    };
});