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
    this.image = image;
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

  static getPickupTypes({ includeLife = true, doubleHole } = {}) {
    // Auto-detect doubleHole if not provided
    if (doubleHole === undefined) {
      doubleHole =
        typeof gameManager !== "undefined" &&
        gameManager.isDarkRound &&
        gameManager.isDarkRound();
    }
    let types = [];
    if (doubleHole) {
      types.push("hole", "hole"); // double chance in dark rounds
    } else {
      types.push("hole");
    }
    types.push("fire-up", "ice-up", "laz-up", "scrap");
    if (includeLife) types.push("life");
    types.push("repair", "shield", "speed");
    return types;
  }

  static getPickupTypesWithoutLife(doubleHole) {
    return this.getPickupTypes({ includeLife: false, doubleHole });
  }
}
