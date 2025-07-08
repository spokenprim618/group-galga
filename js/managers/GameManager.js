class GameManager {
  constructor() {
    this.groupAlien = [];
    this.groupBullet = [];
    this.groupEnemyBullet = [];
    this.groupPickup = [];
    this.groupIceBullet = [];
    this.groupBlackBullet = [];
    this.player = null;
    // Black hole feature state
    this.holePickupCollected = false;
    this.blackBulletUses = 0;
    this.maxBlackBulletUses = 2;
    this.activeBlackHole = null; // { x, y, startTime }
    this.isBlackHoleMode = false;
  }

  getRandomEnemyTypeForRound(
    round,
    enemyTypes,
    droneCount,
    maxDrones,
    guaranteedDarkMulti,
    i
  ) {
    if (guaranteedDarkMulti && i === 0) {
      return "darkMulti";
    }
    let currentEnemyType = "";
    if (round >= 15 && round < 30) {
      currentEnemyType = "ice";
    } else if (round >= 30 && round < 50) {
      currentEnemyType = "fire";
    } else if (round >= 50 && round < 60) {
      currentEnemyType = "toxic";
    } else if (round >= 60 && round < 75) {
      currentEnemyType = "dark";
    }
    if (droneCount < 2 && currentEnemyType !== "") {
      let droneTypes = enemyTypes.filter((type) =>
        type.includes(currentEnemyType + "Drone")
      );
      if (droneTypes.length > 0) {
        return random(droneTypes);
      } else {
        return random(enemyTypes);
      }
    } else if (droneCount < maxDrones && random() < 0.4) {
      let droneTypes = enemyTypes.filter((type) => type.includes("Drone"));
      if (droneTypes.length > 0) {
        return random(droneTypes);
      } else {
        return random(enemyTypes);
      }
    } else {
      return random(enemyTypes);
    }
  }

  spawnEnemyOfType(type, x, y) {
    switch (type) {
      case "regular":
        return new Alien(x, y, assetManager.getImageForType("enemy"));
      case "iceDrone":
        return new IceDrone(x, y);
      case "iceSlower":
        return new IceSlower(x, y);
      case "iceSpeed":
        return new IceSpeed(x, y);
      case "iceBeam":
        return new IceBeamEnemy(x, y);
      case "fireDrone":
        return new FireDrone(x, y);
      case "fireSpeed":
        return new FireSpeed(x, y);
      case "rocket":
        return new RocketEnemy(x, y);
      case "toxicDrone":
        return new ToxicDrone(x, y);
      case "toxicGas":
        return new ToxicGas(x, y);
      case "darkDrone":
        return new DarkDrone(x, y);
      case "darkBeam":
        return new DarkBeamEnemy(x, y);
      case "darkMulti":
        return new DarkMultiEnemy(x, y);
      case "darkShield":
        return new DarkShieldEnemy(x, y);
      default:
        console.warn("Unknown enemy type:", type, "using regular enemy");
        return new Alien(x, y, assetManager.getImageForType("enemy"));
    }
  }

  spawnAliens() {
    // Clear existing aliens
    this.groupAlien = [];

    // Determine enemy types based on current round
    let enemyTypes = this.getEnemyTypesForRound();
    let round = gameState.currentRound;

    // Spawn 5 enemies per wave
    let numEnemies = 5;

    // Guarantee at least one darkMulti in rounds 75-80
    let guaranteedDarkMulti =
      round >= 75 && round <= 80 && enemyTypes.includes("darkMulti");

    let droneCount = 0;
    let maxDrones = 3; // Allow up to 3 drones

    for (let i = 0; i < numEnemies; i++) {
      let x = random(50, width - 100);
      let y = random(50, 200);
      let enemyType = this.getRandomEnemyTypeForRound(
        round,
        enemyTypes,
        droneCount,
        maxDrones,
        guaranteedDarkMulti,
        i
      );
      if (enemyType && enemyType.includes("Drone")) droneCount++;
      let enemy = this.spawnEnemyOfType(enemyType, x, y);
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
    } else if (round >= 75 && round <= 80) {
      // Waves 75-80: Still dark rounds, but darkMulti spawns as usual
      return ["darkMulti", "darkDrone", "darkShield", "darkBeam"];
    } else if (round > 80) {
      // Wave 81+: All enemy types including dark
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
        // Only allow 'hole' pickup in dark rounds
        let types = Pickup.getPickupTypesWithoutLife();
        if (!this.isDarkRound()) {
          types = types.filter((t) => t !== "hole");
        }
        pickupType = random(types);
      } else {
        let types = Pickup.getPickupTypes();
        if (!this.isDarkRound()) {
          types = types.filter((t) => t !== "hole");
        }
        pickupType = random(types);
      }

      let pickupImage = this.getPickupImage(pickupType);
      let pickup = new Pickup(x, y, pickupType, pickupImage);
      this.groupPickup.push(pickup);
    }
  }

  getPickupImage(type) {
    return assetManager.getImageForType(type);
  }

  updatePlayerMovement() {
    // Clear slow effect if timer expired
    if (this.player.isSlowed && millis() > this.player.slowEndTime) {
      this.player.isSlowed = false;
    }
    // Use slower speed if slowed
    let moveSpeed = this.player.isSlowed
      ? GAME_CONFIG.PLAYER_SPEED_SLOWED || 2
      : GAME_CONFIG.PLAYER_SPEED || 5;
    if (keyIsDown(65)) {
      // A key
      this.player.move("left", moveSpeed);
    }
    if (keyIsDown(68)) {
      // D key
      this.player.move("right", moveSpeed);
    }
    if (keyIsDown(83)) {
      // S key
      this.player.move("down", moveSpeed);
    }
    if (keyIsDown(87)) {
      // W key
      this.player.move("up", moveSpeed);
    }
  }

  updateAliens() {
    // Always clear orphaned shields before updating
    this.clearOrphanedShields();
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
          this.groupAlien[i].type !== "darkBeam" &&
          this.groupAlien[i].type !== "darkShield"
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

    // Draw all dark shield connectors after all enemies are drawn
    this.drawAllDarkShieldConnectors();
  }

  drawAllDarkShieldConnectors() {
    // Set up connector drawing
    stroke(100, 0, 150, 200); // Dark purple with transparency
    strokeWeight(GAME_CONFIG.DARK_CONNECTOR_WIDTH);
    noFill();

    // Draw connectors for all dark shield enemies
    for (let enemy of this.groupAlien) {
      if (enemy && enemy.type === "darkShield") {
        let center = enemy.getCenter();

        for (let connector of enemy.connectors) {
          if (connector.enemy) {
            let enemyCenter = connector.enemy.getCenter();

            // Draw connector line from shield to enemy
            line(center.x, center.y, enemyCenter.x, enemyCenter.y);

            // Draw small connector nodes at each end
            fill(100, 0, 150, 150);
            noStroke();
            ellipse(center.x, center.y, 8, 8);
            ellipse(enemyCenter.x, enemyCenter.y, 8, 8);

            // Reset stroke for next connector
            stroke(100, 0, 150, 200);
            strokeWeight(GAME_CONFIG.DARK_CONNECTOR_WIDTH);
            noFill();
          }
        }
      }
    }

    // Reset stroke at the end
    stroke(0);
    strokeWeight(1);
    noFill();
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
            // After removing the shield, clear shields from all enemies whose shielder is gone
            this.clearOrphanedShields();
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
        const type = this.groupPickup[i].type;
        gameState.activatePowerup(type);
        if (type === "dark") {
          this.player.image = assetManager.getImageForType("dark-player");
        }
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
      let bullet = this.groupEnemyBullet[i];
      if (!bullet) {
        this.groupEnemyBullet.splice(i, 1);
        continue;
      }

      bullet.move();

      // Add ticking for RocketBullet (sidewinder)
      if (bullet instanceof RocketBullet) {
        bullet.applyDamageOverTime();
      }

      if (bullet.shouldExplode && bullet.shouldExplode()) {
        bullet.explode();
      }

      if (bullet.shouldRemove && bullet.shouldRemove()) {
        this.groupEnemyBullet.splice(i, 1);
        continue;
      }

      if (bullet instanceof ToxicGasBullet && this.player) {
        bullet.applyGasDamage(this.player);
      }

      // Restore regular enemy bullet collision and damage
      if (
        this.player &&
        !(bullet instanceof SawBladeBullet) &&
        bullet.checkCollision(this.player)
      ) {
        // Skip damage if player is invincible
        if (gameState.isInvincible) {
          this.groupEnemyBullet.splice(i, 1);
          continue;
        }

        let damage = 10; // Default
        if (bullet instanceof EnemyIceBullet)
          damage = GAME_CONFIG.ICE_BULLET_DAMAGE;
        else if (bullet instanceof IceWaveBullet)
          damage = GAME_CONFIG.ICE_WAVE_DAMAGE;
        else if (bullet instanceof FireBullet)
          damage = GAME_CONFIG.FIRE_BULLET_DAMAGE;
        else if (bullet instanceof ToxicBullet)
          damage = GAME_CONFIG.TOXIC_BULLET_DAMAGE;
        else if (bullet instanceof DarkBullet)
          damage = GAME_CONFIG.DARK_BULLET_DAMAGE;
        else if (bullet instanceof DarkMultiBullet)
          damage = GAME_CONFIG.DARK_BULLET_DAMAGE;

        if (bullet instanceof RocketBullet) {
          bullet.attachToPlayer(this.player);
          continue;
        }

        if (bullet instanceof IceWaveBullet) {
          // Apply slow effect to player
          this.player.isSlowed = true;
          this.player.slowEndTime =
            millis() + (GAME_CONFIG.ICE_WAVE_SLOW_DURATION || 2000);
        }

        if (gameState.shields > 0) {
          gameState.shields--;
          console.log(
            "Shield absorbed damage! Shields remaining:",
            gameState.shields
          );
        } else {
          gameState.health -= damage;
          console.log("Player hit! Health remaining:", gameState.health);
        }
        this.groupEnemyBullet.splice(i, 1);
        this.checkGameOver();
        continue;
      }

      bullet.draw();
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

      // If the bullet hasn't exploded, check if any enemy is in range
      if (!this.groupIceBullet[i].hasExploded) {
        for (let j = this.groupAlien.length - 1; j >= 0; j--) {
          if (!this.groupAlien[j]) continue;
          // Use the same logic as checkExplosionCollision, but before explosion
          let bullet = this.groupIceBullet[i];
          let alien = this.groupAlien[j];
          let explosionCenterX = bullet.xPos + bullet.size / 2;
          let explosionCenterY = bullet.yPos + bullet.size / 2;
          let alienCenterX = alien.xPos + alien.size / 2;
          let alienCenterY = alien.yPos + alien.size / 2;
          let dx = alienCenterX - explosionCenterX;
          let dy = alienCenterY - explosionCenterY;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < bullet.explosionSize / 2) {
            bullet.explode();
            break; // Only explode once per bullet
          }
        }
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
              // After removing the shield, clear shields from all enemies whose shielder is gone
              this.clearOrphanedShields();
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
    if (gameState.isDarkMode) {
      this.player.image = assetManager.getImageForType("dark-player");
      return;
    }
    if (gameState.isFireMode) {
      this.player.image = assetManager.getImageForType("fire2");
    } else if (gameState.isIceMode) {
      this.player.image = assetManager.getImageForType("ice2");
    } else if (gameState.isLaserMode) {
      this.player.image = assetManager.getImageForType("player");
    } else if (gameState.isScrapMode) {
      this.player.image = assetManager.getImageForType("scrapShip");
    } else if (gameState.isAngelMode) {
      this.player.image = assetManager.getImageForType("angel");
    } else {
      this.player.image = assetManager.getImageForType("player1");
    }
  }

  handleGameOver() {
    // Check if player has a life pickup to auto-restore
    if (gameState.lifePickupHeld > 0) {
      gameState.activateAngelMode();
      this.updatePlayerImage();
      // Prevent immediate game over by skipping the rest of this block
      return;
    } else {
      this.clearAllBullets();
      gameState.deactivateAllPowerups && gameState.deactivateAllPowerups();
      gameState.gameOver();
    }
  }

  checkGameOver() {
    if (gameState.health <= 0) {
      this.handleGameOver();
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

  // Call this when a pickup is collected
  onPickupCollected(type) {
    if (type === "hole") {
      this.holePickupCollected = true;
      this.blackBulletUses = 0;
    }
    // ... existing pickup logic ...
  }

  // Call this at the start of each round
  onRoundStart() {
    this.blackBulletUses = 0;
    this.holePickupCollected = false;
    this.activeBlackHole = null;
  }

  // Call this at the end of each round
  onRoundEnd() {
    this.activeBlackHole = null;
    this.groupBlackHole = [];
    this.groupBlackBullet = [];
    this.isBlackHoleMode = false;
  }

  // Stub for firing black bullet
  fireBlackBullet(x, y, angle) {
    if (!this.isDarkRound() || !this.holePickupCollected) return;
    if (this.blackBulletUses >= this.maxBlackBulletUses) return;
    if (this.isBlackHoleMode) return; // Only one black hole at a time
    if (gameState.isAngelMode) return; // Block in angel mode
    this.blackBulletUses++;
    const blackBulletImg = assetManager.getImage("black-bullet");
    this.groupBlackBullet.push(new BlackBullet(x, y, angle, blackBulletImg));
  }

  // Call this in the main update loop
  updateBlackBulletsAndHoles() {
    // Update BlackBullets
    for (let i = this.groupBlackBullet.length - 1; i >= 0; i--) {
      let bullet = this.groupBlackBullet[i];
      bullet.move();
      bullet.draw();
      if (bullet.shouldTransform()) {
        const blackHole = bullet.transform();
        this.groupBlackHole.push(blackHole);
        this.groupBlackBullet.splice(i, 1);
        this.isBlackHoleMode = true;
      } else if (bullet.isOffScreen()) {
        this.groupBlackBullet.splice(i, 1);
      }
    }
    // Update BlackHoles
    for (let i = this.groupBlackHole.length - 1; i >= 0; i--) {
      let blackHole = this.groupBlackHole[i];
      blackHole.draw();
      // Suck effect: enemies, enemy bullets, player bullets
      // For shield logic, pass a list of shield givers (darkShield enemies)
      const shieldGivers = this.groupAlien.filter(
        (e) => e.type === "darkShield"
      );
      blackHole.applySuckEffect(
        this.groupAlien,
        this.groupEnemyBullet,
        this.groupBullet,
        shieldGivers
      );
      if (blackHole.shouldRemove()) {
        this.groupBlackHole.splice(i, 1);
        this.isBlackHoleMode = false;
      }
    }
  }

  isDarkRound() {
    // Example: dark rounds are 60 and above
    return gameState.currentRound >= 60;
  }

  // Add this helper method to GameManager
  clearOrphanedShields() {
    // Build a set of all current shielders
    const currentShielders = new Set(
      this.groupAlien.filter((e) => e && e.type === "darkShield")
    );
    for (let enemy of this.groupAlien) {
      if (
        enemy &&
        enemy.isInvulnerable &&
        enemy.shieldedBy &&
        !currentShielders.has(enemy.shieldedBy)
      ) {
        enemy.isInvulnerable = false;
        enemy.shieldedBy = null;
      }
    }
  }
}

// Add a key handler for firing black bullet if hole pickup is collected
function keyPressed() {
  if (key === "q" || key === "Q") {
    if (
      typeof gameManager !== "undefined" &&
      gameManager.holePickupCollected &&
      gameManager.isDarkRound() &&
      (!gameManager.maxBlackBulletUses ||
        gameManager.blackBulletUses < gameManager.maxBlackBulletUses)
    ) {
      // Fire black bullet from player position and angle
      const player = gameManager.player;
      if (player) {
        const angle = player.rotation || 0;
        gameManager.fireBlackBullet(player.xPos, player.yPos, angle);
      }
    }
  }
}
