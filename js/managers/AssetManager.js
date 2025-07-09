// ===========================
// PERMISSION REQUIRED TO MODIFY BELOW
// This file controls asset loading/management logic.
// Consequences: Changing this may break game visuals or sounds.
// All changes must be reviewed before merging.
// ===========================
class AssetManager {
  constructor() {
    this.images = {};
    this.flameConeGraphic = null;
    this.flameConeFallbackGraphic = null;
  }

  preload() {
    console.log("Loading images...");
    // Helper to get fallback image
    const getFallback = () => {
      if (!this.images.__fallback) {
        let gfx = createGraphics(50, 50);
        gfx.background(255, 0, 0);
        gfx.fill(255);
        gfx.textAlign(CENTER, CENTER);
        gfx.text("?", 25, 25);
        this.images.__fallback = gfx;
      }
      return this.images.__fallback;
    };
    // Helper to load with error handling
    const safeLoad = (key, path) => {
      try {
        if (!path) throw new Error("Image path is undefined");
        this.images[key] = loadImage(path);
      } catch (error) {
        console.warn(
          `Error loading image for key '${key}'. Path: ${
            path || "undefined"
          }. Error: ${error.message}. Using fallback image.`
        );
        this.images[key] = getFallback();
      }
    };
    // Player and UI
    safeLoad("player", IMAGE_PATHS.PLAYER);
    safeLoad("enemy", IMAGE_PATHS.ENEMY);
    safeLoad("iceDrone", IMAGE_PATHS.ICE_DRONE);
    safeLoad("iceSlower", IMAGE_PATHS.ICE_SLOWER);
    safeLoad("iceSpeed", IMAGE_PATHS.ICE_SPEED);
    safeLoad("iceBeam", IMAGE_PATHS.ICE_BEAM);
    safeLoad("bullet", IMAGE_PATHS.BULLET);
    safeLoad("enemyBullet", IMAGE_PATHS.ENEMY_BULLET);
    safeLoad("iceBullet", IMAGE_PATHS.ICE_BULLET);
    safeLoad("iceWave", IMAGE_PATHS.ICE_WAVE);
    safeLoad("iceBeamBullet", IMAGE_PATHS.ICE_BEAM_BULLET);
    safeLoad("angel", IMAGE_PATHS.ANGEL);
    safeLoad("fireUp", IMAGE_PATHS.FIRE_UP);
    safeLoad("fire2", IMAGE_PATHS.FIRE2);
    safeLoad("iceUp", IMAGE_PATHS.ICE_UP);
    safeLoad("ice2", IMAGE_PATHS.ICE2);
    safeLoad("player1", IMAGE_PATHS.PLAYER1);
    safeLoad("repair", IMAGE_PATHS.REPAIR);
    safeLoad("life", IMAGE_PATHS.LIFE);
    safeLoad("flame", IMAGE_PATHS.FLAME);
    safeLoad("iceExplo", IMAGE_PATHS.ICE_EXPLO);
    safeLoad("lazUp", IMAGE_PATHS.LAZ_UP);
    safeLoad("lazBullet", IMAGE_PATHS.LAZ_BULLET);
    safeLoad("scrap", IMAGE_PATHS.SCRAP);
    safeLoad("scrapShip", IMAGE_PATHS.SCRAP_SHIP);
    safeLoad("sawBlade", IMAGE_PATHS.SAW_BLADE);
    safeLoad("shield", IMAGE_PATHS.SHIELD);
    safeLoad("speed", IMAGE_PATHS.SPEED);
    // Fire enemies
    safeLoad("fireDrone", IMAGE_PATHS.FIRE_DRONE);
    safeLoad("fireSpeed", IMAGE_PATHS.FIRE_SPEED);
    safeLoad("fireBullet", IMAGE_PATHS.FIRE_BULLET);
    // Rocket enemies
    safeLoad("rocket", IMAGE_PATHS.ROCKET);
    safeLoad("sidewinder", IMAGE_PATHS.SIDEWINDER);
    // Toxic enemies
    safeLoad("toxicDrone", IMAGE_PATHS.TOXIC_DRONE);
    safeLoad("toxicGas", IMAGE_PATHS.TOXIC_GAS);
    safeLoad("toxicBullet", IMAGE_PATHS.TOXIC_BULLET);
    safeLoad("toxicCan", IMAGE_PATHS.TOXIC_CAN);
    safeLoad("toxicExplo", IMAGE_PATHS.TOXIC_EXPLO);
    // Dark enemies
    safeLoad("darkBeamEnemy", IMAGE_PATHS.DARK_BEAM_ENEMY);
    safeLoad("darkDrone", IMAGE_PATHS.DARK_DRONE);
    safeLoad("darkMulti", IMAGE_PATHS.DARK_MULTI);
    safeLoad("darkShield", IMAGE_PATHS.DARK_SHIELD);
    safeLoad("darkBullet", IMAGE_PATHS.DARK_BULLET);
    safeLoad("darkLaser", IMAGE_PATHS.DARK_LASER);
    safeLoad("darkBulletPrimer", IMAGE_PATHS.DARK_BULLET_PRIMER);
    safeLoad("darkhole", IMAGE_PATHS.DARK_HOLE);
    // New enemies
    safeLoad("fire1Rocket", IMAGE_PATHS.FIRE1_ROCKET);
    safeLoad("fire2Drone", IMAGE_PATHS.FIRE2_DRONE);
    safeLoad("fire3Speed", IMAGE_PATHS.FIRE3_SPEED);
    safeLoad("ice1Drone", IMAGE_PATHS.ICE1_DRONE);
    safeLoad("ice2Slower", IMAGE_PATHS.ICE2_SLOWER);
    safeLoad("ice3Speed", IMAGE_PATHS.ICE3_SPEED);
    safeLoad("ice5Beam", IMAGE_PATHS.ICE5_BEAM);
    safeLoad("toxic1Drone", IMAGE_PATHS.TOXIC1_DRONE);
    safeLoad("toxic2Gas", IMAGE_PATHS.TOXIC2_GAS);
    safeLoad("toxic4Tank", IMAGE_PATHS.TOXIC4_TANK);
    // New player bullets
    // New enemy bullets
    safeLoad("darkConnector", IMAGE_PATHS.DARK_CONNECTOR);
    safeLoad("darkLaz", IMAGE_PATHS.DARK_LAZ);
    safeLoad("fireBullet", IMAGE_PATHS.FIRE_BULLET);
    safeLoad("iceBeamBullet", IMAGE_PATHS.ICE_BEAM_BULLET);
    safeLoad("iceWave", IMAGE_PATHS.ICE_WAVE);
    safeLoad("iceBullet", IMAGE_PATHS.ICE_BULLET);
    safeLoad("toxBullet", IMAGE_PATHS.TOX_BULLET);
    safeLoad("toxCan", IMAGE_PATHS.TOX_CAN);
    safeLoad("toxExplo", IMAGE_PATHS.TOX_EXPLO);
    safeLoad("darkPlayer", IMAGE_PATHS.DARK_PLAYER);
    safeLoad("darkPickup", IMAGE_PATHS.DARK_PICKUP);
    safeLoad("darkBeamStart", IMAGE_PATHS.DARK_BEAM_START);
    safeLoad("darkBeamMiddle", IMAGE_PATHS.DARK_BEAM_MIDDLE);
    safeLoad("darkBeamEnd", IMAGE_PATHS.DARK_BEAM_END);
    console.log("All images loaded successfully");
  }

  getImage(key) {
    try {
      if (this.images[key]) {
        return this.images[key];
      } else {
        let imagePath =
          IMAGE_PATHS && IMAGE_PATHS[key.toUpperCase()]
            ? IMAGE_PATHS[key.toUpperCase()]
            : undefined;
        if (!imagePath) {
          // Try camelCase to UPPER_SNAKE_CASE conversion
          const snakeKey = key.replace(/([A-Z])/g, "_$1").toUpperCase();
          imagePath =
            IMAGE_PATHS && IMAGE_PATHS[snakeKey]
              ? IMAGE_PATHS[snakeKey]
              : undefined;
        }
        console.warn(
          `Image for key '${key}' not found. Path: ${
            imagePath || "unknown"
          } Returning fallback image.`
        );
        if (!this.images.__fallback) {
          // Create a simple fallback image if not already present
          let gfx = createGraphics(50, 50);
          gfx.background(255, 0, 0);
          gfx.fill(255);
          gfx.textAlign(CENTER, CENTER);
          gfx.text("?", 25, 25);
          this.images.__fallback = gfx;
        }
        return this.images.__fallback;
      }
    } catch (error) {
      let imagePath =
        IMAGE_PATHS && IMAGE_PATHS[key.toUpperCase()]
          ? IMAGE_PATHS[key.toUpperCase()]
          : undefined;
      if (!imagePath) {
        const snakeKey = key.replace(/([A-Z])/g, "_$1").toUpperCase();
        imagePath =
          IMAGE_PATHS && IMAGE_PATHS[snakeKey]
            ? IMAGE_PATHS[snakeKey]
            : undefined;
      }
      console.warn(
        `Error retrieving image for key '${key}'. Path: ${
          imagePath || "unknown"
        }. Error: ${error.message}. Returning fallback image.`
      );
      if (!this.images.__fallback) {
        let gfx = createGraphics(50, 50);
        gfx.background(255, 0, 0);
        gfx.fill(255);
        gfx.textAlign(CENTER, CENTER);
        gfx.text("?", 25, 25);
        this.images.__fallback = gfx;
      }
      return this.images.__fallback;
    }
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

  getImageForType(type) {
    // Map logical types to image keys, supporting both kebab-case and camelCase
    const typeMap = {
      // Player
      player: "player",
      player1: "player1",
      angel: "angel",
      fire2: "fire2",
      ice2: "ice2",
      scrapShip: "scrapShip",
      "dark-player": "darkPlayer",
      // Enemies
      enemy: "enemy",
      iceDrone: "iceDrone",
      iceSlower: "iceSlower",
      iceSpeed: "iceSpeed",
      iceBeam: "iceBeam",
      fireDrone: "fireDrone",
      fireSpeed: "fireSpeed",
      rocket: "rocket",
      toxicDrone: "toxicDrone",
      toxicGas: "toxicGas",
      darkDrone: "darkDrone",
      darkBeam: "darkBeam",
      darkMulti: "darkMulti",
      darkShield: "darkShield",
      // Bullets
      bullet: "bullet",
      enemyBullet: "enemyBullet",
      iceBullet: "iceBullet",
      iceWave: "iceWave",
      iceBeamBullet: "iceBeamBullet",
      flame: "flame",
      iceExplo: "iceExplo",
      lazBullet: "lazBullet",
      sawBlade: "sawBlade",
      fireBullet: "fireBullet",
      sidewinder: "sidewinder",
      toxicBullet: "toxicBullet",
      toxicCan: "toxicCan",
      toxicExplo: "toxicExplo",
      darkBullet: "darkBullet",
      darkLaser: "darkLaser",
      darkBulletPrimer: "darkBulletPrimer",
      darkhole: "darkhole",
      // Pickups (support both kebab-case and camelCase)
      fireUp: "fireUp",
      "fire-up": "fireUp",
      iceUp: "iceUp",
      "ice-up": "iceUp",
      lazUp: "lazUp",
      "laz-up": "lazUp",
      scrap: "scrap",
      life: "life",
      repair: "repair",
      shield: "shield",
      speed: "speed",
      dark: "darkPickup",
      "dark-pickup": "darkPickup",
      // New enemies
      darkBeamEnemy: "darkBeamEnemy",
      fire1Rocket: "fire1Rocket",
      fire2Drone: "fire2Drone",
      fire3Speed: "fire3Speed",
      ice1Drone: "ice1Drone",
      ice2Slower: "ice2Slower",
      ice3Speed: "ice3Speed",
      ice5Beam: "ice5Beam",
      toxic1Drone: "toxic1Drone",
      toxic2Gas: "toxic2Gas",
      toxic4Tank: "toxic4Tank",
      // New player bullets
      // New enemy bullets
      darkConnector: "darkConnector",
      darkLaz: "darkLaz",
      fireBullet: "fireBullet",
      iceBeamBullet: "iceBeamBullet",
      iceWave: "iceWave",
      iceBullet: "iceBullet",
      toxBullet: "toxBullet",
      toxCan: "toxCan",
      toxExplo: "toxExplo",
    };
    const key =
      typeMap[type] || typeMap[type.replace(/-/g, "").toLowerCase()] || type;
    return this.getImage(key);
  }
}
