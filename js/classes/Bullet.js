// Utility for drawing sprites/images with optional rotation
function drawSprite(img, x, y, size, rotation = 0) {
  push();
  translate(x + size / 2, y + size / 2);
  if (rotation) rotate(rotation);
  image(img, -size / 2, -size / 2, size, size);
  pop();
}

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
    drawSprite(
      this.image,
      this.xPos,
      this.yPos,
      this.size,
      atan2(this.directionY, this.directionX) + PI / 2
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

  static rectsOverlap(a, b) {
    return (
      a.xPos < b.xPos + b.size &&
      a.xPos + a.size > b.xPos &&
      a.yPos < b.yPos + b.size &&
      a.yPos + a.size > b.yPos
    );
  }

  checkCollision(player) {
    if (!player) return false;
    return Bullet.rectsOverlap(this, player);
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
      drawSprite(this.image, this.xPos, this.yPos, this.size);
    } else {
      // Draw explosion centered on the original bullet position
      drawSprite(
        this.image,
        this.xPos + (this.size - this.explosionSize) / 2,
        this.yPos + (this.size - this.explosionSize) / 2,
        this.explosionSize
      );
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

  checkCollision(player) {
    if (!player) return false;
    return Bullet.rectsOverlap(this, player);
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
    drawSprite(this.image, this.xPos, this.yPos, this.size);
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
    return Bullet.rectsOverlap(this, player);
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
    drawSprite(this.image, this.xPos, this.yPos, this.size);
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
    return Bullet.rectsOverlap(this, player);
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
    drawSprite(this.image, this.xPos, this.yPos, this.size);
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
    return Bullet.rectsOverlap(this, player);
  }
}

class SawBladeBullet extends Bullet {
  constructor(x, y, angle, image) {
    super(x, y, angle, image);
    this.bounces = 0;
    this.maxBounces = 10;
  }

  draw() {
    drawSprite(
      this.image,
      this.xPos,
      this.yPos,
      this.size,
      atan2(this.directionY, this.directionX) + PI / 2
    );
  }

  checkCollision(alien) {
    if (!alien) return false;
    const hit = Bullet.rectsOverlap(this, alien);
    if (hit) {
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
      return true;
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
    drawSprite(this.image, this.xPos, this.yPos, this.size);
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
    return Bullet.rectsOverlap(this, player);
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
    drawSprite(this.image, this.xPos, this.yPos, this.size);
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
    return Bullet.rectsOverlap(this, player);
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
    drawSprite(this.image, this.xPos, this.yPos, this.size);
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
    return Bullet.rectsOverlap(this, player);
  }
}

class ToxicGasBullet {
  constructor(x, y, angle, canImage, exploImage) {
    this.xPos = x;
    this.yPos = y;
    this.canImage = canImage;
    this.exploImage = exploImage;
    this.speed = GAME_CONFIG.TOXIC_BULLET_SPEED;
    this.size = GAME_CONFIG.BULLET_SIZE;
    this.creationTime = millis();
    this.lifeTime = 3000; // 3 seconds flying
    this.hasExploded = false;
    this.explosionSize = GAME_CONFIG.TOXIC_GAS_EXPLOSION_SIZE;
    this.explosionStartTime = 0;
    this.explosionDuration = 2000; // 2 seconds linger
    this.damageTickInterval = 100;
    this.lastDamageTick = 0;
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
      // Draw canister
      drawSprite(this.canImage, this.xPos, this.yPos, this.size);
    } else {
      // Draw gas cloud
      drawSprite(this.exploImage, this.xPos, this.yPos, this.explosionSize);
    }
  }

  shouldExplode() {
    return (
      (millis() - this.creationTime >= this.lifeTime || this.isOffScreen()) &&
      !this.hasExploded
    );
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

  isOffScreen() {
    return (
      this.xPos < -100 ||
      this.xPos > width + 100 ||
      this.yPos < -100 ||
      this.yPos > height + 100
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
    drawSprite(this.image, this.xPos, this.yPos, this.size);
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
    return Bullet.rectsOverlap(this, player);
  }
}

class DarkMultiBullet {
  constructor(x, y, targetX, targetY, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = 12; // Extremely fast
    this.size = GAME_CONFIG.BULLET_SIZE / 2;
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
    // Draw 3 lasers: center, left, and right, using perpendicular offset
    let spacing = (this.spacing + 6) * 1.5; // Increase offset for more separation
    let perpX = -this.directionY;
    let perpY = this.directionX;
    // Center laser
    drawSprite(this.image, this.xPos, this.yPos, this.size);
    // Left laser
    drawSprite(
      this.image,
      this.xPos + perpX * spacing,
      this.yPos + perpY * spacing,
      this.size
    );
    // Right laser
    drawSprite(
      this.image,
      this.xPos - perpX * spacing,
      this.yPos - perpY * spacing,
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
    // Calculate perpendicular offset for left/right lasers
    let spacing = (this.spacing + 6) * 1.5;
    let perpX = -this.directionY;
    let perpY = this.directionX;
    // Center laser
    let centerRect = { xPos: this.xPos, yPos: this.yPos, size: this.size };
    // Left laser
    let leftRect = {
      xPos: this.xPos + perpX * spacing,
      yPos: this.yPos + perpY * spacing,
      size: this.size,
    };
    // Right laser
    let rightRect = {
      xPos: this.xPos - perpX * spacing,
      yPos: this.yPos - perpY * spacing,
      size: this.size,
    };
    return (
      Bullet.rectsOverlap(centerRect, player) ||
      Bullet.rectsOverlap(leftRect, player) ||
      Bullet.rectsOverlap(rightRect, player)
    );
  }
}
