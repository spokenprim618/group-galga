function drawSprite(img, x, y, size, rotation = 0) {
  push();
  translate(x + size / 2, y + size / 2);
  if (rotation) rotate(rotation);
  image(img, -size / 2, -size / 2, size, size);
  pop();
}

class Pickup {
  constructor(x, y, type, image) {
    this.xPos = x;
    this.yPos = y;
    this.type = type; // 'fire-up', 'ice-up', 'life', 'repair', 'laz-up', 'scrap'
    // Use dark pickup image for 'dark' type
    if (type === "dark" && typeof assetManager !== "undefined") {
      this.image = assetManager.getImageForType("dark-pickup");
    } else {
      this.image = image;
    }
    this.size = GAME_CONFIG.PICKUP_SIZE;
    this.speed = GAME_CONFIG.PICKUP_SPEED;
  }

  move() {
    this.yPos += this.speed;
  }

  draw() {
    drawSprite(this.image, this.xPos, this.yPos, this.size);
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

  static getPickupTypes({ includeLife = true } = {}) {
    let types = [];
    types.push("fire-up", "ice-up", "laz-up", "scrap", "dark");
    if (includeLife) types.push("life");
    types.push("repair", "shield", "speed");
    return types;
  }

  static getPickupTypesWithoutLife() {
    return this.getPickupTypes({ includeLife: false });
  }
}
