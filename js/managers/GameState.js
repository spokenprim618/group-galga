// ===========================
// PERMISSION REQUIRED TO MODIFY BELOW
// This section controls mode flag/activation logic.
// Consequences: Changing this may break mode exclusivity or allow mode conflicts.
// All changes must be reviewed before merging.
// ===========================
class GameState {
  constructor() {
    this.state = GAME_CONFIG.STATES.TITLE;
    this.health = 100;
    this.shields = 0;
    this.score = 0;
    this.currentRound = 1;
    this.lifePickupHeld = 0;
    this.isInvincible = false;

    // Powerup states
    this.isFireMode = false;
    this.fireModeStartTime = 0;
    this.isIceMode = false;
    this.iceModeStartTime = 0;
    this.isLaserMode = false;
    this.laserModeStartTime = 0;
    this.isAngelMode = false;
    this.angelModeStartTime = 0;
    this.isScrapMode = false;
    this.scrapModeStartTime = 0;
    this.isSpeedMode = false;
    this.speedModeStartTime = 0;
    this.isAnyModeActive = false; // True if any main mode is active

    // Flame thrower state
    this.isFiring = false;
    this.flameStartTime = 0;
    this.currentFrame = 0;
    this.frameRate = GAME_CONFIG.FLAME_FRAME_RATE;
    this.lastFrameTime = 0;
    this.frameCounter = 0;

    // Between rounds state
    this.isBetweenRounds = false;
    this.betweenRoundsStartTime = 0;
    this.betweenRoundsPowerupPauseStart = null;

    // Shooting cooldown
    this.lastShotTime = 0;
  }

  reset() {
    this.state = GAME_CONFIG.STATES.TITLE;
    this.health = 100;
    this.shields = 0;
    this.score = 0;
    this.currentRound = 1;
    this.lifePickupHeld = 0;
    this.isInvincible = false;

    // Reset all powerup states
    this.isFireMode = false;
    this.fireModeStartTime = 0;
    this.isIceMode = false;
    this.iceModeStartTime = 0;
    this.isLaserMode = false;
    this.laserModeStartTime = 0;
    this.isAngelMode = false;
    this.angelModeStartTime = 0;
    this.isScrapMode = false;
    this.scrapModeStartTime = 0;
    this.isSpeedMode = false;
    this.speedModeStartTime = 0;
    this.isAnyModeActive = false;

    // Reset flame state
    this.isFiring = false;
    this.flameStartTime = 0;
    this.currentFrame = 0;
    this.frameCounter = 0;

    // Reset between rounds state
    this.isBetweenRounds = false;
    this.betweenRoundsStartTime = 0;
    this.betweenRoundsPowerupPauseStart = null;

    // Reset shooting cooldown
    this.lastShotTime = 0;
  }

  startGame() {
    this.state = GAME_CONFIG.STATES.PLAYING;
    // Don't call reset() here as it sets state back to TITLE
    this.health = 100;
    this.shields = 0;
    this.score = 0;
    this.currentRound = 1;
    this.lifePickupHeld = 0;
    this.isInvincible = false;

    // Reset all powerup states
    this.isFireMode = false;
    this.fireModeStartTime = 0;
    this.isIceMode = false;
    this.iceModeStartTime = 0;
    this.isLaserMode = false;
    this.laserModeStartTime = 0;
    this.isAngelMode = false;
    this.angelModeStartTime = 0;
    this.isScrapMode = false;
    this.scrapModeStartTime = 0;
    this.isSpeedMode = false;
    this.speedModeStartTime = 0;
    this.isAnyModeActive = false;

    // Reset flame state
    this.isFiring = false;
    this.flameStartTime = 0;
    this.currentFrame = 0;
    this.frameCounter = 0;

    // Reset between rounds state
    this.isBetweenRounds = false;
    this.betweenRoundsStartTime = 0;
    this.betweenRoundsPowerupPauseStart = null;

    // Reset shooting cooldown
    this.lastShotTime = 0;
  }

  gameOver() {
    this.state = GAME_CONFIG.STATES.GAME_OVER;
  }

  activatePowerup(type) {
    // If angel mode is active, ignore all pickups except life and repair
    if (this.isAngelMode && type !== "life" && type !== "repair") {
      return;
    }

    // Only one main mode at a time (fire, ice, laz, scrap, angel)
    const MAIN_MODE_TYPES = ["fire-up", "ice-up", "laz-up", "scrap", "angel"];
    if (MAIN_MODE_TYPES.includes(type)) {
      if (this.isAnyModeActive) return; // Don't switch if a mode is already active
      this.isAnyModeActive = true;
    }
    switch (type) {
      case "fire-up":
        console.log("Fire mode activated");
        this.isFireMode = true;
        this.fireModeStartTime = millis();
        break;
      case "ice-up":
        console.log("Ice mode activated");
        this.isIceMode = true;
        this.iceModeStartTime = millis();
        break;
      case "laz-up":
        console.log("Laser mode activated");
        this.isLaserMode = true;
        this.laserModeStartTime = millis();
        break;
      case "scrap":
        console.log("Scrap mode activated");
        this.isScrapMode = true;
        this.scrapModeStartTime = millis();
        break;
      case "speed":
        console.log("Speed mode activated");
        this.isSpeedMode = true;
        this.speedModeStartTime = millis();
        break;
      case "life":
        if (this.lifePickupHeld < 1) {
          this.lifePickupHeld = 1;
        }
        break;
      case "repair":
        if (this.health < 100) {
          this.health = Math.min(100, this.health + 30);
        }
        break;
      case "shield":
        if (this.shields < 3) {
          this.shields++;
        }
        break;
      case "black_bullet":
        console.log("Black bullet powerup activated (2 uses)");
        this.blackBulletUses = 2;
        break;
    }
    if (typeof gameManager !== "undefined" && gameManager.player) {
      // Remove setResistancesForPowerup for 'hole' or 'dark'
      gameManager.player.setResistancesForPowerup(type);
    }
  }

  deactivateAllPowerups() {
    this.isFireMode = false;
    this.fireModeStartTime = 0;
    this.isIceMode = false;
    this.iceModeStartTime = 0;
    this.isLaserMode = false;
    this.laserModeStartTime = 0;
    this.isScrapMode = false;
    this.scrapModeStartTime = 0;
    this.isSpeedMode = false;
    this.speedModeStartTime = 0;
    this.isAnyModeActive = false;
  }

  checkPowerupExpiration() {
    let currentTime = millis();

    // Check fire mode expiration
    if (
      this.isFireMode &&
      currentTime - this.fireModeStartTime >= GAME_CONFIG.FIRE_MODE_DURATION
    ) {
      this.isFireMode = false;
      this.fireModeStartTime = 0;
    }

    // Check ice mode expiration
    if (
      this.isIceMode &&
      currentTime - this.iceModeStartTime >= GAME_CONFIG.ICE_MODE_DURATION
    ) {
      this.isIceMode = false;
      this.iceModeStartTime = 0;
    }

    // Check laser mode expiration
    if (
      this.isLaserMode &&
      currentTime - this.laserModeStartTime >= GAME_CONFIG.LASER_MODE_DURATION
    ) {
      this.isLaserMode = false;
      this.laserModeStartTime = 0;
    }

    // Check angel mode expiration
    if (
      this.isAngelMode &&
      currentTime - this.angelModeStartTime >= GAME_CONFIG.ANGEL_MODE_DURATION
    ) {
      this.isAngelMode = false;
      this.angelModeStartTime = 0;
    }

    // Check scrap mode expiration
    if (
      this.isScrapMode &&
      currentTime - this.scrapModeStartTime >= GAME_CONFIG.SCRAP_MODE_DURATION
    ) {
      this.isScrapMode = false;
      this.scrapModeStartTime = 0;
    }

    // Check speed mode expiration
    if (
      this.isSpeedMode &&
      currentTime - this.speedModeStartTime >= GAME_CONFIG.SPEED_MODE_DURATION
    ) {
      this.isSpeedMode = false;
      this.speedModeStartTime = 0;
    }
  }

  getPowerupRemainingTime(powerupType) {
    let currentTime = millis();
    switch (powerupType) {
      case "fire":
        return this.isFireMode
          ? Math.ceil(
              (GAME_CONFIG.FIRE_MODE_DURATION -
                (currentTime - this.fireModeStartTime)) /
                1000
            )
          : 0;
      case "ice":
        return this.isIceMode
          ? Math.ceil(
              (GAME_CONFIG.ICE_MODE_DURATION -
                (currentTime - this.iceModeStartTime)) /
                1000
            )
          : 0;
      case "laser":
        return this.isLaserMode
          ? Math.ceil(
              (GAME_CONFIG.LASER_MODE_DURATION -
                (currentTime - this.laserModeStartTime)) /
                1000
            )
          : 0;
      case "angel":
        return this.isAngelMode
          ? Math.ceil(
              (GAME_CONFIG.ANGEL_MODE_DURATION -
                (currentTime - this.angelModeStartTime)) /
                1000
            )
          : 0;
      case "scrap":
        return this.isScrapMode
          ? Math.ceil(
              (GAME_CONFIG.SCRAP_MODE_DURATION -
                (currentTime - this.scrapModeStartTime)) /
                1000
            )
          : 0;
      case "speed":
        return this.isSpeedMode
          ? Math.ceil(
              (GAME_CONFIG.SPEED_MODE_DURATION -
                (currentTime - this.speedModeStartTime)) /
                1000
            )
          : 0;
      default:
        return 0;
    }
  }

  activateAngelMode() {
    this.health = 100; // Restore to full health instead of lives
    this.deactivateAllPowerups(); // Deactivate all other powerups
    this.isAngelMode = true;
    this.angelModeStartTime = millis();
    this.lifePickupHeld = 0; // Use the life pickup
  }

  startBetweenRounds() {
    this.isBetweenRounds = true;
    this.betweenRoundsStartTime = millis();
    this.betweenRoundsPowerupPauseStart = millis();
  }

  checkBetweenRoundsComplete() {
    if (this.isBetweenRounds) {
      let currentTime = millis();
      if (
        currentTime - this.betweenRoundsStartTime >=
        GAME_CONFIG.BETWEEN_ROUNDS_DURATION
      ) {
        this.isBetweenRounds = false;
        this.currentRound++;
        // Adjust powerup timers to pause during between-rounds
        if (this.betweenRoundsPowerupPauseStart) {
          let pauseDuration = currentTime - this.betweenRoundsPowerupPauseStart;
          if (this.isFireMode) this.fireModeStartTime += pauseDuration;
          if (this.isIceMode) this.iceModeStartTime += pauseDuration;
          if (this.isLaserMode) this.laserModeStartTime += pauseDuration;
          if (this.isAngelMode) this.angelModeStartTime += pauseDuration;
          if (this.isScrapMode) this.scrapModeStartTime += pauseDuration;
          if (this.isSpeedMode) this.speedModeStartTime += pauseDuration;
          this.betweenRoundsPowerupPauseStart = null;
        }
        return true;
      }
    }
    return false;
  }

  getBetweenRoundsRemaining() {
    if (this.isBetweenRounds) {
      let currentTime = millis();
      return Math.ceil(
        (GAME_CONFIG.BETWEEN_ROUNDS_DURATION -
          (currentTime - this.betweenRoundsStartTime)) /
          1000
      );
    }
    return 0;
  }
}
