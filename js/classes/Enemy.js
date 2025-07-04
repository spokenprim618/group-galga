class Alien {
  constructor(x, y, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = GAME_CONFIG.ENEMY_SPEED;
    this.size = GAME_CONFIG.ENEMY_SIZE;
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
