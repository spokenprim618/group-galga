// === IMPORTANT: DO NOT CHANGE THIS FIRING, POSITIONING, OR ROTATION LOGIC ===
// This is the optimized, proven way to handle bullet and sprite positioning and ship rotation for this game.
// Any attempts to "simplify" or "refactor" this logic have historically introduced bugs,
// such as bullets/flames not being visually stuck to the ship's nose or being offset.
// Always use this approach for updateRotation, getBulletSpawnPosition, and draw.
// If you think you need to change this, STOP and consult with the project owner first.

class Player {
  constructor(x, y, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.size = GAME_CONFIG.PLAYER_SIZE;
    this.rotation = 0;
    this.resistances = new PlayerResistances();
  }

  setResistancesForPowerup(powerupType) {
    // Reset all resistances first
    this.resistances.setResistance("fire", 0);
    this.resistances.setResistance("ice", 0);
    this.resistances.setResistance("toxic", 0);
    this.resistances.setResistance("dark", 0);
    switch (powerupType) {
      case "fire-up":
        this.resistances.setResistance("fire", 0.5);
        break;
      case "ice-up":
        this.resistances.setResistance("ice", 0.5);
        break;
      case "laz-up":
        this.resistances.setResistance("fire", 0.2);
        this.resistances.setResistance("ice", 0.2);
        this.resistances.setResistance("toxic", 0.2);
        this.resistances.setResistance("dark", 0.2);
        break;
      case "scrap":
        this.resistances.setResistance("fire", 0.1);
        this.resistances.setResistance("ice", 0.1);
        this.resistances.setResistance("toxic", 0.1);
        this.resistances.setResistance("dark", 0.1);
        break;
      case "angel":
        this.resistances.setResistance("fire", 0.7);
        this.resistances.setResistance("ice", 0.7);
        this.resistances.setResistance("toxic", 0.7);
        this.resistances.setResistance("dark", 0.7);
        break;
      case "hole":
        this.resistances.setResistance("dark", 0.5);
        break;
      default:
        // No powerup, all resistances remain 0
        break;
    }
  }

  updateRotation() {
    // Calculate angle between center of ship and mouse
    let dx = mouseX - (this.xPos + this.size / 2) - 26;
    let dy = mouseY - (this.yPos + this.size / 2);
    // Restore +PI/2 offset so nose points up if sprite is oriented that way
    this.rotation = atan2(dy, dx) + PI / 2;
  }

  draw() {
    drawSprite(
      this.image,
      this.xPos + this.size / 2,
      this.yPos + this.size / 2,
      this.size,
      this.rotation
    );
  }

  getBulletSpawnPosition() {
    // Restore +PI/2 offset so front points up if sprite is oriented that way
    let angle = this.rotation + PI / 2;
    let spawnX = this.xPos + this.size / 2 + 25 * cos(angle);
    let spawnY = this.yPos + this.size / 2 + 25 * sin(angle);
    return { x: spawnX, y: spawnY };
  }

  getFrontPosition() {
    // Calculate the actual front position after rotation
    let frontX = this.xPos; // Left edge of ship
    let frontY = this.yPos; // Top of ship
    return { x: frontX, y: frontY };
  }

  move(direction) {
    // Calculate current speed based on speed mode
    let currentSpeed = GAME_CONFIG.PLAYER_SPEED;
    if (gameState && gameState.isSpeedMode) {
      currentSpeed = GAME_CONFIG.PLAYER_SPEED * GAME_CONFIG.PLAYER_SPEED_BOOST;
    }

    switch (direction) {
      case "left":
        this.xPos -= currentSpeed;
        if (this.xPos < 0) this.xPos = 0;
        break;
      case "right":
        this.xPos += currentSpeed;
        if (this.xPos > width - this.size) this.xPos = width - this.size;
        break;
      case "up":
        this.yPos -= currentSpeed;
        if (this.yPos < 0) this.yPos = 0;
        break;
      case "down":
        this.yPos += currentSpeed;
        if (this.yPos > height - this.size) this.yPos = height - this.size;
        break;
    }
  }

  takeDamage(damage, type) {
    const resistance = this.resistances.getResistance(type);
    const reducedDamage = damage * (1 - resistance);
    gameState.health -= reducedDamage;
    console.log(
      `Player taking damage: ${damage} of type ${type}, resistance: ${resistance}, final: ${reducedDamage}`
    );
    console.log(`Player health after damage: ${gameState.health}`);
  }
}

function drawSprite(img, x, y, size, rotation = 0) {
  push();
  translate(x + size / 2, y + size / 2);
  if (rotation) rotate(rotation);
  image(img, -size / 2, -size / 2, size, size);
  pop();
}
