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
            enemy.tint = 0x000000;
        });
        powerupTimer.stop();
        powerupTimer.add(7000, function() {
            player.poweredUp = false;
            enemiesGroup.forEachAlive(function(enemy) {
                enemy.ai = enemy.oldAi;
                enemy.reverseDirection();
                enemy.tint = 0xFF0000;
            });
        });
        powerupTimer.start();

    };
});