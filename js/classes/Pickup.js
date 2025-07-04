class Pickup {
  constructor(x, y, type, image) {
    this.xPos = x;
    this.yPos = y;
    this.type = type; // 'fire-up', 'ice-up', 'life', 'repair', 'laz-up', 'scrap'
    this.image = image;
    this.size = GAME_CONFIG.PICKUP_SIZE;
    this.speed = GAME_CONFIG.PICKUP_SPEED;
  }

  move() {
    this.yPos += this.speed;
  }

  draw() {
    image(this.image, this.xPos, this.yPos, this.size, this.size);
  }

  isOffScreen() {
    return this.yPos > height + 50;
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

  static getPickupTypes() {
    return ["fire-up", "ice-up", "laz-up", "scrap", "life", "repair"];
  }

  static getPickupTypesWithoutLife() {
    return ["fire-up", "ice-up", "laz-up", "scrap", "repair"];
  }
}
