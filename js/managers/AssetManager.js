class AssetManager {
  constructor() {
    this.images = {};
    this.flameConeGraphic = null;
    this.flameConeFallbackGraphic = null;
  }

  preload() {
    console.log("Loading images...");
    try {
      // Load all images
      this.images.player = loadImage(IMAGE_PATHS.PLAYER);
      this.images.enemy = loadImage(IMAGE_PATHS.ENEMY);
      this.images.iceDrone = loadImage(IMAGE_PATHS.ICE_DRONE);
      this.images.iceSlower = loadImage(IMAGE_PATHS.ICE_SLOWER);
      this.images.iceSpeed = loadImage(IMAGE_PATHS.ICE_SPEED);
      this.images.iceBeam = loadImage(IMAGE_PATHS.ICE_BEAM);
      this.images.bullet = loadImage(IMAGE_PATHS.BULLET);
      this.images.enemyBullet = loadImage(IMAGE_PATHS.ENEMY_BULLET);
      this.images.iceBullet = loadImage(IMAGE_PATHS.ICE_BULLET);
      this.images.iceWave = loadImage(IMAGE_PATHS.ICE_WAVE);
      this.images.iceBeamBullet = loadImage(IMAGE_PATHS.ICE_BEAM_BULLET);
      this.images.angel = loadImage(IMAGE_PATHS.ANGEL);
      this.images.fireUp = loadImage(IMAGE_PATHS.FIRE_UP);
      this.images.fire2 = loadImage(IMAGE_PATHS.FIRE2);
      this.images.iceUp = loadImage(IMAGE_PATHS.ICE_UP);
      this.images.ice2 = loadImage(IMAGE_PATHS.ICE2);
      this.images.player1 = loadImage(IMAGE_PATHS.PLAYER1);
      this.images.repair = loadImage(IMAGE_PATHS.REPAIR);
      this.images.life = loadImage(IMAGE_PATHS.LIFE);
      this.images.flame = loadImage(IMAGE_PATHS.FLAME);
      this.images.iceExplo = loadImage(IMAGE_PATHS.ICE_EXPLO);
      this.images.lazUp = loadImage(IMAGE_PATHS.LAZ_UP);
      this.images.lazBullet = loadImage(IMAGE_PATHS.LAZ_BULLET);
      this.images.scrap = loadImage(IMAGE_PATHS.SCRAP);
      this.images.scrapShip = loadImage(IMAGE_PATHS.SCRAP_SHIP);
      this.images.sawBlade = loadImage(IMAGE_PATHS.SAW_BLADE);
      this.images.shield = loadImage(IMAGE_PATHS.SHIELD);
      this.images.speed = loadImage(IMAGE_PATHS.SPEED);
      console.log("All images loaded successfully");
    } catch (error) {
      console.error("Error loading images:", error);
    }
  }

  getImage(name) {
    if (!this.images[name]) {
      console.warn(`Image '${name}' not found in AssetManager`);
      return null;
    }
    return this.images[name];
  }

  createFlameConeGraphics() {
    // Create pre-rendered flame cone graphic
    this.flameConeGraphic = createGraphics(120, 100);
    this.flameConeGraphic.imageMode(CENTER);
    this.flameConeGraphic.translate(60, 90); // Center the cone

    // Draw flame cone pattern
    this.drawFlameConeToBuffer(this.flameConeGraphic, 0, 0, 4, true);

    // Create pre-rendered fallback cone graphic
    this.flameConeFallbackGraphic = createGraphics(120, 100);
    this.flameConeFallbackGraphic.imageMode(CENTER);
    this.flameConeFallbackGraphic.translate(60, 90); // Center the cone

    // Draw fallback cone pattern
    this.drawFlameConeToBuffer(this.flameConeFallbackGraphic, 0, 0, 4, false);
  }

  drawFlameConeToBuffer(g, x, y, layers, useImage) {
    let flameSpacing = 15; // horizontal spacing between flames
    let layerSpacing = 20; // vertical spacing between rows

    for (let i = 0; i < layers; i++) {
      let numFlames = 1 + i; // 1 → 2 → 3 → 4 ...
      for (let j = 0; j < numFlames; j++) {
        // Center flames
        let offsetX = (j - (numFlames - 1) / 2) * flameSpacing;
        let offsetY = -i * layerSpacing;

        if (useImage && this.images.flame && this.images.flame.width) {
          // Use flame image
          g.image(this.images.flame, x + offsetX, y + offsetY, 20, 20);
        } else {
          // Use colored rectangle
          g.fill(255, 100, 0, 200); // Orange color for flame
          g.rect(x + offsetX - 10, y + offsetY - 10, 20, 20);
        }
      }
    }
  }

  getFlameConeGraphic() {
    return this.flameConeGraphic;
  }

  getFlameConeFallbackGraphic() {
    return this.flameConeFallbackGraphic;
  }

  isFlameImageLoaded() {
    return this.images.flame && this.images.flame.width;
  }
}
