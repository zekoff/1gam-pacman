define(['phaser'], function(Phaser) {
    var powerupTimer = null;
    return function(player, powerup, enemiesGroup, state) {
        if (powerupTimer === null) powerupTimer = state.time.create();
        powerup.kill();
        enemiesGroup.forEachAlive(function(enemy) {
            enemy.reverseDirection();
            enemy.oldAi = enemy.ai;
            enemy.ai = 'flee';
            player.poweredUp = true;
        });
        powerupTimer.stop();
        powerupTimer.add(4000, function() {
            player.poweredUp = false;
            enemiesGroup.forEachAlive(function(enemy) {
                enemy.ai = enemy.oldAi;
                enemy.reverseDirection();
            });
        });
        powerupTimer.start();

    };
});