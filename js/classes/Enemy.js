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
    image(this.image, this.xPos, this.yPos, this.size, this.size);
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
      // Calculate angle to player and rotate by 90 degrees positive
      this.beamAngle =
        atan2(playerCenter.y - center.y, playerCenter.x - center.x) + PI / 2; // Rotate 90 degrees clockwise

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
    image(this.image, this.xPos, this.yPos, this.size, this.size);

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
        // Use the beam image
        push();
        translate(beamStartX, beamStartY);
        rotate(this.beamAngle);

        // Draw the beam image stretched to the desired dimensions
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
