class GameState {
  constructor() {
    this.state = GAME_CONFIG.STATES.TITLE;
    this.health = 100;
    this.shields = 0;
    this.score = 0;
    this.currentRound = 1;
    this.lifePickupHeld = 0;

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

    // Reset flame state
    this.isFiring = false;
    this.flameStartTime = 0;
    this.currentFrame = 0;
    this.frameCounter = 0;

    // Reset between rounds state
    this.isBetweenRounds = false;
    this.betweenRoundsStartTime = 0;

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

    // Reset flame state
    this.isFiring = false;
    this.flameStartTime = 0;
    this.currentFrame = 0;
    this.frameCounter = 0;

    // Reset between rounds state
    this.isBetweenRounds = false;
    this.betweenRoundsStartTime = 0;

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

    // Only one powerup at a time (fire, ice, laser, scrap)
    switch (type) {
      case "fire-up":
        this.deactivateAllPowerups();
        this.isFireMode = true;
        this.fireModeStartTime = millis();
        break;
      case "ice-up":
        this.deactivateAllPowerups();
        this.isIceMode = true;
        this.iceModeStartTime = millis();
        break;
      case "laz-up":
        this.deactivateAllPowerups();
        this.isLaserMode = true;
        this.laserModeStartTime = millis();
        break;
      case "scrap":
        this.deactivateAllPowerups();
        this.isScrapMode = true;
        this.scrapModeStartTime = millis();
        break;
      case "speed":
        this.deactivateAllPowerups();
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
