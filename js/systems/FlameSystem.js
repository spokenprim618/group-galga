class FlameSystem {
  static checkFlameConeCollision(x, y, rotation, layers) {
    // Safety check: ensure player exists
    if (!gameManager.player) return;

    let flameSpacing = 15; // horizontal spacing between flames
    let layerSpacing = 20; // vertical spacing between rows

    for (let i = 0; i < layers; i++) {
      let numFlames = 1 + i; // 1 → 2 → 3 → 4 ...
      for (let j = 0; j < numFlames; j++) {
        // Center flames
        let offsetX = (j - (numFlames - 1) / 2) * flameSpacing;
        let offsetY = -i * layerSpacing;

        // Calculate flame position in world coordinates using regular rotation
        let flameX = x + offsetX * cos(rotation) - offsetY * sin(rotation);
        let flameY = y + offsetX * sin(rotation) + offsetY * cos(rotation);
        let size = 20 + gameState.currentFrame * 2; // Size varies from 20 to 28

        // Check collision with aliens
        for (let k = gameManager.groupAlien.length - 1; k >= 0; k--) {
          if (gameManager.groupAlien[k]) {
            let alienX = gameManager.groupAlien[k].xPos + 25; // Center of alien
            let alienY = gameManager.groupAlien[k].yPos + 25;
            let dx = alienX - flameX;
            let dy = alienY - flameY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < size / 2 + 25) {
              // 25 is alien radius
              // Spawn pickup at enemy location before removing it
              gameManager.spawnPickup(
                gameManager.groupAlien[k].xPos,
                gameManager.groupAlien[k].yPos
              );

              // Remove the alien
              gameManager.groupAlien.splice(k, 1);
              gameState.score += GAME_CONFIG.ENEMY_KILL_SCORE; // Add points for hitting an alien
              break; // Exit alien loop since this flame hit something
            }
          }
        }

        // Check collision with enemy bullets
        for (let k = gameManager.groupEnemyBullet.length - 1; k >= 0; k--) {
          if (gameManager.groupEnemyBullet[k]) {
            let bulletX = gameManager.groupEnemyBullet[k].xPos + 25; // Center of bullet
            let bulletY = gameManager.groupEnemyBullet[k].yPos + 25;
            let dx = bulletX - flameX;
            let dy = bulletY - flameY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < size / 2 + 25) {
              // Remove the enemy bullet
              gameManager.groupEnemyBullet.splice(k, 1);
              // Don't break here - let the flame destroy multiple bullets
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

        // FPS throttling: only draw every 3rd frame for better performance
        if (gameState.frameCounter % 3 === 0) {
          // Only advance frame at the specified frame rate
          if (
            currentTime - gameState.lastFrameTime >
            1000 / gameState.frameRate
          ) {
            gameState.currentFrame = (gameState.currentFrame + 1) % 5; // Use 5 frames for animation
            gameState.lastFrameTime = currentTime;
          }

          // Draw flame cone attached to player sprite
          let flameX = gameManager.player.xPos + gameManager.player.size / 2;
          let flameY = gameManager.player.yPos + gameManager.player.size / 2- ;

          let flameImage =
            assetManager.getFlameConeGraphic() ||
            assetManager.getFlameConeFallbackGraphic();

          if (flameImage) {
            // Draw flame cone with rotation
            push();
            translate(flameX, flameY);
            rotate(gameManager.player.rotation);
            image(flameImage, -flameImage.width / 2, -flameImage.height / 2);
            pop();
          } else {
            // Fallback: draw simple rectangle
            push();
            translate(flameX, flameY);
            rotate(gameManager.player.rotation);
            fill(255, 100, 0, 200);
            rect(-10, -10, 20, 20);
            pop();
          }
        }

        gameState.frameCounter++;

        // Check flame cone collision with aliens (always check for gameplay)
        this.checkFlameConeCollision(
          gameManager.player.xPos + gameManager.player.size / 2,
          gameManager.player.yPos + gameManager.player.size / 2,
          gameManager.player.rotation,
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
