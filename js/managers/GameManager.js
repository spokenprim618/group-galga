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
    // Clear existing aliens
    this.groupAlien = [];

    // Determine enemy types based on current round
    let enemyTypes = this.getEnemyTypesForRound();

    // Spawn enemies based on round (reduced for testing)
    let numEnemies = 3; // Fixed number for testing instead of scaling
    for (let i = 0; i < numEnemies; i++) {
      let x = random(50, width - 100);
      let y = random(50, 200);

      // Randomly select enemy type from available types
      let enemyType = random(enemyTypes);
      let enemy;

      switch (enemyType) {
        case "iceDrone":
          enemy = new IceDrone(x, y);
          break;
        case "iceSlower":
          enemy = new IceSlower(x, y);
          break;
        case "iceSpeed":
          enemy = new IceSpeed(x, y);
          break;
        case "iceBeam":
          enemy = new IceBeamEnemy(x, y);
          break;
        default:
          enemy = new Alien(x, y, assetManager.getImage("enemy"));
          break;
      }

      this.groupAlien.push(enemy);
    }
  }

  getEnemyTypesForRound() {
    let round = gameState.currentRound;

    if (round >= 15 && round < 20) {
      // Waves 15-19: Only ice drones
      return ["iceDrone"];
    } else if (round >= 20 && round < 25) {
      // Waves 20-24: Ice slower and ice speed
      return ["iceSlower", "iceSpeed"];
    } else if (round >= 25 && round < 30) {
      // Waves 25-29: Ice beam enemies
      return ["iceBeam"];
    } else if (round >= 30) {
      // Wave 30+: All ice types including beam
      return ["iceDrone", "iceSlower", "iceSpeed", "iceBeam"];
    } else {
      // Waves 1-14: Regular enemies
      return ["regular"];
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
      case "shield":
        return assetManager.getImage("shield");
      case "speed":
        return assetManager.getImage("speed");
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
    for (let i = this.groupAlien.length - 1; i >= 0; i--) {
      if (!this.groupAlien[i]) {
        this.groupAlien.splice(i, 1);
        continue;
      }

      try {
        // Use update method for ice beam enemies, move for others
        if (this.groupAlien[i].type === "iceBeam") {
          this.groupAlien[i].update();
        } else {
          this.groupAlien[i].move();
        }
        this.groupAlien[i].draw();

        // Handle enemy shooting (ice beam enemies don't shoot bullets)
        if (
          this.groupAlien[i].shouldShoot() &&
          this.player &&
          this.groupAlien[i].type !== "iceBeam"
        ) {
          let bullet;

          // Create appropriate bullet based on enemy type
          if (
            this.groupAlien[i].type === "iceDrone" ||
            this.groupAlien[i].type === "iceSpeed" ||
            this.groupAlien[i].type === "iceSlower"
          ) {
            // Ice enemies create their own bullets
            bullet = this.groupAlien[i].createBullet();
          } else {
            // Regular enemies create standard enemy bullets
            let center = this.groupAlien[i].getCenter();
            bullet = new EnemyBullet(
              center.x,
              center.y,
              this.player.xPos + this.player.size / 2,
              this.player.yPos + this.player.size / 2,
              assetManager.getImage("enemyBullet")
            );
          }

          this.groupEnemyBullet.push(bullet);
        }

        if (this.groupAlien[i].isOffScreen()) {
          this.groupAlien[i].yPos = 0;
          // Use shield first if available, otherwise take health damage
          if (gameState.shields > 0) {
            gameState.shields--; // Remove one shield
            console.log(
              "Shield absorbed alien escape penalty! Shields remaining:",
              gameState.shields
            );
          } else {
            gameState.health -= 10; // Deal 10 damage if no shields
            console.log("Alien escaped! Health remaining:", gameState.health);
          }
          this.checkGameOver();
        }
      } catch (error) {
        console.log("Error updating alien:", error);
        this.groupAlien.splice(i, 1);
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
        this.groupEnemyBullet[i].draw();

        // Check collision with player (ignore SawBladeBullet)
        if (
          this.player &&
          !(this.groupEnemyBullet[i] instanceof SawBladeBullet) &&
          this.groupEnemyBullet[i].checkCollision(this.player)
        ) {
          // Determine damage based on bullet type
          let damage = 10; // Default damage for regular enemy bullets

          if (this.groupEnemyBullet[i] instanceof EnemyIceBullet) {
            damage = GAME_CONFIG.ICE_BULLET_DAMAGE; // 20 damage for ice bullets
          } else if (this.groupEnemyBullet[i] instanceof IceWaveBullet) {
            damage = GAME_CONFIG.ICE_WAVE_DAMAGE; // 20 damage for ice wave
          }

          // Use shield first if available, otherwise take health damage
          if (gameState.shields > 0) {
            gameState.shields--; // Remove one shield
            console.log(
              "Shield absorbed damage! Shields remaining:",
              gameState.shields
            );
          } else {
            gameState.health -= damage; // Deal damage based on bullet type
            console.log("Player hit! Health remaining:", gameState.health);
          }
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
    if (gameState.health <= 0) {
      // Check if player has a life pickup to auto-restore
      if (gameState.lifePickupHeld > 0) {
        gameState.activateAngelMode();
        this.updatePlayerImage(); // Properly update player image
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
