// ===========================
// PERMISSION REQUIRED TO MODIFY BELOW
// This section controls player firing, positioning, and rotation.
// Consequences: Changing this may break bullet alignment, player feel, or introduce subtle bugs.
// All changes must be reviewed before merging.
// ===========================
// === IMPORTANT: DO NOT CHANGE THIS PLAYER FIRING/POSITIONING/ROTATION LOGIC ===
// This is the optimized, proven way to handle bullet and sprite positioning and ship rotation for this game.
// Any attempts to "simplify" or "refactor" this logic have historically introduced bugs.
// Always use this approach for Player. If you think you need to change this, STOP and consult with the project owner first.

class Player {
  constructor(x, y, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.size = GAME_CONFIG.PLAYER_SIZE;
    this.rotation = 0;
    this.resistances = new PlayerResistances();
  }

  updateRotation() {
    // Calculate angle between center of ship and mouse
    let dx = mouseX - (this.xPos + this.size) + 25.5;
    let dy = mouseY - (this.yPos + this.size);
    // Restore +PI/2 offset so nose points up if sprite is oriented that way
    this.rotation = atan2(dy, dx) + PI / 2;
  }

  draw() {
    // do not mess with this drawSprite function
    //DONT MESS WITH THIS DRAWSPRITE FUNCTION
    drawSprite(this.image, this.xPos, this.yPos, this.size, this.rotation);
  }
  //do not mess with this getBulletSpawnPosition function
  getBulletSpawnPosition() {
    // Restore +PI/2 offset so front points up if sprite is oriented that way
    let angle = this.rotation + PI / 2;
    let spawnX = this.xPos + (this.size / 2) * cos(angle);
    let spawnY = this.yPos + (this.size / 2) * sin(angle);
    return { x: spawnX, y: spawnY };
  }
  //do not mess with this getFrontPosition function
  getFrontPosition() {
    // Calculate the actual front position after rotation
    let frontX = this.xPos; // Left edge of ship
    let frontY = this.yPos; // Top of ship
    return { x: frontX, y: frontY };
  }

  move(direction) {
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

  takeDamage(damage, type = "generic") {
    if (this.isInvincible) return;
    // Apply resistance if type is provided
    let resistance = 0;
    if (type && this.resistances) {
      resistance = this.resistances.getResistance(type) || 0;
    }
    const actualDamage = Math.round(damage * (1 - resistance));
    if (typeof gameState !== "undefined") {
      gameState.health = (gameState.health || 100) - actualDamage;
      console.log(
        `Player taking damage: ${actualDamage} (raw: ${damage}, resistance: ${resistance}) New health: ${gameState.health}`
      );
    }
    // Optionally, handle shields, game over, etc. here
  }

  setResistancesForPowerup(type) {
    // Reset all resistances
    this.resistances.setResistance("fire", 0);
    this.resistances.setResistance("ice", 0);
    this.resistances.setResistance("toxic", 0);
    this.resistances.setResistance("dark", 0);
    switch (type) {
      case "fire-up":
        this.resistances.setResistance("fire", 0.8);
        break;
      case "ice-up":
        this.resistances.setResistance("ice", 0.8);
        break;
      case "dark":
        this.resistances.setResistance("dark", 0.8);
        break;
      case "laz-up":
      case "scrap":
        this.resistances.setResistance("fire", 0.3);
        this.resistances.setResistance("ice", 0.3);
        this.resistances.setResistance("toxic", 0.3);
        this.resistances.setResistance("dark", 0.3);
        break;
      case "angel":
        this.resistances.setResistance("fire", 0.9);
        this.resistances.setResistance("ice", 0.9);
        this.resistances.setResistance("toxic", 0.9);
        this.resistances.setResistance("dark", 0.9);
        break;
      default:
        break;
    }
  }
}

function drawSprite(img, x, y, size, rotation = 0) {
  push();
  translate(x + size / 2, y + size / 2);
  if (rotation) rotate(rotation);
  image(img, -size / 2, -size / 2, size, size);
  pop();
}

// ===========================
// PERMISSION REQUIRED TO MODIFY BELOW
// This section controls player resistance and damage application.
// Consequences: Changing this may break all damage calculations, resistances, or game balance.
// All changes must be reviewed before merging.
// ===========================
// Resistance and Damage Application Logic
// This logic is foundational for all damage calculations and game balance.
// ===========================
