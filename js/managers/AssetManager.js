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

      // Fire enemies
      this.images.fireDrone = loadImage(IMAGE_PATHS.FIRE_DRONE);
      this.images.fireSpeed = loadImage(IMAGE_PATHS.FIRE_SPEED);
      this.images.fireBullet = loadImage(IMAGE_PATHS.FIRE_BULLET);

      // Rocket enemies
      this.images.rocket = loadImage(IMAGE_PATHS.ROCKET);
      this.images.sidewinder = loadImage(IMAGE_PATHS.SIDEWINDER);

      // Toxic enemies
      this.images.toxicDrone = loadImage(IMAGE_PATHS.TOXIC_DRONE);
      this.images.toxicGas = loadImage(IMAGE_PATHS.TOXIC_GAS);
      this.images.toxicBullet = loadImage(IMAGE_PATHS.TOXIC_BULLET);
      this.images.toxicCan = loadImage(IMAGE_PATHS.TOXIC_CAN);
      this.images.toxicExplo = loadImage(IMAGE_PATHS.TOXIC_EXPLO);

      // Dark enemies
      this.images.darkDrone = loadImage(IMAGE_PATHS.DARK_DRONE);
      this.images.darkBeam = loadImage(IMAGE_PATHS.DARK_BEAM);
      this.images.darkMulti = loadImage(IMAGE_PATHS.DARK_MULTI);
      this.images.darkShield = loadImage(IMAGE_PATHS.DARK_SHIELD);
      this.images.darkBullet = loadImage(IMAGE_PATHS.DARK_BULLET);
      this.images.darkLaser = loadImage(IMAGE_PATHS.DARK_LASER);
      this.images.darkBeamBullet = loadImage(IMAGE_PATHS.DARK_BEAM_BULLET);

      // New enemies
      this.images.dark1Beam = loadImage(IMAGE_PATHS.DARK1_BEAM);
      this.images.dark2Shield = loadImage(IMAGE_PATHS.DARK2_SHIELD);
      this.images.dark3Tank = loadImage(IMAGE_PATHS.DARK3_TANK);
      this.images.dark4Multi = loadImage(IMAGE_PATHS.DARK4_MULTI);
      this.images.dark5Drone = loadImage(IMAGE_PATHS.DARK5_DRONE);
      this.images.fire1Rocket = loadImage(IMAGE_PATHS.FIRE1_ROCKET);
      this.images.fire2Drone = loadImage(IMAGE_PATHS.FIRE2_DRONE);
      this.images.fire3Speed = loadImage(IMAGE_PATHS.FIRE3_SPEED);
      this.images.ice1Drone = loadImage(IMAGE_PATHS.ICE1_DRONE);
      this.images.ice2Slower = loadImage(IMAGE_PATHS.ICE2_SLOWER);
      this.images.ice3Speed = loadImage(IMAGE_PATHS.ICE3_SPEED);
      this.images.ice5Beam = loadImage(IMAGE_PATHS.ICE5_BEAM);
      this.images.toxic1Drone = loadImage(IMAGE_PATHS.TOXIC1_DRONE);
      this.images.toxic2Gas = loadImage(IMAGE_PATHS.TOXIC2_GAS);
      this.images.toxic4Tank = loadImage(IMAGE_PATHS.TOXIC4_TANK);
      // New player bullets
      this.images.blackBullet = loadImage(IMAGE_PATHS.BLACK_BULLET);
      this.images.blackhole = loadImage(IMAGE_PATHS.BLACKHOLE);
      // New enemy bullets
      this.images.darkConnector = loadImage(IMAGE_PATHS.DARK_CONNECTOR);
      this.images.darkLaz = loadImage(IMAGE_PATHS.DARK_LAZ);
      this.images.fireBullet = loadImage(IMAGE_PATHS.FIRE_BULLET);
      this.images.iceBeamBullet = loadImage(IMAGE_PATHS.ICE_BEAM_BULLET);
      this.images.iceWave = loadImage(IMAGE_PATHS.ICE_WAVE);
      this.images.iceBullet = loadImage(IMAGE_PATHS.ICE_BULLET);
      this.images.toxBullet = loadImage(IMAGE_PATHS.TOX_BULLET);
      this.images.toxCan = loadImage(IMAGE_PATHS.TOX_CAN);
      this.images.toxExplo = loadImage(IMAGE_PATHS.TOX_EXPLO);

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
      darkBeamBullet: "darkBeamBullet",
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
      // New enemies
      dark1Beam: "dark1Beam",
      dark2Shield: "dark2Shield",
      dark3Tank: "dark3Tank",
      dark4Multi: "dark4Multi",
      dark5Drone: "dark5Drone",
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
      blackBullet: "blackBullet",
      blackhole: "blackhole",
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
