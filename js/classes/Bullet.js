class Bullet {
  constructor(x, y, angle, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = GAME_CONFIG.BULLET_SPEED;
    this.size = GAME_CONFIG.BULLET_SIZE;

    // Calculate direction based on angle, matching ship's rotation
    this.directionX = cos(angle - PI / 2); // Subtract PI/2 to match ship's orientation
    this.directionY = sin(angle - PI / 2);
  }

  move() {
    this.xPos += this.directionX * this.speed;
    this.yPos += this.directionY * this.speed;
  }

  draw() {
    push();
    translate(this.xPos + this.size / 2, this.yPos + this.size / 2);
    rotate(atan2(this.directionY, this.directionX) + PI / 2);
    // Shift lazBulletImage 40px to the left for better alignment
    if (
      typeof assetManager !== "undefined" &&
      (this.image === assetManager.getImage("lazBullet") ||
        this.image === assetManager.getImage("bullet"))
    ) {
      image(
        this.image,
        -this.size / 2 - 30,
        -this.size / 2,
        this.size,
        this.size
      );
    } else {
      image(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
    }
    pop();
  }

  isOffScreen() {
    return (
      this.xPos < -50 ||
      this.xPos > width + 50 ||
      this.yPos < -50 ||
      this.yPos > height + 50
    );
  }

  checkCollision(alien) {
    return (
      this.xPos < alien.xPos + alien.size &&
      this.xPos + this.size > alien.xPos &&
      this.yPos < alien.yPos + alien.size &&
      this.yPos + this.size > alien.yPos
    );
  }
}

class IceBullet {
  constructor(x, y, angle, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = GAME_CONFIG.ICE_BULLET_SPEED;
    this.size = GAME_CONFIG.BULLET_SIZE;
    this.creationTime = millis();
    this.lifeTime = GAME_CONFIG.ICE_BULLET_LIFE_TIME;
    this.hasExploded = false;
    this.explosionSize = GAME_CONFIG.ICE_EXPLOSION_SIZE;
    this.explosionStartTime = 0;
    this.explosionDuration = GAME_CONFIG.ICE_EXPLOSION_DURATION;

    // Calculate direction based on angle, matching ship's rotation
    this.directionX = cos(angle - PI / 2);
    this.directionY = sin(angle - PI / 2);
  }

  move() {
    if (!this.hasExploded) {
      this.xPos += this.directionX * this.speed;
      this.yPos += this.directionY * this.speed;
    }
  }

  draw() {
    if (!this.hasExploded) {
      push();
      translate(this.xPos + this.size / 2, this.yPos + this.size / 2);
      rotate(atan2(this.directionY, this.directionX) + PI / 2);
      image(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
      pop();
    } else {
      // Draw explosion centered on the original bullet position
      push();
      translate(this.xPos + this.size / 2, this.yPos + this.size / 2);
      image(
        this.image,
        -this.explosionSize / 2,
        -this.explosionSize / 2,
        this.explosionSize,
        this.explosionSize
      );
      pop();
    }
  }

  isOffScreen() {
    return (
      this.xPos < -100 ||
      this.xPos > width + 100 ||
      this.yPos < -100 ||
      this.yPos > height + 100
    );
  }

  shouldExplode() {
    return millis() - this.creationTime >= this.lifeTime && !this.hasExploded;
  }

  explode() {
    this.hasExploded = true;
    this.explosionStartTime = millis();
  }

  shouldRemove() {
    return (
      this.hasExploded &&
      millis() - this.explosionStartTime >= this.explosionDuration
    );
  }

  checkExplosionCollision(alien) {
    if (!this.hasExploded) return false;

    // Calculate explosion center (same as original bullet center)
    let explosionCenterX = this.xPos + this.size / 2;
    let explosionCenterY = this.yPos + this.size / 2;

    // Calculate alien center
    let alienCenterX = alien.xPos + alien.size / 2;
    let alienCenterY = alien.yPos + alien.size / 2;

    // Check if alien is within explosion radius
    let dx = alienCenterX - explosionCenterX;
    let dy = alienCenterY - explosionCenterY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    return distance < this.explosionSize / 2;
  }
}

class EnemyIceBullet {
  constructor(x, y, targetX, targetY, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = GAME_CONFIG.ICE_BULLET_SPEED;
    this.size = GAME_CONFIG.BULLET_SIZE;
    this.damage = GAME_CONFIG.ICE_BULLET_DAMAGE;

    // Calculate direction to player
    let dx = targetX - x;
    let dy = targetY - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    // Prevent division by zero
    if (distance === 0) {
      this.directionX = 0;
      this.directionY = 1;
    } else {
      this.directionX = dx / distance;
      this.directionY = dy / distance;
    }
  }

  move() {
    this.xPos += this.directionX * this.speed;
    this.yPos += this.directionY * this.speed;
  }

  draw() {
    image(this.image, this.xPos, this.yPos, this.size, this.size);
  }

  isOffScreen() {
    return (
      this.xPos < -50 ||
      this.xPos > width + 50 ||
      this.yPos < -50 ||
      this.yPos > height + 50
    );
  }

  checkCollision(player) {
    if (!player) return false;
    return (
      this.xPos < player.xPos + player.size &&
      this.xPos + this.size > player.xPos &&
      this.yPos < player.yPos + player.size &&
      this.yPos + this.size > player.yPos
    );
  }
}

class IceWaveBullet {
  constructor(x, y, targetX, targetY, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = GAME_CONFIG.ICE_WAVE_SPEED;
    this.size = GAME_CONFIG.BULLET_SIZE;
    this.damage = GAME_CONFIG.ICE_WAVE_DAMAGE;

    // Calculate direction to player
    let dx = targetX - x;
    let dy = targetY - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    // Prevent division by zero
    if (distance === 0) {
      this.directionX = 0;
      this.directionY = 1;
    } else {
      this.directionX = dx / distance;
      this.directionY = dy / distance;
    }
  }

  move() {
    this.xPos += this.directionX * this.speed;
    this.yPos += this.directionY * this.speed;
  }

  draw() {
    image(this.image, this.xPos, this.yPos, this.size, this.size);
  }

  isOffScreen() {
    return (
      this.xPos < -50 ||
      this.xPos > width + 50 ||
      this.yPos < -50 ||
      this.yPos > height + 50
    );
  }

  checkCollision(player) {
    if (!player) return false;
    return (
      this.xPos < player.xPos + player.size &&
      this.xPos + this.size > player.xPos &&
      this.yPos < player.yPos + player.size &&
      this.yPos + this.size > player.yPos
    );
  }
}

class EnemyBullet {
  constructor(x, y, targetX, targetY, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = 2; // Slower speed for enemy bullets
    this.size = GAME_CONFIG.BULLET_SIZE;

    // Calculate direction to player
    let dx = targetX - x;
    let dy = targetY - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    // Prevent division by zero
    if (distance === 0) {
      this.directionX = 0;
      this.directionY = 1;
    } else {
      this.directionX = dx / distance;
      this.directionY = dy / distance;
    }
  }

  move() {
    this.xPos += this.directionX * this.speed;
    this.yPos += this.directionY * this.speed;
  }

  draw() {
    image(this.image, this.xPos, this.yPos, this.size, this.size);
  }

  isOffScreen() {
    return (
      this.xPos < -50 ||
      this.xPos > width + 50 ||
      this.yPos < -50 ||
      this.yPos > height + 50
    );
  }

  checkCollision(player) {
    if (!player) return false;
    return (
      this.xPos < player.xPos + player.size &&
      this.xPos + this.size > player.xPos &&
      this.yPos < player.yPos + player.size &&
      this.yPos + this.size > player.yPos
    );
  }
}

class SawBladeBullet extends Bullet {
  constructor(x, y, angle, image) {
    super(x, y, angle, image);
    this.bounces = 0;
    this.maxBounces = 10;
  }

  draw() {
    push();
    translate(this.xPos + this.size / 2, this.yPos + this.size / 2);
    rotate(atan2(this.directionY, this.directionX) + PI / 2);
    image(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
    pop();
  }

  checkCollision(alien) {
    // Standard AABB collision
    if (
      this.xPos < alien.xPos + alien.size &&
      this.xPos + this.size > alien.xPos &&
      this.yPos < alien.yPos + alien.size &&
      this.yPos + this.size > alien.yPos
    ) {
      // Bounce: reflect direction
      let centerX = this.xPos + this.size / 2;
      let centerY = this.yPos + this.size / 2;
      let alienCenterX = alien.xPos + alien.size / 2;
      let alienCenterY = alien.yPos + alien.size / 2;
      let dx = centerX - alienCenterX;
      let dy = centerY - alienCenterY;
      if (Math.abs(dx) > Math.abs(dy)) {
        this.directionX *= -1; // Bounce horizontally
      } else {
        this.directionY *= -1; // Bounce vertically
      }
      this.bounces++;
      return true; // Still counts as a hit
    }
    return false;
  }

  shouldRemove() {
    return this.isOffScreen() || this.bounces > this.maxBounces;
  }
}

class FireBullet {
  constructor(x, y, targetX, targetY, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = GAME_CONFIG.FIRE_BULLET_SPEED;
    this.size = GAME_CONFIG.BULLET_SIZE;
    this.damage = GAME_CONFIG.FIRE_BULLET_DAMAGE;

    // Calculate direction to player
    let dx = targetX - x;
    let dy = targetY - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    // Prevent division by zero
    if (distance === 0) {
      this.directionX = 0;
      this.directionY = 1;
    } else {
      this.directionX = dx / distance;
      this.directionY = dy / distance;
    }
  }

  move() {
    this.xPos += this.directionX * this.speed;
    this.yPos += this.directionY * this.speed;
  }

  draw() {
    image(this.image, this.xPos, this.yPos, this.size, this.size);
  }

  isOffScreen() {
    return (
      this.xPos < -50 ||
      this.xPos > width + 50 ||
      this.yPos < -50 ||
      this.yPos > height + 50
    );
  }

  checkCollision(player) {
    if (!player) return false;
    return (
      this.xPos < player.xPos + player.size &&
      this.xPos + this.size > player.xPos &&
      this.yPos < player.yPos + player.size &&
      this.yPos + this.size > player.yPos
    );
  }
}

class RocketBullet {
  constructor(x, y, targetX, targetY, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = GAME_CONFIG.ROCKET_BULLET_SPEED;
    this.size = GAME_CONFIG.BULLET_SIZE;
    this.damagePerSecond = GAME_CONFIG.ROCKET_DAMAGE_PER_SECOND;
    this.totalDamage = GAME_CONFIG.ROCKET_TOTAL_DAMAGE;
    this.duration = GAME_CONFIG.ROCKET_DURATION;
    this.creationTime = millis();
    this.isAttached = false;
    this.attachedTo = null;

    // Calculate direction to player
    let dx = targetX - x;
    let dy = targetY - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    // Prevent division by zero
    if (distance === 0) {
      this.directionX = 0;
      this.directionY = 1;
    } else {
      this.directionX = dx / distance;
      this.directionY = dy / distance;
    }
  }

  move() {
    if (!this.isAttached) {
      this.xPos += this.directionX * this.speed;
      this.yPos += this.directionY * this.speed;
    } else if (this.attachedTo) {
      // Follow the attached target
      this.xPos =
        this.attachedTo.xPos + this.attachedTo.size / 2 - this.size / 2;
      this.yPos =
        this.attachedTo.yPos + this.attachedTo.size / 2 - this.size / 2;
    }
  }

  draw() {
    image(this.image, this.xPos, this.yPos, this.size, this.size);
  }

  isOffScreen() {
    return (
      this.xPos < -50 ||
      this.xPos > width + 50 ||
      this.yPos < -50 ||
      this.yPos > height + 50
    );
  }

  checkCollision(player) {
    if (!player || this.isAttached) return false;
    return (
      this.xPos < player.xPos + player.size &&
      this.xPos + this.size > player.xPos &&
      this.yPos < player.yPos + player.size &&
      this.yPos + this.size > player.yPos
    );
  }

  attachToPlayer(player) {
    if (!this.isAttached) {
      this.isAttached = true;
      this.attachedTo = player;
      this.creationTime = millis(); // Reset timer when attached
    }
  }

  shouldRemove() {
    if (this.isAttached) {
      return millis() - this.creationTime >= this.duration;
    }
    return this.isOffScreen();
  }

  applyDamageOverTime() {
    if (!this.isAttached || !this.attachedTo) return;

    let currentTime = millis();
    let elapsedTime = currentTime - this.creationTime;

    if (elapsedTime >= this.duration) {
      return; // Rocket has expired
    }

    // Apply damage every second
    if (
      Math.floor(elapsedTime / 1000) > Math.floor((elapsedTime - 16) / 1000)
    ) {
      // One second has passed, apply damage
      if (gameState.shields > 0) {
        gameState.shields--;
        console.log(
          "Shield absorbed rocket damage! Shields remaining:",
          gameState.shields
        );
      } else {
        gameState.health -= this.damagePerSecond;
        console.log("Rocket damage! Health remaining:", gameState.health);
      }

      // Check for game over
      if (gameState.health <= 0) {
        gameManager.checkGameOver();
      }
    }
  }
}

class ToxicBullet {
  constructor(x, y, targetX, targetY, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = GAME_CONFIG.TOXIC_BULLET_SPEED;
    this.size = GAME_CONFIG.BULLET_SIZE;
    this.damage = GAME_CONFIG.TOXIC_BULLET_DAMAGE;

    // Calculate direction to player
    let dx = targetX - x;
    let dy = targetY - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) {
      this.directionX = 0;
      this.directionY = 1;
    } else {
      this.directionX = dx / distance;
      this.directionY = dy / distance;
    }
  }

  move() {
    this.xPos += this.directionX * this.speed;
    this.yPos += this.directionY * this.speed;
  }

  draw() {
    image(this.image, this.xPos, this.yPos, this.size, this.size);
  }

  isOffScreen() {
    return (
      this.xPos < -50 ||
      this.xPos > width + 50 ||
      this.yPos < -50 ||
      this.yPos > height + 50
    );
  }

  checkCollision(player) {
    if (!player) return false;
    return (
      this.xPos < player.xPos + player.size &&
      this.xPos + this.size > player.xPos &&
      this.yPos < player.yPos + player.size &&
      this.yPos + this.size > player.yPos
    );
  }
}

class ToxicGasBullet {
  constructor(x, y, targetX, targetY, canImage, exploImage) {
    this.xPos = x;
    this.yPos = y;
    this.canImage = canImage;
    this.exploImage = exploImage;
    this.speed = GAME_CONFIG.TOXIC_BULLET_SPEED;
    this.size = GAME_CONFIG.BULLET_SIZE;
    this.hasExploded = false;
    this.explosionSize = GAME_CONFIG.TOXIC_GAS_EXPLOSION_SIZE;
    this.explosionStartTime = 0;
    this.explosionDuration = 2000; // 2 seconds linger
    this.damage = 10; // 10 damage per second
    this.creationTime = millis();
    this.lifeTime = 900; // ms before explosion
    this.lastDamageTick = 0;
    this.damageTickInterval = 100; // 1 damage every 100ms (10/sec)

    // Calculate direction to player
    let dx = targetX - x;
    let dy = targetY - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) {
      this.directionX = 0;
      this.directionY = 1;
    } else {
      this.directionX = dx / distance;
      this.directionY = dy / distance;
    }
  }

  move() {
    if (!this.hasExploded) {
      this.xPos += this.directionX * this.speed;
      this.yPos += this.directionY * this.speed;
    }
  }

  draw() {
    if (!this.hasExploded) {
      image(this.canImage, this.xPos, this.yPos, this.size, this.size);
    } else {
      // Draw lingering gas cloud
      push();
      translate(this.xPos + this.size / 2, this.yPos + this.size / 2);
      image(
        this.exploImage,
        -this.explosionSize / 2,
        -this.explosionSize / 2,
        this.explosionSize,
        this.explosionSize
      );
      pop();
    }
  }

  isOffScreen() {
    return (
      this.xPos < -100 ||
      this.xPos > width + 100 ||
      this.yPos < -100 ||
      this.yPos > height + 100
    );
  }

  shouldExplode() {
    return millis() - this.creationTime >= this.lifeTime && !this.hasExploded;
  }

  explode() {
    this.hasExploded = true;
    this.explosionStartTime = millis();
    this.lastDamageTick = millis();
  }

  shouldRemove() {
    return (
      this.hasExploded &&
      millis() - this.explosionStartTime >= this.explosionDuration
    );
  }

  checkExplosionCollision(player) {
    if (!this.hasExploded) return false;
    // Calculate explosion center (same as original bullet center)
    let explosionCenterX = this.xPos + this.size / 2;
    let explosionCenterY = this.yPos + this.size / 2;
    // Calculate player center
    let playerCenterX = player.xPos + player.size / 2;
    let playerCenterY = player.yPos + player.size / 2;
    // Check if player is within explosion radius
    let dx = playerCenterX - explosionCenterX;
    let dy = playerCenterY - explosionCenterY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.explosionSize / 2;
  }

  applyGasDamage(player) {
    if (!this.hasExploded) return;
    if (!this.checkExplosionCollision(player)) return;
    let now = millis();
    if (now - this.lastDamageTick >= this.damageTickInterval) {
      // Deal 1 damage per tick (10/sec)
      if (gameState.shields > 0) {
        gameState.shields--;
        console.log(
          "Shield absorbed toxic gas damage! Shields remaining:",
          gameState.shields
        );
      } else {
        gameState.health -= 1;
        console.log(
          "Player hit by toxic gas! Health remaining:",
          gameState.health
        );
      }
      this.lastDamageTick = now;
      if (gameState.health <= 0) {
        gameManager.checkGameOver();
      }
    }
  }
}

class DarkBullet {
  constructor(x, y, targetX, targetY, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = GAME_CONFIG.DARK_BULLET_SPEED;
    this.size = GAME_CONFIG.BULLET_SIZE;
    this.damage = GAME_CONFIG.DARK_BULLET_DAMAGE;

    // Calculate direction to player
    let dx = targetX - x;
    let dy = targetY - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) {
      this.directionX = 0;
      this.directionY = 1;
    } else {
      this.directionX = dx / distance;
      this.directionY = dy / distance;
    }
  }

  move() {
    this.xPos += this.directionX * this.speed;
    this.yPos += this.directionY * this.speed;
  }

  draw() {
    image(this.image, this.xPos, this.yPos, this.size, this.size);
  }

  isOffScreen() {
    return (
      this.xPos < -50 ||
      this.xPos > width + 50 ||
      this.yPos < -50 ||
      this.yPos > height + 50
    );
  }

  checkCollision(player) {
    if (!player) return false;
    return (
      this.xPos < player.xPos + player.size &&
      this.xPos + this.size > player.xPos &&
      this.yPos < player.yPos + player.size &&
      this.yPos + this.size > player.yPos
    );
  }
}

class DarkMultiBullet {
  constructor(x, y, targetX, targetY, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = GAME_CONFIG.DARK_BULLET_SPEED;
    this.size = GAME_CONFIG.BULLET_SIZE;
    this.damage = GAME_CONFIG.DARK_BULLET_DAMAGE;
    this.spacing = GAME_CONFIG.DARK_LASER_SPACING;

    // Calculate direction to player
    let dx = targetX - x;
    let dy = targetY - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) {
      this.directionX = 0;
      this.directionY = 1;
    } else {
      this.directionX = dx / distance;
      this.directionY = dy / distance;
    }
  }

  move() {
    this.xPos += this.directionX * this.speed;
    this.yPos += this.directionY * this.speed;
  }

  draw() {
    // Draw 3 lasers: center, left, and right
    // Center laser (rotated)
    push();
    translate(this.xPos + this.size / 2, this.yPos + this.size / 2);
    rotate(atan2(this.directionY, this.directionX) + PI / 2);
    image(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
    pop();

    // Left laser (not rotated)
    image(
      this.image,
      this.xPos - this.spacing,
      this.yPos,
      this.size,
      this.size
    );

    // Right laser (not rotated)
    image(
      this.image,
      this.xPos + this.spacing,
      this.yPos,
      this.size,
      this.size
    );
  }

  isOffScreen() {
    return (
      this.xPos < -50 ||
      this.xPos > width + 50 ||
      this.yPos < -50 ||
      this.yPos > height + 50
    );
  }

  checkCollision(player) {
    if (!player) return false;

    // Check collision for all 3 lasers
    let centerCollision =
      this.xPos < player.xPos + player.size &&
      this.xPos + this.size > player.xPos &&
      this.yPos < player.yPos + player.size &&
      this.yPos + this.size > player.yPos;

    let leftCollision =
      this.xPos - this.spacing < player.xPos + player.size &&
      this.xPos - this.spacing + this.size > player.xPos &&
      this.yPos < player.yPos + player.size &&
      this.yPos + this.size > player.yPos;

    let rightCollision =
      this.xPos + this.spacing < player.xPos + player.size &&
      this.xPos + this.spacing + this.size > player.xPos &&
      this.yPos < player.yPos + player.size &&
      this.yPos + this.size > player.yPos;

    return centerCollision || leftCollision || rightCollision;
  }
}
