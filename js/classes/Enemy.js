function drawSprite(img, x, y, size, rotation = 0) {
  push();
  translate(x + size / 2, y + size / 2);
  if (rotation) rotate(rotation);
  image(img, -size / 2, -size / 2, size, size);
  pop();
}

class Alien {
  constructor(x, y, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = GAME_CONFIG.ENEMY_SPEED;
    this.size = GAME_CONFIG.ENEMY_SIZE;
    this.type = "regular"; // Add type property for regular enemies
    this.direction = {
      x: random([-1, 1]), // Random initial x direction
      y: random([-1, 1]), // Random initial y direction
    };
    // Invulnerability properties for dark shield system
    this.isInvulnerable = false;
    this.shieldedBy = null;
  }

  move() {
    // Randomly change direction occasionally
    if (random() < 0.02) {
      // 2% chance each frame to change direction
      this.direction.x = random([-1, 1]);
      this.direction.y = random([-1, 1]);
    }

    // Update position
    this.xPos += this.speed * this.direction.x;
    this.yPos += this.speed * this.direction.y;

    // Boundary checking
    if (this.xPos < 0) {
      this.xPos = 0;
      this.direction.x *= -1;
    }
    if (this.xPos > width - this.size) {
      this.xPos = width - this.size;
      this.direction.x *= -1;
    }
    if (this.yPos < 0) {
      this.yPos = 0;
      this.direction.y *= -1;
    }
    if (this.yPos > height - this.size) {
      this.yPos = height - this.size;
      this.direction.y *= -1;
    }
  }

  draw() {
    // Draw the enemy
    drawSprite(this.image, this.xPos, this.yPos, this.size);

    // Draw invulnerability indicator
    if (this.isInvulnerable) {
      // Draw a purple shield effect
      push();
      stroke(100, 0, 150, 150); // Dark purple with transparency
      strokeWeight(3);
      noFill();
      ellipse(
        this.xPos + this.size / 2,
        this.yPos + this.size / 2,
        this.size + 10,
        this.size + 10
      );
      pop();
    }
  }

  shouldShoot() {
    return random() < GAME_CONFIG.ENEMY_SHOOT_CHANCE;
  }

  getCenter() {
    return {
      x: this.xPos + this.size / 2,
      y: this.yPos + this.size / 2,
    };
  }

  isOffScreen() {
    return this.yPos > height;
  }
}

class IceDrone extends Alien {
  constructor(x, y) {
    super(x, y, assetManager.getImage("iceDrone"));
    this.type = "iceDrone";
  }

  shouldShoot() {
    return random() < GAME_CONFIG.ICE_DRONE_SHOOT_CHANCE;
  }

  createBullet() {
    let center = this.getCenter();
    let targetX = gameManager.player
      ? gameManager.player.xPos + gameManager.player.size / 2
      : center.x;
    let targetY = gameManager.player
      ? gameManager.player.yPos + gameManager.player.size / 2
      : center.y;
    return new EnemyIceBullet(
      center.x,
      center.y,
      targetX,
      targetY,
      assetManager.getImage("iceBullet")
    );
  }
}

class IceSlower extends Alien {
  constructor(x, y) {
    super(x, y, assetManager.getImage("iceSlower"));
    this.type = "iceSlower";
  }

  shouldShoot() {
    return random() < GAME_CONFIG.ICE_SLOWER_SHOOT_CHANCE;
  }

  createBullet() {
    let center = this.getCenter();
    let targetX = gameManager.player
      ? gameManager.player.xPos + gameManager.player.size / 2
      : center.x;
    let targetY = gameManager.player
      ? gameManager.player.yPos + gameManager.player.size / 2
      : center.y;
    return new IceWaveBullet(
      center.x,
      center.y,
      targetX,
      targetY,
      assetManager.getImage("iceWave")
    );
  }
}

class IceSpeed extends Alien {
  constructor(x, y) {
    super(x, y, assetManager.getImage("iceSpeed"));
    this.type = "iceSpeed";
    this.speed = GAME_CONFIG.ENEMY_SPEED * 1.5; // 50% faster movement
  }

  shouldShoot() {
    return random() < GAME_CONFIG.ICE_SPEED_SHOOT_CHANCE;
  }

  createBullet() {
    let center = this.getCenter();
    let targetX = gameManager.player
      ? gameManager.player.xPos + gameManager.player.size / 2
      : center.x;
    let targetY = gameManager.player
      ? gameManager.player.yPos + gameManager.player.size / 2
      : center.y;
    return new EnemyIceBullet(
      center.x,
      center.y,
      targetX,
      targetY,
      assetManager.getImage("iceBullet")
    );
  }
}

class IceBeamEnemy extends Alien {
  constructor(x, y) {
    super(x, y, assetManager.getImage("iceBeam"));
    this.type = "iceBeam";
    this.beamActive = false;
    this.beamAngle = 0;
    this.lastDamageTime = 0;
    this.damageInterval = 1000; // Damage every 1 second when beam is active
  }

  update() {
    this.move();
    this.updateBeam();
  }

  updateBeam() {
    if (!gameManager.player || !gameState) return;

    let center = this.getCenter();
    let playerCenter = {
      x: gameManager.player.xPos + gameManager.player.size / 2,
      y: gameManager.player.yPos + gameManager.player.size / 2,
    };

    // Calculate distance to player
    let distance = dist(center.x, center.y, playerCenter.x, playerCenter.y);

    // Activate beam if player is in range
    if (distance <= GAME_CONFIG.ICE_BEAM_RANGE) {
      this.beamActive = true;
      // Calculate angle to player
      this.beamAngle = atan2(
        playerCenter.y - center.y,
        playerCenter.x - center.x
      );

      // Check if beam hits player and apply damage
      if (this.isBeamHittingPlayer()) {
        let currentTime = millis();
        if (currentTime - this.lastDamageTime >= this.damageInterval) {
          // Apply damage directly to game state (only affects player)
          if (gameState.shields > 0) {
            gameState.shields--; // Remove one shield
            console.log(
              "Shield absorbed ice beam damage! Shields remaining:",
              gameState.shields
            );
          } else {
            gameState.health -= GAME_CONFIG.ICE_BEAM_DAMAGE; // Deal damage
            console.log(
              "Player hit by ice beam! Health remaining:",
              gameState.health
            );
          }
          this.lastDamageTime = currentTime;

          // Check for game over after damage
          if (gameState.health <= 0) {
            gameManager.checkGameOver();
          }
        }
      }
    } else {
      this.beamActive = false;
    }
  }

  isBeamHittingPlayer() {
    if (!gameManager.player || !gameState) return false;

    let center = this.getCenter();
    let playerCenter = {
      x: gameManager.player.xPos + gameManager.player.size / 2,
      y: gameManager.player.yPos + gameManager.player.size / 2,
    };

    // Calculate beam start position (shifted forward by half the beam length)
    let beamStartX =
      center.x + cos(this.beamAngle) * (GAME_CONFIG.ICE_BEAM_LENGTH / 2);
    let beamStartY =
      center.y + sin(this.beamAngle) * (GAME_CONFIG.ICE_BEAM_LENGTH / 2);

    // Calculate distance from beam start to player
    let distance = dist(beamStartX, beamStartY, playerCenter.x, playerCenter.y);

    // Check if player is within beam range and angle
    if (distance <= GAME_CONFIG.ICE_BEAM_LENGTH) {
      // Calculate angle from beam start to player
      let angleToPlayer = atan2(
        playerCenter.y - beamStartY,
        playerCenter.x - beamStartX
      );
      let angleDiff = abs(angleToPlayer - this.beamAngle);

      // Normalize angle difference
      if (angleDiff > PI) {
        angleDiff = TWO_PI - angleDiff;
      }

      // Check if player is within beam width (in radians)
      // Avoid division by zero by using a minimum distance
      let minDistance = max(distance, 1);
      let beamWidthRadians = atan2(GAME_CONFIG.ICE_BEAM_WIDTH / 2, minDistance);
      return angleDiff <= beamWidthRadians;
    }
    return false;
  }

  // Check if beam hits any enemy (for collision detection)
  isBeamHittingEnemy(enemy) {
    if (!enemy || enemy === this) return false; // Don't hit self

    let center = this.getCenter();
    let enemyCenter = {
      x: enemy.xPos + enemy.size / 2,
      y: enemy.yPos + enemy.size / 2,
    };

    // Calculate beam start position (shifted forward by half the beam length)
    let beamStartX =
      center.x + cos(this.beamAngle) * (GAME_CONFIG.ICE_BEAM_LENGTH / 2);
    let beamStartY =
      center.y + sin(this.beamAngle) * (GAME_CONFIG.ICE_BEAM_LENGTH / 2);

    // Calculate distance from beam start to enemy
    let distance = dist(beamStartX, beamStartY, enemyCenter.x, enemyCenter.y);

    // Check if enemy is within beam range and angle
    if (distance <= GAME_CONFIG.ICE_BEAM_LENGTH) {
      // Calculate angle to enemy from beam start
      let angleToEnemy = atan2(
        enemyCenter.y - beamStartY,
        enemyCenter.x - beamStartX
      );
      let angleDiff = abs(angleToEnemy - this.beamAngle);

      // Normalize angle difference
      if (angleDiff > PI) {
        angleDiff = TWO_PI - angleDiff;
      }

      // Check if enemy is within beam width (in radians)
      // Avoid division by zero by using a minimum distance
      let minDistance = max(distance, 1);
      let beamWidthRadians = atan2(GAME_CONFIG.ICE_BEAM_WIDTH / 2, minDistance);
      return angleDiff <= beamWidthRadians;
    }
    return false;
  }

  draw() {
    // Draw the enemy
    drawSprite(this.image, this.xPos, this.yPos, this.size);

    // Draw the beam if active
    if (this.beamActive) {
      this.drawBeam();
    }
  }

  drawBeam() {
    let center = this.getCenter();
    let beamImage = assetManager.getImage("iceBeamBullet");

    // Calculate beam start position (shifted forward by half the beam length)
    let beamStartX =
      center.x + cos(this.beamAngle) * (GAME_CONFIG.ICE_BEAM_LENGTH / 2);
    let beamStartY =
      center.y + sin(this.beamAngle) * (GAME_CONFIG.ICE_BEAM_LENGTH / 2);

    try {
      if (beamImage && beamImage.width) {
        // Use the beam image, stretched to the correct length and width
        push();
        translate(beamStartX, beamStartY);
        rotate(this.beamAngle + HALF_PI);
        imageMode(CENTER);
        image(
          beamImage,
          0,
          0,
          GAME_CONFIG.ICE_BEAM_WIDTH,
          GAME_CONFIG.ICE_BEAM_LENGTH
        );
        pop();
      } else {
        // Fallback to line drawing if image not loaded
        stroke(0, 150, 255, 150); // Blue beam with transparency
        strokeWeight(GAME_CONFIG.ICE_BEAM_WIDTH);
        noFill();

        // Calculate beam end point
        let endX =
          beamStartX + cos(this.beamAngle) * GAME_CONFIG.ICE_BEAM_LENGTH;
        let endY =
          beamStartY + sin(this.beamAngle) * GAME_CONFIG.ICE_BEAM_LENGTH;

        // Draw the beam
        line(beamStartX, beamStartY, endX, endY);

        // Reset stroke
        stroke(0);
        strokeWeight(1);
      }
    } catch (error) {
      console.log("Error drawing beam:", error);
      // Fallback to simple line drawing
      stroke(0, 150, 255, 150);
      strokeWeight(GAME_CONFIG.ICE_BEAM_WIDTH);
      noFill();
      line(
        beamStartX,
        beamStartY,
        beamStartX + cos(this.beamAngle) * GAME_CONFIG.ICE_BEAM_LENGTH,
        beamStartY + sin(this.beamAngle) * GAME_CONFIG.ICE_BEAM_LENGTH
      );
      stroke(0);
      strokeWeight(1);
    }
  }

  // Override shouldShoot to return false since this enemy doesn't use bullets
  shouldShoot() {
    return false;
  }
}

class FireDrone extends Alien {
  constructor(x, y) {
    super(x, y, assetManager.getImage("fireDrone"));
    this.type = "fireDrone";
  }

  shouldShoot() {
    return random() < GAME_CONFIG.FIRE_DRONE_SHOOT_CHANCE;
  }

  createBullet() {
    let center = this.getCenter();
    let targetX = gameManager.player
      ? gameManager.player.xPos + gameManager.player.size / 2
      : center.x;
    let targetY = gameManager.player
      ? gameManager.player.yPos + gameManager.player.size / 2
      : center.y;
    return new FireBullet(
      center.x,
      center.y,
      targetX,
      targetY,
      assetManager.getImage("fireBullet")
    );
  }
}

class RocketEnemy extends Alien {
  constructor(x, y) {
    super(x, y, assetManager.getImage("rocket"));
    this.type = "rocket";
    this.speed = GAME_CONFIG.ROCKET_SPEED; // Slower movement
  }

  shouldShoot() {
    return random() < GAME_CONFIG.ROCKET_SHOOT_CHANCE;
  }

  createBullet() {
    let center = this.getCenter();
    let targetX = gameManager.player
      ? gameManager.player.xPos + gameManager.player.size / 2
      : center.x;
    let targetY = gameManager.player
      ? gameManager.player.yPos + gameManager.player.size / 2
      : center.y;
    return new RocketBullet(
      center.x,
      center.y,
      targetX,
      targetY,
      assetManager.getImage("sidewinder")
    );
  }
}

class FireSpeed extends Alien {
  constructor(x, y) {
    super(x, y, assetManager.getImage("fireSpeed"));
    this.type = "fireSpeed";
    this.speed = GAME_CONFIG.ENEMY_SPEED * GAME_CONFIG.FIRE_SPEED_MULTIPLIER; // 50% faster movement
  }

  shouldShoot() {
    return random() < GAME_CONFIG.FIRE_SPEED_SHOOT_CHANCE;
  }

  createBullet() {
    let center = this.getCenter();
    let targetX = gameManager.player
      ? gameManager.player.xPos + gameManager.player.size / 2
      : center.x;
    let targetY = gameManager.player
      ? gameManager.player.yPos + gameManager.player.size / 2
      : center.y;
    return new FireBullet(
      center.x,
      center.y,
      targetX,
      targetY,
      assetManager.getImage("fireBullet")
    );
  }
}

class ToxicDrone extends Alien {
  constructor(x, y) {
    super(x, y, assetManager.getImage("toxicDrone"));
    this.type = "toxicDrone";
  }

  shouldShoot() {
    return random() < GAME_CONFIG.TOXIC_DRONE_SHOOT_CHANCE;
  }

  createBullet() {
    let center = this.getCenter();
    let targetX = gameManager.player
      ? gameManager.player.xPos + gameManager.player.size / 2
      : center.x;
    let targetY = gameManager.player
      ? gameManager.player.yPos + gameManager.player.size / 2
      : center.y;
    return new ToxicBullet(
      center.x,
      center.y,
      targetX,
      targetY,
      assetManager.getImage("toxicBullet")
    );
  }
}

class ToxicGas extends Alien {
  constructor(x, y) {
    super(x, y, assetManager.getImage("toxicGas"));
    this.type = "toxicGas";
    this.lastShotTime = 0;
    this.shootCooldown = 2000; // 2 seconds cooldown
  }

  shouldShoot() {
    let now = millis();
    if (now - this.lastShotTime < this.shootCooldown) return false;
    if (random() < GAME_CONFIG.TOXIC_GAS_SHOOT_CHANCE) {
      this.lastShotTime = now;
      return true;
    }
    return false;
  }

  createBullet() {
    let center = this.getCenter();
    let playerCenter = gameManager.player
      ? {
          x: gameManager.player.xPos + gameManager.player.size / 2,
          y: gameManager.player.yPos + gameManager.player.size / 2,
        }
      : center;
    let angle = atan2(playerCenter.y - center.y, playerCenter.x - center.x);
    return new ToxicGasBullet(
      center.x,
      center.y,
      angle,
      assetManager.getImage("toxicCan"),
      assetManager.getImage("toxicExplo")
    );
  }
}

class DarkDrone extends Alien {
  constructor(x, y) {
    super(x, y, assetManager.getImage("darkDrone"));
    this.type = "darkDrone";
  }

  shouldShoot() {
    return random() < GAME_CONFIG.DARK_DRONE_SHOOT_CHANCE;
  }

  createBullet() {
    let center = this.getCenter();
    let targetX = gameManager.player
      ? gameManager.player.xPos + gameManager.player.size / 2
      : center.x;
    let targetY = gameManager.player
      ? gameManager.player.yPos + gameManager.player.size / 2
      : center.y;
    return new DarkBullet(
      center.x,
      center.y,
      targetX,
      targetY,
      assetManager.getImage("darkBullet")
    );
  }
}

class DarkBeamEnemy extends Alien {
  constructor(x, y) {
    super(x, y, assetManager.getImage("darkBeam"));
    this.type = "darkBeam";
    this.beamActive = false;
    this.beamAngle = 0;
    this.lastDamageTime = 0;
    this.damageInterval = 1000; // Damage every 1 second when beam is active
  }

  update() {
    this.move();
    this.updateBeam();
  }

  updateBeam() {
    if (!gameManager.player || !gameState) return;

    let center = this.getCenter();
    let playerCenter = {
      x: gameManager.player.xPos + gameManager.player.size / 2,
      y: gameManager.player.yPos + gameManager.player.size / 2,
    };

    // Calculate distance to player
    let distance = dist(center.x, center.y, playerCenter.x, playerCenter.y);

    // Activate beam if player is in range
    if (distance <= GAME_CONFIG.DARK_BEAM_RANGE) {
      this.beamActive = true;
      // Calculate angle to player
      this.beamAngle = atan2(
        playerCenter.y - center.y,
        playerCenter.x - center.x
      );

      // Check if beam hits player and apply damage
      if (this.isBeamHittingPlayer()) {
        let currentTime = millis();
        if (currentTime - this.lastDamageTime >= this.damageInterval) {
          // Apply damage directly to game state (only affects player)
          if (gameState.shields > 0) {
            gameState.shields--; // Remove one shield
            console.log(
              "Shield absorbed dark beam damage! Shields remaining:",
              gameState.shields
            );
          } else {
            gameState.health -= GAME_CONFIG.DARK_BEAM_DAMAGE; // Deal damage
            console.log(
              "Player hit by dark beam! Health remaining:",
              gameState.health
            );
          }
          this.lastDamageTime = currentTime;

          // Check for game over after damage
          if (gameState.health <= 0) {
            gameManager.checkGameOver();
          }
        }
      }
    } else {
      this.beamActive = false;
    }
  }

  isBeamHittingPlayer() {
    if (!gameManager.player || !gameState) return false;

    let center = this.getCenter();
    let playerCenter = {
      x: gameManager.player.xPos + gameManager.player.size / 2,
      y: gameManager.player.yPos + gameManager.player.size / 2,
    };

    // Calculate beam start position (shifted forward by half the beam length)
    let beamStartX =
      center.x + cos(this.beamAngle) * (GAME_CONFIG.DARK_BEAM_LENGTH / 2);
    let beamStartY =
      center.y + sin(this.beamAngle) * (GAME_CONFIG.DARK_BEAM_LENGTH / 2);

    // Calculate distance from beam start to player
    let distance = dist(beamStartX, beamStartY, playerCenter.x, playerCenter.y);

    // Check if player is within beam range and angle
    if (distance <= GAME_CONFIG.DARK_BEAM_LENGTH) {
      // Calculate angle from beam start to player
      let angleToPlayer = atan2(
        playerCenter.y - beamStartY,
        playerCenter.x - beamStartX
      );
      let angleDiff = abs(angleToPlayer - this.beamAngle);

      // Normalize angle difference
      if (angleDiff > PI) {
        angleDiff = TWO_PI - angleDiff;
      }

      // Check if player is within beam width (in radians)
      // Avoid division by zero by using a minimum distance
      let minDistance = max(distance, 1);
      let beamWidthRadians = atan2(
        GAME_CONFIG.DARK_BEAM_WIDTH / 2,
        minDistance
      );
      return angleDiff <= beamWidthRadians;
    }
    return false;
  }

  draw() {
    // Draw the enemy
    drawSprite(this.image, this.xPos, this.yPos, this.size);

    // Draw the beam if active
    if (this.beamActive) {
      this.drawBeam();
    }
  }

  drawBeam() {
    let center = this.getCenter();
    let beamImage = assetManager.getImage("darkBeamBullet");

    // Calculate beam start position (shifted forward by half the beam length)
    let beamStartX =
      center.x + cos(this.beamAngle) * (GAME_CONFIG.DARK_BEAM_LENGTH / 2);
    let beamStartY =
      center.y + sin(this.beamAngle) * (GAME_CONFIG.DARK_BEAM_LENGTH / 2);

    try {
      if (beamImage && beamImage.width) {
        // Use the beam image
        drawSprite(
          beamImage,
          beamStartX,
          beamStartY,
          GAME_CONFIG.DARK_BEAM_WIDTH,
          this.beamAngle + HALF_PI
        );
      } else {
        // Fallback to line drawing if image not loaded
        stroke(100, 0, 150, 150); // Purple beam with transparency
        strokeWeight(GAME_CONFIG.DARK_BEAM_WIDTH);
        noFill();

        // Calculate beam end point
        let endX =
          beamStartX + cos(this.beamAngle) * GAME_CONFIG.DARK_BEAM_LENGTH;
        let endY =
          beamStartY + sin(this.beamAngle) * GAME_CONFIG.DARK_BEAM_LENGTH;

        // Draw the beam
        line(beamStartX, beamStartY, endX, endY);

        // Reset stroke
        stroke(0);
        strokeWeight(1);
      }
    } catch (error) {
      console.log("Error drawing dark beam:", error);
      // Fallback to simple line drawing
      stroke(100, 0, 150, 150);
      strokeWeight(GAME_CONFIG.DARK_BEAM_WIDTH);
      noFill();
      line(
        beamStartX,
        beamStartY,
        beamStartX + cos(this.beamAngle) * GAME_CONFIG.DARK_BEAM_LENGTH,
        beamStartY + sin(this.beamAngle) * GAME_CONFIG.DARK_BEAM_LENGTH
      );
      stroke(0);
      strokeWeight(1);
    }
  }

  // Override shouldShoot to return false since this enemy doesn't use bullets
  shouldShoot() {
    return false;
  }
}

class DarkMultiEnemy extends Alien {
  constructor(x, y) {
    super(x, y, assetManager.getImage("darkMulti"));
    this.type = "darkMulti";
  }

  shouldShoot() {
    return random() < GAME_CONFIG.DARK_MULTI_SHOOT_CHANCE;
  }

  createBullet() {
    let center = this.getCenter();
    let targetX = gameManager.player
      ? gameManager.player.xPos + gameManager.player.size / 2
      : center.x;
    let targetY = gameManager.player
      ? gameManager.player.yPos + gameManager.player.size / 2
      : center.y;
    return new DarkMultiBullet(
      center.x,
      center.y,
      targetX,
      targetY,
      assetManager.getImage("darkLaser")
    );
  }
}

class DarkShieldEnemy extends Alien {
  constructor(x, y) {
    super(x, y, assetManager.getImage("darkShield"));
    this.type = "darkShield";
    this.connectedEnemies = []; // Array of connected enemy objects
    this.connectors = []; // Array of connector line objects
    this.maxConnections = GAME_CONFIG.DARK_SHIELD_MAX_CONNECTIONS;
    this.connectorRange = GAME_CONFIG.DARK_SHIELD_CONNECTOR_RANGE;
    this.lastConnectionUpdate = 0;
    this.connectionUpdateInterval = 1000; // Update connections every second
  }

  update() {
    this.move();
    this.updateConnections();
  }

  updateConnections() {
    let currentTime = millis();
    if (
      currentTime - this.lastConnectionUpdate <
      this.connectionUpdateInterval
    ) {
      return;
    }
    this.lastConnectionUpdate = currentTime;

    // Clear old connections
    this.clearConnections();

    // Find nearby enemies to connect to
    let nearbyEnemies = this.findNearbyEnemies();

    // Connect to up to maxConnections enemies
    for (
      let i = 0;
      i < Math.min(this.maxConnections, nearbyEnemies.length);
      i++
    ) {
      let enemy = nearbyEnemies[i];
      if (enemy && enemy !== this && !enemy.isInvulnerable) {
        this.connectToEnemy(enemy);
      }
    }
  }

  findNearbyEnemies() {
    let nearbyEnemies = [];
    let center = this.getCenter();

    // Check all enemies in the game
    for (let enemy of gameManager.groupAlien) {
      if (!enemy || enemy === this || enemy.type === "darkShield") continue;

      let enemyCenter = enemy.getCenter();
      let distance = dist(center.x, center.y, enemyCenter.x, enemyCenter.y);

      if (distance <= this.connectorRange) {
        nearbyEnemies.push(enemy);
      }
    }

    // Sort by distance (closest first)
    nearbyEnemies.sort((a, b) => {
      let center = this.getCenter();
      let distA = dist(center.x, center.y, a.getCenter().x, a.getCenter().y);
      let distB = dist(center.x, center.y, b.getCenter().x, b.getCenter().y);
      return distA - distB;
    });

    return nearbyEnemies;
  }

  connectToEnemy(enemy) {
    if (this.connectedEnemies.length >= this.maxConnections) return;
    if (enemy.isInvulnerable) return;
    if (enemy === this) return; // Prevent self-connection

    // Add enemy to connected list
    this.connectedEnemies.push(enemy);

    // Create connector line
    let connector = {
      enemy: enemy,
    };
    this.connectors.push(connector);

    // Make enemy invulnerable
    enemy.isInvulnerable = true;
    enemy.shieldedBy = this;

    console.log(
      `Dark shield connected to ${enemy.type}, total connections: ${this.connectedEnemies.length}`
    );
  }

  clearConnections() {
    // Remove invulnerability from all connected enemies
    for (let enemy of this.connectedEnemies) {
      if (enemy && enemy.isInvulnerable && enemy.shieldedBy === this) {
        enemy.isInvulnerable = false;
        enemy.shieldedBy = null;
        console.log(`Dark shield disconnected from ${enemy.type}`);
      }
    }

    // Clear arrays
    this.connectedEnemies = [];
    this.connectors = [];
  }

  draw() {
    // Draw the shield enemy
    drawSprite(this.image, this.xPos, this.yPos, this.size);

    // Connectors are now drawn centrally in GameManager.drawAllDarkShieldConnectors()
  }

  // Override shouldShoot to return false since this enemy doesn't use bullets
  shouldShoot() {
    return false;
  }

  // Called when this enemy is destroyed
  onDestroy() {
    this.clearConnections();
  }
}
