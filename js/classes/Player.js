// === IMPORTANT: DO NOT CHANGE THIS ROTATION/HEAD LOGIC ===
  // This is the optimized, proven way to handle ship rotation and firing direction for this game.
  // Any attempts to "simplify" or "refactor" this logic have historically introduced bugs,
  // such as bullets/flames not being visually stuck to the ship's nose or being offset.
  // Always use this approach for updateRotation and related math.
  // If you think you need to change this, STOP and consult with the project owner first.

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
    let dx = mouseX - (this.xPos + this.size / 2) - 26;
    let dy = mouseY - (this.yPos + this.size / 2);
    // Restore +PI/2 offset so nose points up if sprite is oriented that way
    this.rotation = atan2(dy, dx) + PI / 2;
  }

  draw() {
    // Pass the top-left position without adding size/2 here
    drawSprite(this.image, this.xPos, this.yPos, this.size, this.rotation);
  }

  getBulletSpawnPosition() {
    // Remove extra +PI/2, use this.rotation directly
    let spawnX = this.xPos + this.size / 2 + 25 * cos(this.rotation);
    let spawnY = this.yPos + this.size / 2 + 25 * sin(this.rotation);
    return { x: spawnX, y: spawnY };
  }

  getFrontPosition() {
    // This method is currently unused or approximate,
    // consider updating it to return rotated front if needed
    let frontX = this.xPos;
    let frontY = this.yPos;
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

  takeDamage(damage) {
    console.log("Player taking damage:", damage);
  }
}
