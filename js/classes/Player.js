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
    let dx = mouseX - (this.xPos + this.size / 2);
    let dy = mouseY - (this.yPos + this.size / 2);
    // Add PI/2 to offset the initial upward orientation
    this.rotation = atan2(dy, dx) + PI / 2;
  }

  draw() {
    push(); // Save the current transformation state
    translate(this.xPos + this.size / 2, this.yPos + this.size / 2); // Move to center of player
    rotate(this.rotation); // Rotate
    image(this.image, -this.size / 2, -this.size / 2, this.size, this.size); // Draw centered
    pop(); // Restore the previous transformation state
  }

  getNosePosition() {
    // Calculate the actual nose position after rotation
    let noseX = this.xPos; // Left edge of ship
    let noseY = this.yPos; // Top of ship
    return { x: noseX, y: noseY };
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

  getBulletSpawnPosition() {
    return {
      x: this.xPos + this.size / 2 + 25 * cos(this.rotation),
      y: this.yPos + this.size / 2 + 25 * sin(this.rotation),
    };
  }

  takeDamage(damage) {
    // This method is called by enemies to damage the player
    // The actual damage handling is done in GameManager
    // This method exists for compatibility with enemy damage calls
    console.log("Player taking damage:", damage);
  }
}
