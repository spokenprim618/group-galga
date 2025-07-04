class GameManager {
  constructor() {
    this.groupAlien = [];
    this.groupBullet = [];
    this.groupEnemyBullet = [];
    this.groupPickup = [];
    this.groupIceBullet = [];
    this.player = null;
  }

  spawnAliens() {
    this.groupAlien = []; // Clear existing aliens
    for (let i = 0; i < 5; i++) {
      // Random x position between 0 and width-50 (accounting for enemy size)
      let randomX = random(0, width - GAME_CONFIG.ENEMY_SIZE);
      let alien = new Alien(randomX, 20, assetManager.getImage("enemy"));
      this.groupAlien.push(alien);
    }
  }

  spawnPickup(x, y) {
    // 25% chance to spawn a pickup
    if (random() < GAME_CONFIG.PICKUP_SPAWN_CHANCE) {
      let pickupType;
      if (gameState.lifePickupHeld > 0) {
        pickupType = random(Pickup.getPickupTypesWithoutLife());
      } else {
        pickupType = random(Pickup.getPickupTypes());
      }

      let pickupImage = this.getPickupImage(pickupType);
      let pickup = new Pickup(x, y, pickupType, pickupImage);
      this.groupPickup.push(pickup);
    }
  }

  getPickupImage(type) {
    switch (type) {
      case "fire-up":
        return assetManager.getImage("fireUp");
      case "ice-up":
        return assetManager.getImage("iceUp");
      case "laz-up":
        return assetManager.getImage("lazUp");
      case "scrap":
        return assetManager.getImage("scrap");
      case "life":
        return assetManager.getImage("life");
      case "repair":
        return assetManager.getImage("repair");
      default:
        return assetManager.getImage("repair");
    }
  }

  updatePlayerMovement() {
    if (keyIsDown(65)) {
      // A key
      this.player.move("left");
    }
    if (keyIsDown(68)) {
      // D key
      this.player.move("right");
    }
    if (keyIsDown(83)) {
      // S key
      this.player.move("down");
    }
    if (keyIsDown(87)) {
      // W key
      this.player.move("up");
    }
  }

  updateAliens() {
    for (let i = 0; i < this.groupAlien.length; i++) {
      if (!this.groupAlien[i]) continue;

      this.groupAlien[i].move();
      this.groupAlien[i].draw();

      // Random shooting for each alien
      if (this.groupAlien[i].shouldShoot() && this.player) {
        let alienCenter = this.groupAlien[i].getCenter();
        let enemyBullet = new EnemyBullet(
          alienCenter.x,
          alienCenter.y + this.groupAlien[i].size,
          this.player.xPos + this.player.size / 2,
          this.player.yPos + this.player.size / 2,
          assetManager.getImage("enemyBullet")
        );
        this.groupEnemyBullet.push(enemyBullet);
      }

      if (this.groupAlien[i].isOffScreen()) {
        this.groupAlien[i].yPos = 0;
        gameState.lives -= 1;
        this.checkGameOver();
      }
    }
  }

  updateBullets() {
    for (let i = this.groupBullet.length - 1; i >= 0; i--) {
      if (!this.groupBullet[i]) {
        this.groupBullet.splice(i, 1);
        continue;
      }

      this.groupBullet[i].move();
      this.groupBullet[i].draw();

      // Check for collisions with aliens
      for (let j = this.groupAlien.length - 1; j >= 0; j--) {
        if (!this.groupAlien[j]) continue;

        if (
          this.groupBullet[i] instanceof SawBladeBullet &&
          this.groupBullet[i].checkCollision(this.groupAlien[j])
        ) {
          // Spawn pickup at enemy location before removing it
          this.spawnPickup(this.groupAlien[j].xPos, this.groupAlien[j].yPos);
          // Remove the alien only (not the saw blade)
          this.groupAlien.splice(j, 1);
          gameState.score += GAME_CONFIG.ENEMY_KILL_SCORE;
          // Saw blade bounces, do not remove
        } else if (
          !(this.groupBullet[i] instanceof SawBladeBullet) &&
          this.groupBullet[i] &&
          this.groupBullet[i].checkCollision(this.groupAlien[j])
        ) {
          // Spawn pickup at enemy location before removing it
          this.spawnPickup(this.groupAlien[j].xPos, this.groupAlien[j].yPos);
          // Remove both the bullet and the alien
          this.groupBullet.splice(i, 1);
          this.groupAlien.splice(j, 1);
          gameState.score += GAME_CONFIG.ENEMY_KILL_SCORE;
          break;
        }
      }

      // Remove bullets that are off screen or (for saws) too many bounces
      if (
        this.groupBullet[i] &&
        this.groupBullet[i].shouldRemove &&
        this.groupBullet[i].shouldRemove()
      ) {
        this.groupBullet.splice(i, 1);
      }
    }
  }

  updatePickups() {
    for (let i = this.groupPickup.length - 1; i >= 0; i--) {
      if (!this.groupPickup[i]) continue;

      this.groupPickup[i].move();
      this.groupPickup[i].draw();

      // Check collision with player
      if (this.player && this.groupPickup[i].checkCollision(this.player)) {
        // Apply pickup effect
        gameState.activatePowerup(this.groupPickup[i].type);
        this.updatePlayerImage();
        this.groupPickup.splice(i, 1);
        continue;
      }

      // Remove pickups that are off screen
      if (this.groupPickup[i].isOffScreen()) {
        this.groupPickup.splice(i, 1);
      }
    }
  }

  updateEnemyBullets() {
    for (let i = this.groupEnemyBullet.length - 1; i >= 0; i--) {
      if (!this.groupEnemyBullet[i]) {
        this.groupEnemyBullet.splice(i, 1);
        continue;
      }

      try {
        this.groupEnemyBullet[i].move();
        image(
          this.groupEnemyBullet[i].image,
          this.groupEnemyBullet[i].xPos,
          this.groupEnemyBullet[i].yPos,
          50,
          50
        );

        // Check collision with player (ignore SawBladeBullet)
        if (
          this.player &&
          !(this.groupEnemyBullet[i] instanceof SawBladeBullet) &&
          this.groupEnemyBullet[i].checkCollision(this.player)
        ) {
          gameState.lives--;
          this.groupEnemyBullet.splice(i, 1);
          this.checkGameOver();
          continue;
        }

        // Remove bullets that are off screen
        if (this.groupEnemyBullet[i].isOffScreen()) {
          this.groupEnemyBullet.splice(i, 1);
        }
      } catch (error) {
        console.log("Error updating enemy bullet:", error);
        this.groupEnemyBullet.splice(i, 1);
      }
    }
  }

  updateIceBullets() {
    for (let i = this.groupIceBullet.length - 1; i >= 0; i--) {
      if (!this.groupIceBullet[i]) {
        this.groupIceBullet.splice(i, 1);
        continue;
      }

      this.groupIceBullet[i].move();
      this.groupIceBullet[i].draw();

      // Check if ice bullet should explode
      if (this.groupIceBullet[i].shouldExplode()) {
        this.groupIceBullet[i].explode();
      }

      // Check for explosion collisions with aliens (only after explosion)
      if (this.groupIceBullet[i].hasExploded) {
        for (let j = this.groupAlien.length - 1; j >= 0; j--) {
          if (!this.groupAlien[j]) continue;

          if (
            this.groupIceBullet[i].checkExplosionCollision(this.groupAlien[j])
          ) {
            // Spawn pickup at enemy location before removing it
            this.spawnPickup(this.groupAlien[j].xPos, this.groupAlien[j].yPos);

            // Remove the alien
            this.groupAlien.splice(j, 1);
            gameState.score += GAME_CONFIG.ENEMY_KILL_SCORE;
          }
        }
      }

      // Remove ice bullets that are off screen or have finished exploding
      if (
        this.groupIceBullet[i] &&
        (this.groupIceBullet[i].isOffScreen() ||
          this.groupIceBullet[i].shouldRemove())
      ) {
        this.groupIceBullet.splice(i, 1);
      }
    }
  }

  updatePlayerImage() {
    if (gameState.isFireMode) {
      this.player.image = assetManager.getImage("fire2");
    } else if (gameState.isIceMode) {
      this.player.image = assetManager.getImage("ice2");
    } else if (gameState.isLaserMode) {
      this.player.image = assetManager.getImage("player");
    } else if (gameState.isScrapMode) {
      this.player.image = assetManager.getImage("scrapShip");
    } else if (gameState.isAngelMode) {
      this.player.image = assetManager.getImage("angel");
    } else {
      this.player.image = assetManager.getImage("player1");
    }
  }

  checkGameOver() {
    if (gameState.lives <= 0) {
      // Check if player has a life pickup to auto-restore
      if (gameState.lifePickupHeld > 0) {
        gameState.activateAngelMode();
        this.player.image = assetManager.getImage("angel");
        // Prevent immediate game over by skipping the rest of this block
        return;
      } else {
        this.clearAllBullets();
        gameState.deactivateAllPowerups();
        gameState.gameOver();
      }
    }
  }

  clearAllBullets() {
    this.groupBullet = [];
    this.groupEnemyBullet = [];
    this.groupIceBullet = [];
  }

  reset() {
    this.groupAlien = [];
    this.groupBullet = [];
    this.groupEnemyBullet = [];
    this.groupPickup = [];
    this.groupIceBullet = [];
    this.player = new Player(
      GAME_CONFIG.PLAYER_START_X,
      GAME_CONFIG.PLAYER_START_Y,
      assetManager.getImage("player1")
    );
  }
}
