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

class DarkPrimerObject {
  constructor(x, y, angle, image, darkHoleImage, timer = 2000) {
    this.xPos = x;
    this.yPos = y;
    this.angle = angle;
    this.image = image;
    this.size = GAME_CONFIG.BULLET_SIZE;
    this.speed = GAME_CONFIG.DARK_BULLET_SPEED;
    this.creationTime = millis();
    this.timer = timer; // ms until transition
    this.darkHoleImage = darkHoleImage;
    this.hasTransformed = false;
    this.shouldRemove = false;
  }

  move() {
    this.xPos += Math.cos(this.angle - Math.PI / 2) * this.speed;
    this.yPos += Math.sin(this.angle - Math.PI / 2) * this.speed;
  }

  draw() {
    drawSprite(this.image, this.xPos, this.yPos, this.size);
  }

  update(gameManager) {
    this.move();
    this.draw();
    if (!this.hasTransformed && millis() - this.creationTime >= this.timer) {
      this.transformToDarkHole(gameManager);
    }
  }

  transformToDarkHole(gameManager) {
    this.hasTransformed = true;
    // Add a new DarkHoleObject at this position
    gameManager.spawnDarkHole(this.xPos, this.yPos, this.darkHoleImage);
    // Mark for removal
    this.shouldRemove = true;
  }

  isOffScreen() {
    return (
      this.xPos < -50 ||
      this.xPos > width + 50 ||
      this.yPos < -50 ||
      this.yPos > height + 50
    );
  }
}

class DarkHoleObject {
  constructor(
    x,
    y,
    image,
    pullRadius = 400, // Increased range
    pullStrength = 0.8,
    removeRadius = 30,
    duration = 2500
  ) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.size = GAME_CONFIG.BULLET_SIZE * 2;
    this.pullRadius = pullRadius;
    this.pullStrength = pullStrength;
    this.removeRadius = removeRadius;
    this.shouldRemove = false;
    this.creationTime = millis();
    this.duration = duration;
  }

  draw() {
    drawSprite(this.image, this.xPos, this.yPos, this.size);
  }

  update(gameManager) {
    this.pullEntities(gameManager);
    this.removeEntitiesAtCenter(gameManager);
    this.draw();
    if (millis() - this.creationTime >= this.duration) {
      this.shouldRemove = true;
    }
  }

  pullEntities(gameManager) {
    // Pull all enemies
    for (let enemy of gameManager.groupAlien) {
      this.pullToCenter(enemy);
    }
    // Pull all bullets
    for (let bullet of gameManager.groupEnemyBullet) {
      this.pullToCenter(bullet);
    }
    for (let bullet of gameManager.groupBullet) {
      this.pullToCenter(bullet);
    }
    for (let bullet of gameManager.groupIceBullet) {
      this.pullToCenter(bullet);
    }
  }

  pullToCenter(entity) {
    if (!entity) return;
    let centerX = this.xPos + this.size / 2;
    let centerY = this.yPos + this.size / 2;
    let entityX = entity.xPos + (entity.size ? entity.size / 2 : 0);
    let entityY = entity.yPos + (entity.size ? entity.size / 2 : 0);
    let dx = centerX - entityX;
    let dy = centerY - entityY;
    let dist = Math.sqrt(dx * dx + dy * dy);
    // Detect if entity is a bullet (has move and directionX, directionY, speed, but not an enemy type)
    const isBullet =
      "move" in entity &&
      "directionX" in entity &&
      "directionY" in entity &&
      "speed" in entity &&
      !("type" in entity); // crude check: enemies have 'type', bullets don't

    if (dist < this.pullRadius && dist > 1) {
      if (isBullet) {
        // Handle bullets: store original trajectory, then set direction toward center
        if (!entity.wasPulledByDarkHole) {
          if (entity._darkHoleOriginalDirectionX === undefined)
            entity._darkHoleOriginalDirectionX = entity.directionX;
          if (entity._darkHoleOriginalDirectionY === undefined)
            entity._darkHoleOriginalDirectionY = entity.directionY;
          if (entity._darkHoleOriginalSpeed === undefined)
            entity._darkHoleOriginalSpeed = entity.speed;
          entity.wasPulledByDarkHole = true;
        }
        // Set direction toward center (so bullet spirals in)
        entity.directionX = dx / dist;
        entity.directionY = dy / dist;
        // Optionally, increase speed as it gets closer
        entity.speed =
          this.pullStrength * Math.pow(1 - dist / this.pullRadius, 2) * 8 +
          (entity._darkHoleOriginalSpeed || 0);
      } else {
        // Non-bullets (enemies): store and zero direction
        if (!entity.wasPulledByDarkHole) {
          if (
            "directionX" in entity &&
            entity._darkHoleOriginalDirectionX === undefined
          )
            entity._darkHoleOriginalDirectionX = entity.directionX;
          if (
            "directionY" in entity &&
            entity._darkHoleOriginalDirectionY === undefined
          )
            entity._darkHoleOriginalDirectionY = entity.directionY;
          if ("speed" in entity && entity._darkHoleOriginalSpeed === undefined)
            entity._darkHoleOriginalSpeed = entity.speed;
          entity.wasPulledByDarkHole = true;
        }
        // Overwrite movement: force entity to move straight toward center
        let pull =
          this.pullStrength * Math.pow(1 - dist / this.pullRadius, 2) * 8;
        let moveX = (dx / dist) * pull;
        let moveY = (dy / dist) * pull;
        entity.xPos += moveX;
        entity.yPos += moveY;
        if ("directionX" in entity) entity.directionX = 0;
        if ("directionY" in entity) entity.directionY = 0;
      }
    } else if (entity.wasPulledByDarkHole) {
      // Restore persistent original movement if it was stored, then clear flag
      if (entity._darkHoleOriginalDirectionX !== undefined)
        entity.directionX = entity._darkHoleOriginalDirectionX;
      if (entity._darkHoleOriginalDirectionY !== undefined)
        entity.directionY = entity._darkHoleOriginalDirectionY;
      if (entity._darkHoleOriginalSpeed !== undefined)
        entity.speed = entity._darkHoleOriginalSpeed;
      entity.wasPulledByDarkHole = false;
    }
  }

  removeEntitiesAtCenter(gameManager) {
    // Remove enemies at center
    for (let i = gameManager.groupAlien.length - 1; i >= 0; i--) {
      let enemy = gameManager.groupAlien[i];
      if (this.isAtCenter(enemy)) {
        gameManager.groupAlien.splice(i, 1);
      }
    }
    // Remove bullets at center
    for (let groupName of [
      "groupEnemyBullet",
      "groupBullet",
      "groupIceBullet",
    ]) {
      let group = gameManager[groupName];
      for (let i = group.length - 1; i >= 0; i--) {
        let bullet = group[i];
        if (this.isAtCenter(bullet)) {
          group.splice(i, 1);
        }
      }
    }
  }

  isAtCenter(entity) {
    if (!entity) return false;
    let centerX = this.xPos + this.size / 2;
    let centerY = this.yPos + this.size / 2;
    let entityX = entity.xPos + (entity.size ? entity.size / 2 : 0);
    let entityY = entity.yPos + (entity.size ? entity.size / 2 : 0);
    let dx = centerX - entityX;
    let dy = centerY - entityY;
    let dist = Math.sqrt(dx * dx + dy * dy);
    return dist < this.removeRadius;
  }
}

class Beam {
  constructor(
    originX,
    originY,
    angle,
    length,
    width,
    middleImage = null,
    damage,
    range = 300,
    damageInterval = 1000,
    startImage = null,
    endImage = null
  ) {
    this.originX = originX;
    this.originY = originY;
    this.angle = angle;
    this.length = length;
    this.width = width;
    this.middleImage = middleImage;
    this.startImage = startImage;
    this.endImage = endImage;
    this.damage = damage;
    this.range = range;
    this.damageInterval = damageInterval;
    this.lastDamageTime = 0;
    this.active = false;
  }

  updateBeam(targetX, targetY, debugForceActive = false) {
    // 1. Always update originX and originY dynamically (should be set by the enemy before calling this)
    // 2. Add a toggle to force beam active for debugging
    if (debugForceActive) {
      this.active = true;
    } else {
      const dx = targetX - this.originX;
      const dy = targetY - this.originY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      this.active = distance <= this.length;
    }
    // 3. Add detailed debug logs for all relevant values
    const dx = targetX - this.originX;
    const dy = targetY - this.originY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.angle = Math.atan2(dy, dx);
    // Damage logic: check if player is within beam and apply damage
    if (
      this.active &&
      typeof gameManager !== "undefined" &&
      gameManager.player
    ) {
      const player = gameManager.player;
      if (this.isHittingPlayer(player)) {
        const now = millis();
        if (!this.lastDamageTime || now - this.lastDamageTime >= 1000) {
          console.log("Beam geometric collision detected!");
          player.takeDamage
            ? player.takeDamage(10, "dark")
            : (player.health -= 10);
          this.lastDamageTime = now;
        }
      }
    }
    console.log(
      "[BEAM DEBUG]",
      "active:",
      this.active,
      "angle:",
      this.angle.toFixed(2),
      "distance:",
      distance.toFixed(2),
      "range:",
      this.range,
      "originX:",
      this.originX,
      "originY:",
      this.originY,
      "targetX:",
      targetX,
      "targetY:",
      targetY
    );
    // 4. Check for coordinate space mismatch (warn if distance is suspiciously large)
    if (distance > this.range * 2) {
      console.warn(
        "[BEAM DEBUG] Possible coordinate space mismatch: distance much greater than range."
      );
    }
    // 5. Add a visual indicator at the origin and target for visual debugging (if p5.js is available)
    if (typeof ellipse === "function") {
      push();
      stroke("red");
      fill("red");
      ellipse(this.originX, this.originY, 8, 8); // origin
      stroke("blue");
      fill("blue");
      ellipse(targetX, targetY, 8, 8); // target
      pop();
    }
  }

  isHittingPlayer(player) {
    if (!player) return false;
    // Beam start and angle
    const beamStartX = this.originX;
    const beamStartY = this.originY;
    const beamAngle = this.angle;
    // Player center
    const playerCenterX = player.xPos + player.size / 2;
    const playerCenterY = player.yPos + player.size / 2;
    // Distance from beam start to player
    const distance = dist(beamStartX, beamStartY, playerCenterX, playerCenterY);
    // Check if player is within beam length
    if (distance <= this.length) {
      // Angle from beam start to player
      const angleToPlayer = Math.atan2(
        playerCenterY - beamStartY,
        playerCenterX - beamStartX
      );
      let angleDiff = Math.abs(angleToPlayer - beamAngle);
      // Normalize angle difference
      if (angleDiff > Math.PI) {
        angleDiff = Math.PI * 2 - angleDiff;
      }
      // Beam width in radians
      const minDistance = Math.max(distance, 1);
      const beamWidthRadians = Math.atan2(this.width / 2, minDistance);
      return angleDiff <= beamWidthRadians;
    }
    return false;
  }

  drawBeam() {
    if (!this.active) return;
    // Always log image dimensions for debugging
    console.log("[BEAM IMAGE WIDTHS]", {
      startW: this.startImage?.width,
      startH: this.startImage?.height,
      middleW: this.middleImage?.width,
      middleH: this.middleImage?.height,
      endW: this.endImage?.width,
      endH: this.endImage?.height,
      beamLen: this.length,
    });
    const beamStartX = this.originX;
    const beamStartY = this.originY;
    const beamLen = this.length;
    const startW = 10; // updated calibrated width
    const endW = 100; // new calibrated width
    const middleW = 30; // updated calibrated width

    // Draw even if start+end > beamLen (they will overlap)
    const gap = 10; // leave beam slightly short
    const rawUsableLen = beamLen - startW - endW - gap;
    const usableLen = Math.max(0, rawUsableLen);
    const numFullTiles = Math.floor(usableLen / middleW);
    const leftover = usableLen - numFullTiles * middleW;

    push();
    translate(beamStartX, beamStartY);
    rotate(this.angle);
    imageMode(CORNER);

    let x = 0;

    // Start image
    if (this.startImage && startW > 0) {
      image(this.startImage, x, -this.width / 2, startW, this.width);
      x += startW;
    }

    // Middle tiles
    for (let i = 0; i < numFullTiles; i++) {
      image(this.middleImage, x, -this.width / 2, middleW, this.width);
      x += middleW;
    }

    // Leftover partial tile
    if (leftover > 0 && this.middleImage) {
      image(
        this.middleImage,
        x,
        -this.width / 2,
        leftover,
        this.width,
        0,
        0,
        leftover,
        this.middleImage.height
      );
      x += leftover;
    }

    // End image, shifted back by gap
    if (this.endImage && endW > 0) {
      image(
        this.endImage,
        beamLen - endW - gap,
        -this.width / 2,
        endW,
        this.width
      );
    }

    pop();
  }
}
