class Player {
  constructor(x, y, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.size = GAME_CONFIG.PLAYER_SIZE;
    this.rotation = 0;
  }

  updateRotation() {
    // Calculate angle between center of ship and mouse
    let dx = mouseX - (this.xPos + this.size / 2)-26;
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

  takeDamage(damage) {
    // This method is called by enemies to damage the player
    // The actual damage handling is done in GameManager
    // This method exists for compatibility with enemy damage calls
    console.log("Player taking damage:", damage);
  }
}

function drawSprite(img, x, y, size, rotation = 0) {
  push();
  translate(x + size / 2, y + size / 2);
  if (rotation) rotate(rotation);
  image(img, -size / 2, -size / 2, size, size);
  pop();
}
