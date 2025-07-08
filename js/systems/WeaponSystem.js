class WeaponSystem {
  static handlePlayerShooting() {
    if (mouseIsPressed && mouseButton === LEFT) {
      let currentTime = millis();
      if (currentTime - gameState.lastShotTime >= GAME_CONFIG.SHOOT_COOLDOWN) {
        let bulletSpawnPos = gameManager.player.getBulletSpawnPosition();
        // Angel mode: override
        if (gameState.isAngelMode) {
          this.fireAngelBullets(bulletSpawnPos.x, bulletSpawnPos.y);
        } else if (gameState.isScrapMode) {
          this.fireSawBladeBullet(bulletSpawnPos.x, bulletSpawnPos.y);
        } else if (gameState.isLaserMode) {
          this.fireLaserBullets(bulletSpawnPos.x, bulletSpawnPos.y);
        } else {
          this.fireRegularBullet(bulletSpawnPos.x, bulletSpawnPos.y);
        }
        gameState.lastShotTime = currentTime;
      }
    }
  }

  // Remove special bullet key for dark/hole mode

  static fireRegularBullet(x, y) {
    let bullet = new Bullet(
      x,
      y,
      gameManager.player.rotation,
      assetManager.getImage("bullet")
    );
    gameManager.groupBullet.push(bullet);
  }

  static fireLaserBullets(x, y) {
    // Center bullet
    let baseAngle = gameManager.player.rotation;
    // Main laser
    let mainBullet = new Bullet(
      x,
      y,
      baseAngle,
      assetManager.getImage("lazBullet")
    );
    gameManager.groupBullet.push(mainBullet);
    // Left laser (-30 degrees)
    let leftAngle = baseAngle - radians(30);
    let leftBullet = new Bullet(
      x,
      y,
      leftAngle,
      assetManager.getImage("lazBullet")
    );
    gameManager.groupBullet.push(leftBullet);
    // Right laser (+30 degrees)
    let rightAngle = baseAngle + radians(30);
    let rightBullet = new Bullet(
      x,
      y,
      rightAngle,
      assetManager.getImage("lazBullet")
    );
    gameManager.groupBullet.push(rightBullet);
  }

  static fireAngelBullets(x, y) {
    // Fire 13 laz bullets evenly in 360 degrees
    let numBullets = 13;
    let baseAngle = gameManager.player.rotation;
    for (let i = 0; i < numBullets; i++) {
      let angle = baseAngle + radians((360 / numBullets) * i);
      let angelBullet = new Bullet(
        x,
        y,
        angle,
        assetManager.getImage("lazBullet")
      );
      gameManager.groupBullet.push(angelBullet);
    }
  }

  static fireSawBladeBullet(x, y) {
    let sawBullet = new SawBladeBullet(
      x,
      y,
      gameManager.player.rotation,
      assetManager.getImage("sawBlade")
    );
    gameManager.groupBullet.push(sawBullet);
  }

  static fireIceBullet() {
    if (gameState.isIceMode) {
      // Calculate bullet spawn position at ship's nose
      let bulletSpawnPos = gameManager.player.getBulletSpawnPosition();

      let iceBullet = new IceBullet(
        bulletSpawnPos.x,
        bulletSpawnPos.y,
        gameManager.player.rotation,
        assetManager.getImage("iceBullet")
      );
      gameManager.groupIceBullet.push(iceBullet);
      console.log("Ice bullet fired!");
    } else {
      console.log("Ice bullets only work in ice mode!");
    }
  }

  static fireDarkBullet() {
    // Fire a special dark primer object from the player's position and rotation
    let bulletSpawnPos = gameManager.player.getBulletSpawnPosition();
    let primer = new DarkPrimerObject(
      bulletSpawnPos.x,
      bulletSpawnPos.y,
      gameManager.player.rotation,
      assetManager.getImage("darkBulletPrimer"),
      assetManager.getImage("darkhole")
    );
    gameManager.groupSpecialFire.push(primer);
    console.log("Dark primer special bullet fired!");
  }
}
