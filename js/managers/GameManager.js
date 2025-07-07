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
    let round = gameState.currentRound;

    // Spawn 5 enemies per wave
    let numEnemies = 5;

    // Determine which enemy type we're in and ensure at least 2 drones of that type
    let currentEnemyType = "";
    if (round >= 15 && round < 30) {
      currentEnemyType = "ice"; // Ice rounds
    } else if (round >= 30 && round < 50) {
      currentEnemyType = "fire"; // Fire rounds
    } else if (round >= 50 && round < 60) {
      currentEnemyType = "toxic"; // Toxic rounds
    } else if (round >= 60 && round < 75) {
      currentEnemyType = "dark"; // Dark rounds
    }

    let droneCount = 0;
    let maxDrones = 3; // Allow up to 3 drones

    for (let i = 0; i < numEnemies; i++) {
      let x = random(50, width - 100);
      let y = random(50, 200);

      let enemyType;

      // Ensure at least 2 drones of the current enemy type spawn
      if (droneCount < 2 && currentEnemyType !== "") {
        // Force a drone type of the current enemy type
        let droneTypes = enemyTypes.filter((type) =>
          type.includes(currentEnemyType + "Drone")
        );
        if (droneTypes.length > 0) {
          enemyType = random(droneTypes);
          droneCount++;
        } else {
          // If no drone types available, use any available type
          enemyType = random(enemyTypes);
        }
      } else if (droneCount < maxDrones && random() < 0.4) {
        // 40% chance to spawn additional drones (up to maxDrones)
        let droneTypes = enemyTypes.filter((type) => type.includes("Drone"));
        if (droneTypes.length > 0) {
          enemyType = random(droneTypes);
          droneCount++;
        } else {
          enemyType = random(enemyTypes);
        }
      } else {
        // Random selection from available types
        enemyType = random(enemyTypes);
      }

      let enemy;

      switch (enemyType) {
        case "regular":
          enemy = new Alien(x, y, assetManager.getImage("enemy"));
          break;
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
        case "fireDrone":
          enemy = new FireDrone(x, y);
          break;
        case "fireSpeed":
          enemy = new FireSpeed(x, y);
          break;
        case "rocket":
          enemy = new RocketEnemy(x, y);
          break;
        case "toxicDrone":
          enemy = new ToxicDrone(x, y);
          break;
        case "toxicGas":
          enemy = new ToxicGas(x, y);
          break;
        case "darkDrone":
          enemy = new DarkDrone(x, y);
          break;
        case "darkBeam":
          enemy = new DarkBeamEnemy(x, y);
          break;
        case "darkMulti":
          enemy = new DarkMultiEnemy(x, y);
          break;
        case "darkShield":
          enemy = new DarkShieldEnemy(x, y);
          break;
        default:
          console.warn("Unknown enemy type:", enemyType, "using regular enemy");
          enemy = new Alien(x, y, assetManager.getImage("enemy"));
          break;
      }

      this.groupAlien.push(enemy);
    }

    // Debug logging
    console.log(
      `Wave ${round}: Spawned ${this.groupAlien.length} enemies, ${droneCount} drones`
    );
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
      // Waves 25-29: Ice beam enemies and ice drones
      return ["iceBeam", "iceDrone"];
    } else if (round >= 30 && round < 35) {
      // Waves 30-34: Fire drones
      return ["fireDrone"];
    } else if (round >= 35 && round < 40) {
      // Waves 35-39: Fire drones, fire speed, and rocket enemies
      return ["fireDrone", "fireSpeed", "rocket"];
    } else if (round >= 40 && round < 50) {
      // Waves 40-49: All enemy types including fire and rocket
      return [
        "iceDrone",
        "iceSlower",
        "iceSpeed",
        "iceBeam",
        "fireDrone",
        "fireSpeed",
        "rocket",
      ];
    } else if (round >= 50 && round < 55) {
      // Waves 50-54: Toxic drones
      return ["toxicDrone"];
    } else if (round >= 55 && round < 60) {
      // Waves 55-59: Toxic gas enemies and toxic drones
      return ["toxicGas", "toxicDrone"];
    } else if (round >= 60 && round < 65) {
      // Waves 60-64: Dark drones and dark shields
      return ["darkDrone", "darkShield"];
    } else if (round >= 65 && round < 70) {
      // Waves 65-69: Dark beam enemies, dark drones, and dark shields
      return ["darkBeam", "darkDrone", "darkShield"];
    } else if (round >= 70 && round < 75) {
      // Waves 70-74: Dark multi enemies, dark drones, and dark shields
      return ["darkMulti", "darkDrone", "darkShield"];
    } else if (round >= 75) {
      // Wave 75+: All enemy types including dark
      return [
        "iceDrone",
        "iceSlower",
        "iceSpeed",
        "iceBeam",
        "fireDrone",
        "fireSpeed",
        "rocket",
        "toxicDrone",
        "toxicGas",
        "darkDrone",
        "darkBeam",
        "darkMulti",
        "darkShield",
      ];
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
        if (
          this.groupAlien[i].type === "iceBeam" ||
          this.groupAlien[i].type === "darkBeam" ||
          this.groupAlien[i].type === "darkShield"
        ) {
          this.groupAlien[i].update();
        } else {
          this.groupAlien[i].move();
        }
        this.groupAlien[i].draw();

        // Handle enemy shooting (ice beam enemies don't shoot bullets)
        if (
          this.groupAlien[i].shouldShoot() &&
          this.player &&
          this.groupAlien[i].type !== "iceBeam" &&
          this.groupAlien[i].type !== "darkBeam"
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
          } else if (
            this.groupAlien[i].type === "fireDrone" ||
            this.groupAlien[i].type === "fireSpeed" ||
            this.groupAlien[i].type === "rocket" ||
            this.groupAlien[i].type === "toxicDrone" ||
            this.groupAlien[i].type === "toxicGas" ||
            this.groupAlien[i].type === "darkDrone" ||
            this.groupAlien[i].type === "darkMulti"
          ) {
            // Fire, rocket, toxic, and dark enemies create their own bullets
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
          // Check if enemy is invulnerable
          if (this.groupAlien[j].isInvulnerable) {
            // Remove the bullet but not the enemy
            this.groupBullet.splice(i, 1);
            break;
          }

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
          // Check if enemy is invulnerable
          if (this.groupAlien[j].isInvulnerable) {
            // Remove the bullet but not the enemy
            this.groupBullet.splice(i, 1);
            break;
          }

          // Handle dark shield enemy destruction
          if (this.groupAlien[j].type === "darkShield") {
            this.groupAlien[j].onDestroy();
          }

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
          } else if (this.groupEnemyBullet[i] instanceof FireBullet) {
            damage = GAME_CONFIG.FIRE_BULLET_DAMAGE; // 15 damage for fire bullets
          } else if (this.groupEnemyBullet[i] instanceof RocketBullet) {
            // Rocket bullets attach to player and do damage over time
            this.groupEnemyBullet[i].attachToPlayer(this.player);
            continue; // Don't remove the rocket, let it attach
          } else if (this.groupEnemyBullet[i] instanceof ToxicBullet) {
            damage = GAME_CONFIG.TOXIC_BULLET_DAMAGE;
          } else if (this.groupEnemyBullet[i] instanceof DarkBullet) {
            damage = GAME_CONFIG.DARK_BULLET_DAMAGE;
          } else if (this.groupEnemyBullet[i] instanceof DarkMultiBullet) {
            damage = GAME_CONFIG.DARK_BULLET_DAMAGE;
          } else if (this.groupEnemyBullet[i] instanceof ToxicGasBullet) {
            // If not exploded, trigger explosion
            if (this.groupEnemyBullet[i].shouldExplode()) {
              this.groupEnemyBullet[i].explode();
              continue; // Don't remove yet
            }
            // If exploded and player is in gas, apply damage
            if (
              this.groupEnemyBullet[i].hasExploded &&
              this.groupEnemyBullet[i].checkExplosionCollision(this.player)
            ) {
              damage = GAME_CONFIG.TOXIC_GAS_DAMAGE;
            } else {
              continue; // No damage if not in gas
            }
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

        // Apply damage over time for attached rockets
        if (this.groupEnemyBullet[i] instanceof RocketBullet) {
          this.groupEnemyBullet[i].applyDamageOverTime();
        }

        // Remove bullets that are off screen or should be removed
        if (
          this.groupEnemyBullet[i].isOffScreen() ||
          (this.groupEnemyBullet[i].shouldRemove &&
            this.groupEnemyBullet[i].shouldRemove())
        ) {
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
            // Check if enemy is invulnerable
            if (this.groupAlien[j].isInvulnerable) {
              continue; // Skip invulnerable enemies
            }

            // Handle dark shield enemy destruction
            if (this.groupAlien[j].type === "darkShield") {
              this.groupAlien[j].onDestroy();
            }

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
