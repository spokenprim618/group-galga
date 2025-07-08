// ===========================
// PERMISSION REQUIRED TO MODIFY BELOW
// This file controls the flame/fire system logic.
// Consequences: Changing this may break fire system behavior or its integration with player logic.
// All changes must be reviewed before merging.
// ===========================

class FlameSystem {
  static checkFlameConeCollision(x, y, layers) {
    if (!gameManager.player) return;

    let flameSpacing = 15;
    let layerSpacing = 20;
    let rotation = gameManager.player.rotation;

    for (let i = 0; i < layers; i++) {
      let numFlames = 1 + i;
      for (let j = 0; j < numFlames; j++) {
        let offsetX = (j - (numFlames - 1) / 2) * flameSpacing;
        let offsetY = -i * layerSpacing;

        // ROTATED flame position (corrected)
        let flameX =
          x + offsetX * Math.cos(rotation) - offsetY * Math.sin(rotation);
        let flameY =
          y + offsetX * Math.sin(rotation) + offsetY * Math.cos(rotation);
        let size = 20 + gameState.currentFrame * 2;

        // Alien collision
        for (let k = gameManager.groupAlien.length - 1; k >= 0; k--) {
          if (gameManager.groupAlien[k]) {
            let alienX = gameManager.groupAlien[k].xPos + 25;
            let alienY = gameManager.groupAlien[k].yPos + 25;
            let dx = alienX - flameX;
            let dy = alienY - flameY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < size / 2 + 25) {
              gameManager.spawnPickup(
                gameManager.groupAlien[k].xPos,
                gameManager.groupAlien[k].yPos
              );
              gameManager.groupAlien.splice(k, 1);
              gameState.score += GAME_CONFIG.ENEMY_KILL_SCORE;
              break;
            }
          }
        }

        // Bullet collision
        for (let k = gameManager.groupEnemyBullet.length - 1; k >= 0; k--) {
          if (gameManager.groupEnemyBullet[k]) {
            let bulletX = gameManager.groupEnemyBullet[k].xPos + 25;
            let bulletY = gameManager.groupEnemyBullet[k].yPos + 25;
            let dx = bulletX - flameX;
            let dy = bulletY - flameY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < size / 2 + 25) {
              gameManager.groupEnemyBullet.splice(k, 1);
            }
          }
        }
      }
    }
  }

  static updateFlameThrower() {
    if (gameState.isFiring) {
      let currentTime = millis();
      if (
        currentTime - gameState.flameStartTime >=
        GAME_CONFIG.FLAME_DURATION
      ) {
        gameState.isFiring = false;
        console.log("Flame thrower stopped");
      } else {
        // Create graphics if they don't exist yet
        if (
          !assetManager.getFlameConeGraphic() &&
          assetManager.isFlameImageLoaded()
        ) {
          assetManager.createFlameConeGraphics();
        }

        // FPS throttling
        if (gameState.frameCounter % 3 === 0) {
          if (
            currentTime - gameState.lastFrameTime >
            1000 / gameState.frameRate
          ) {
            gameState.currentFrame = (gameState.currentFrame + 1) % 5;
            gameState.lastFrameTime = currentTime;
          }

          let flameImage =
            assetManager.getFlameConeGraphic() ||
            assetManager.getFlameConeFallbackGraphic();

          push();
          translate(
            gameManager.player.xPos + gameManager.player.size / 2,
            gameManager.player.yPos + gameManager.player.size / 2
          );
          rotate(gameManager.player.rotation);

          if (flameImage) {
            image(
              flameImage,
              -gameManager.player.size - 9,
              -gameManager.player.size * 2.5
            );
          } else {
            fill(255, 100, 0, 200);
            rect(
              -gameManager.player.size - 19,
              -gameManager.player.size * 2.5 - 10,
              20,
              20
            );
          }

          pop();
        }

        gameState.frameCounter++;

        // 🔥 Always check flame collision
        this.checkFlameConeCollision(
          gameManager.player.xPos + gameManager.player.size / 2,
          gameManager.player.yPos + gameManager.player.size / 2,
          4
        );
      }
    }
  }

  static activateFlameThrower() {
    if (gameState.isFireMode && !gameState.isFiring) {
      gameState.isFiring = true;
      gameState.flameStartTime = millis();
      console.log("Flame thrower activated!");
    } else if (!gameState.isFireMode) {
      console.log("Flame thrower only works in fire mode!");
    } else {
      console.log("Flame thrower already active");
    }
  }
}
