let state = 0;
let lives = 3;
let score = 0;
let currentRound = 1; // Track current round
let lifePickupHeld = 0; // Track if player has a life pickup (max 1)
let isFiring = false; // Track if flame thrower is active
let flameStartTime = 0; // Track when flame thrower started
let flameDuration = 2000; // 2 seconds in milliseconds
let currentFrame = 0; // Current frame index
let frameRate = 8; // Frames per second for animation
let lastFrameTime = 0; // Track when last frame was shown
let frameCounter = 0; // For FPS throttling
let flameConeGraphic; // Pre-rendered flame cone
let flameConeFallbackGraphic; // Pre-rendered fallback cone
let isFireMode = false; // Track if player is in fire mode
let fireModeStartTime = 0; // Track when fire mode started
let fireModeDuration = 30000; // 30 seconds in milliseconds
let isIceMode = false; // Track if player is in ice mode
let iceModeStartTime = 0; // Track when ice mode started
let iceModeDuration = 30000; // 30 seconds in milliseconds
let groupIceBullet = []; // Array for ice bullets
//loading images
let playerImage,
  enemyImage,
  temp,
  player,
  bullet,
  bulletImage,
  enemyBulletImage,
  flameImage;
let lastShotTime = 0; // Track when the last bullet was fired
let shootCooldown = 400; // Cooldown in milliseconds (0.4 seconds)

let groupAlien = [];
let groupBullet = [];
let groupEnemyBullet = []; // Array for enemy bullets
let groupPickup = []; // Array for pickups

let angelImage,
  fireUpImage,
  fire2Image,
  iceUpImage,
  ice2Image,
  player1Image,
  repairImage,
  lifeImage,
  iceExploImage,
  lazUpImage,
  lazBulletImage;

let isLaserMode = false; // Track if player is in laser mode
let laserModeStartTime = 0; // Track when laser mode started
let laserModeDuration = 30000; // 30 seconds in milliseconds
let isAngelMode = false; // Track if player is in angel mode
let angelModeStartTime = 0;
let angelModeDuration = 10000; // 10 seconds in milliseconds

function preload() {
  playerImage = loadImage("images/player/player.png");
  enemyImage = loadImage("images/enemies/enemy.png");
  bulletImage = loadImage("images/bullets/bullet.png");
  enemyBulletImage = loadImage("images/bullets/en-bullet.png");
  angelImage = loadImage("images/player/angel (1).png");
  fireUpImage = loadImage("images/pick-ups/fire-up (1).png");
  fire2Image = loadImage("images/player/fire2 (1).png");
  iceUpImage = loadImage("images/pick-ups/ice-up (1).png");
  ice2Image = loadImage("images/player/ice2 (1).png");
  player1Image = loadImage("images/player/player1 (1).png");
  repairImage = loadImage("images/pick-ups/repair (1).png");
  lifeImage = loadImage("images/pick-ups/life (1).png");
  flameImage = loadImage("images/bullets/flame (1).png");
  iceExploImage = loadImage("images/bullets/ice-explo (1).png");
  lazUpImage = loadImage("images/pick-ups/laz-up (1).png");
  lazBulletImage = loadImage("images/bullets/laz (1).png");
}
// blueprints for character alien and bullet
class Bullet {
  constructor(x, y, angle, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = 5; // Bullet speed
    this.size = 50;

    // Calculate direction based on angle, matching ship's rotation
    this.directionX = cos(angle - PI / 2); // Subtract PI/2 to match ship's orientation
    this.directionY = sin(angle - PI / 2);
  }

  move() {
    this.xPos += this.directionX * this.speed;
    this.yPos += this.directionY * this.speed;
  }

  draw() {
    push();
    translate(this.xPos + this.size / 2, this.yPos + this.size / 2);
    rotate(atan2(this.directionY, this.directionX) + PI / 2);
    // Shift lazBulletImage 40px to the left for better alignment
    if (this.image === lazBulletImage || this.image === bulletImage) {
      image(
        this.image,
        -this.size / 2 - 30,
        -this.size / 2,
        this.size,
        this.size
      );
    } else {
      image(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
    }
    pop();
  }

  isOffScreen() {
    return (
      this.xPos < -50 ||
      this.xPos > width + 50 ||
      this.yPos < -50 ||
      this.yPos > height + 50
    );
  }

  checkCollision(alien) {
    return (
      this.xPos < alien.xPos + alien.size &&
      this.xPos + this.size > alien.xPos &&
      this.yPos < alien.yPos + alien.size &&
      this.yPos + this.size > alien.yPos
    );
  }
}

class IceBullet {
  constructor(x, y, angle, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = 4; // Slightly slower than regular bullets
    this.size = 50;
    this.creationTime = millis();
    this.lifeTime = 1000; // 1 second
    this.hasExploded = false;
    this.explosionSize = 200; // 4 times the original size (50 * 4 = 200)
    this.explosionStartTime = 0; // Track when explosion started
    this.explosionDuration = 500; // How long explosion lasts

    // Calculate direction based on angle, matching ship's rotation
    this.directionX = cos(angle - PI / 2);
    this.directionY = sin(angle - PI / 2);
  }

  move() {
    if (!this.hasExploded) {
      this.xPos += this.directionX * this.speed;
      this.yPos += this.directionY * this.speed;
    }
  }

  draw() {
    if (!this.hasExploded) {
      push();
      translate(this.xPos + this.size / 2, this.yPos + this.size / 2);
      rotate(atan2(this.directionY, this.directionX) + PI / 2);
      image(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
      pop();
    } else {
      // Draw explosion centered on the original bullet position
      push();
      translate(this.xPos + this.size / 2, this.yPos + this.size / 2);
      image(
        this.image,
        -this.explosionSize / 2,
        -this.explosionSize / 2,
        this.explosionSize,
        this.explosionSize
      );
      pop();
    }
  }

  isOffScreen() {
    return (
      this.xPos < -100 ||
      this.xPos > width + 100 ||
      this.yPos < -100 ||
      this.yPos > height + 100
    );
  }

  shouldExplode() {
    return millis() - this.creationTime >= this.lifeTime && !this.hasExploded;
  }

  explode() {
    this.hasExploded = true;
    this.explosionStartTime = millis();
  }

  shouldRemove() {
    return (
      this.hasExploded &&
      millis() - this.explosionStartTime >= this.explosionDuration
    );
  }

  checkExplosionCollision(alien) {
    if (!this.hasExploded) return false;

    // Calculate explosion center (same as original bullet center)
    let explosionCenterX = this.xPos + this.size / 2;
    let explosionCenterY = this.yPos + this.size / 2;

    // Calculate alien center
    let alienCenterX = alien.xPos + alien.size / 2;
    let alienCenterY = alien.yPos + alien.size / 2;

    // Check if alien is within explosion radius
    let dx = alienCenterX - explosionCenterX;
    let dy = alienCenterY - explosionCenterY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    return distance < this.explosionSize / 2;
  }
}

class Player {
  constructor(x, y, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.size = 50; // Size for collision detection
    this.rotation = 0; // Add rotation property
  }

  updateRotation() {
    // Calculate angle between center of ship and mouse
    let dx = mouseX - (this.xPos + this.size / 2);
    let dy = mouseY - (this.yPos + this.size / 2);
    // Add PI/2 to offset the initial upward orientation
    this.rotation = atan2(dy, dx) + PI / 2;
  }

  draw() {
    push(); // Save the current transformation state
    translate(this.xPos + this.size / 2, this.yPos + this.size / 2); // Move to center of player
    rotate(this.rotation); // Rotate
    image(this.image, -this.size / 2, -this.size / 2, this.size, this.size); // Draw centered
    pop(); // Restore the previous transformation state
  }

  getNosePosition() {
    // Calculate the actual nose position after rotation
    let noseX = this.xPos; // Left edge of ship
    let noseY = this.yPos; // Top of ship
    return { x: noseX, y: noseY };
  }
}

//Enemy blueprint
class Alien {
  constructor(x, y, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = 2; // Base movement speed
    this.size = 50; // Size of alien for collision detection
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
    if (this.xPos > width - 50) {
      // 50 is the width of the enemy image
      this.xPos = width - 50;
      this.direction.x *= -1;
    }
    if (this.yPos < 0) {
      this.yPos = 0;
      this.direction.y *= -1;
    }
    if (this.yPos > height - 50) {
      // 50 is the height of the enemy image
      this.yPos = height - 50;
      this.direction.y *= -1;
    }
  }
}

class EnemyBullet {
  constructor(x, y, targetX, targetY, image) {
    this.xPos = x;
    this.yPos = y;
    this.image = image;
    this.speed = 2; // Slower speed for enemy bullets
    this.size = 50;

    // Calculate direction to player
    let dx = targetX - x;
    let dy = targetY - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    // Prevent division by zero
    if (distance === 0) {
      this.directionX = 0;
      this.directionY = 1;
    } else {
      this.directionX = dx / distance;
      this.directionY = dy / distance;
    }
  }

  move() {
    this.xPos += this.directionX * this.speed;
    this.yPos += this.directionY * this.speed;
  }

  isOffScreen() {
    return (
      this.xPos < -50 ||
      this.xPos > width + 50 ||
      this.yPos < -50 ||
      this.yPos > height + 50
    );
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
}

class Pickup {
  constructor(x, y, type, image) {
    this.xPos = x;
    this.yPos = y;
    this.type = type; // 'fire-up', 'ice-up', 'life', 'repair'
    this.image = image;
    this.size = 40;
    this.speed = 1; // Pickups fall down slowly (reduced from 2)
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
}

//Title screen and initilizing aliens
function setup() {
  createCanvas(1100, 600);
  player = new Player(250, 400, player1Image); // Use player1 (1).png as default
  spawnAliens();

  // Pre-render flame cones for better performance (only if images are loaded)
  if (flameImage && flameImage.width) {
    createFlameConeGraphics();
  } else {
    console.log("Flame image not loaded yet, will create graphics later");
  }
}

function spawnAliens() {
  groupAlien = []; // Clear existing aliens
  for (let i = 0; i < 5; i++) {
    // Random x position between 0 and width-50 (accounting for enemy size)
    let randomX = random(0, width - 50);
    temp = new Alien(randomX, 20, enemyImage);
    groupAlien.push(temp);
  }
}

function createFlameConeGraphics() {
  // Create pre-rendered flame cone graphic
  flameConeGraphic = createGraphics(120, 100);
  flameConeGraphic.imageMode(CENTER);
  flameConeGraphic.translate(60, 90); // Center the cone

  // Draw flame cone pattern
  drawFlameConeToBuffer(flameConeGraphic, 0, 0, 4, true);

  // Create pre-rendered fallback cone graphic
  flameConeFallbackGraphic = createGraphics(120, 100);
  flameConeFallbackGraphic.imageMode(CENTER);
  flameConeFallbackGraphic.translate(60, 90); // Center the cone

  // Draw fallback cone pattern
  drawFlameConeToBuffer(flameConeFallbackGraphic, 0, 0, 4, false);
}

function drawFlameConeToBuffer(g, x, y, layers, useImage) {
  let flameSpacing = 15; // horizontal spacing between flames
  let layerSpacing = 20; // vertical spacing between rows

  for (let i = 0; i < layers; i++) {
    let numFlames = 1 + i; // 1 → 2 → 3 → 4 ...
    for (let j = 0; j < numFlames; j++) {
      // Center flames
      let offsetX = (j - (numFlames - 1) / 2) * flameSpacing;
      let offsetY = -i * layerSpacing;

      if (useImage && flameImage && flameImage.width) {
        // Use flame image
        g.image(flameImage, x + offsetX, y + offsetY, 20, 20);
      } else {
        // Use colored rectangle
        g.fill(255, 100, 0, 200); // Orange color for flame
        g.rect(x + offsetX - 10, y + offsetY - 10, 20, 20);
      }
    }
  }
}

function spawnPickup(x, y) {
  // 25% chance to spawn a pickup
  if (random() < 0.25) {
    let pickupType;

    // If player already has a life pickup, don't spawn another one
    if (lifePickupHeld > 0) {
      pickupType = random(["fire-up", "ice-up", "laz-up", "repair"]);
    } else {
      pickupType = random(["fire-up", "ice-up", "laz-up", "life", "repair"]);
    }

    let pickupImage;

    switch (pickupType) {
      case "fire-up":
        pickupImage = fireUpImage;
        break;
      case "ice-up":
        pickupImage = iceUpImage;
        break;
      case "laz-up":
        pickupImage = lazUpImage;
        break;
      case "life":
        pickupImage = lifeImage;
        break;
      case "repair":
        pickupImage = repairImage;
        break;
    }

    let pickup = new Pickup(x, y, pickupType, pickupImage);
    groupPickup.push(pickup);
  }
}

function applyPickupEffect(type) {
  // If angel mode is active, ignore all pickups except life and repair
  if (isAngelMode && type !== "life" && type !== "repair") {
    return;
  }
  // Only one powerup at a time (fire, ice, laser)
  switch (type) {
    case "fire-up":
      // Deactivate other modes
      isIceMode = false;
      iceModeStartTime = 0;
      isLaserMode = false;
      laserModeStartTime = 0;
      // Change player ship to fire2 image and enable fire mode
      player.image = fire2Image;
      isFireMode = true;
      fireModeStartTime = millis();
      break;
    case "ice-up":
      // Deactivate other modes
      isFireMode = false;
      fireModeStartTime = 0;
      isLaserMode = false;
      laserModeStartTime = 0;
      // Change player ship to ice2 image and enable ice mode
      player.image = ice2Image;
      isIceMode = true;
      iceModeStartTime = millis();
      break;
    case "laz-up":
      // Deactivate other modes
      isFireMode = false;
      fireModeStartTime = 0;
      isIceMode = false;
      iceModeStartTime = 0;
      // Change player ship to player.png and enable laser mode
      player.image = playerImage;
      isLaserMode = true;
      laserModeStartTime = millis();
      break;
    case "life":
      // Add life pickup to inventory (max 1)
      if (lifePickupHeld < 1) {
        lifePickupHeld = 1;
      }
      break;
    case "repair":
      // Only give +1 life if less than 3 lives
      if (lives < 3) {
        lives++;
      }
      break;
  }
}

function draw() {
  if (state == 0) {
    background(0);
    fill(255, 255, 255);
    textAlign(CENTER);
    textSize(48);
    text("GALAGA", width / 2, 100);
    textSize(16);
    textAlign(LEFT);
    text("Your score:", 20, 20);
    text(score, 120, 20);
    textAlign(CENTER);
    text("Round " + currentRound, width / 2, 20);

    fill(0, 255, 0);
    rect(width / 2 - 50, 190, 100, 50);
    fill(0);
    text("START", width / 2, 220);

    // Draw all new sprites in a row for testing
    let spriteY = 300;
    let spriteSize = 64;
    let startX = width / 2 - 5.5 * spriteSize;

    // Draw all available images in a row
    image(angelImage, startX + 0 * spriteSize, spriteY, spriteSize, spriteSize);
    image(
      fireUpImage,
      startX + 1 * spriteSize,
      spriteY,
      spriteSize,
      spriteSize
    );
    image(fire2Image, startX + 2 * spriteSize, spriteY, spriteSize, spriteSize);
    image(iceUpImage, startX + 3 * spriteSize, spriteY, spriteSize, spriteSize);
    image(ice2Image, startX + 4 * spriteSize, spriteY, spriteSize, spriteSize);
    image(
      player1Image,
      startX + 5 * spriteSize,
      spriteY,
      spriteSize,
      spriteSize
    );
    image(
      repairImage,
      startX + 6 * spriteSize,
      spriteY,
      spriteSize,
      spriteSize
    );
    image(lifeImage, startX + 7 * spriteSize, spriteY, spriteSize, spriteSize);
    image(
      playerImage,
      startX + 8 * spriteSize,
      spriteY,
      spriteSize,
      spriteSize
    );
    image(enemyImage, startX + 9 * spriteSize, spriteY, spriteSize, spriteSize);
    image(
      bulletImage,
      startX + 10 * spriteSize,
      spriteY,
      spriteSize,
      spriteSize
    );
    image(
      enemyBulletImage,
      startX + 11 * spriteSize,
      spriteY,
      spriteSize,
      spriteSize
    );

    // Draw the player with fixed rotation
    if (player) {
      player.draw();
    }
  }

  if (state == 1) {
    background(0);
    fill(255, 255, 255);

    text("Lives: " + lives, 950, 20);
    text("Aliens: " + groupAlien.length, 20, 20);
    text("Round " + currentRound, width / 2 - 30, 20);
    text("Score: " + score, 20, 40);

    // Display life pickup if held
    if (lifePickupHeld > 0) {
      text("Life Pickup: " + lifePickupHeld, 950, 40);
      image(lifeImage, 850, 30, 30, 30);
    }

    // Display fire mode status
    if (isFireMode) {
      // Check if fire mode has expired
      let currentTime = millis();
      if (currentTime - fireModeStartTime >= fireModeDuration) {
        isFireMode = false;
        player.image = playerImage; // Reset to normal player image
        console.log("Fire mode expired!");
      } else {
        // Calculate remaining time
        let remainingTime = Math.ceil(
          (fireModeDuration - (currentTime - fireModeStartTime)) / 1000
        );
        text("FIRE MODE: " + remainingTime + "s", 950, 60);
        fill(255, 100, 0);
        text("Press F for flamethrower", 950, 80);
        fill(255, 255, 255);
      }
    }

    // Display ice mode status
    if (isIceMode) {
      // Check if ice mode has expired
      let currentTime = millis();
      if (currentTime - iceModeStartTime >= iceModeDuration) {
        isIceMode = false;
        player.image = playerImage; // Reset to normal player image
        console.log("Ice mode expired!");
      } else {
        // Calculate remaining time
        let remainingTime = Math.ceil(
          (iceModeDuration - (currentTime - iceModeStartTime)) / 1000
        );
        text("ICE MODE: " + remainingTime + "s", 950, 100);
        fill(100, 150, 255);
        text("Press E for ice bullet", 950, 120);
        fill(255, 255, 255);
      }
    }

    // Display laser mode status
    if (isLaserMode) {
      // Check if laser mode has expired
      let currentTime = millis();
      if (currentTime - laserModeStartTime >= laserModeDuration) {
        isLaserMode = false;
        player.image = player1Image; // Reset to default ship
        console.log("Laser mode expired!");
      } else {
        // Calculate remaining time
        let remainingTime = Math.ceil(
          (laserModeDuration - (currentTime - laserModeStartTime)) / 1000
        );
        text("LASER MODE: " + remainingTime + "s", 950, 140);
        fill(255, 0, 255);
        text("Left click for laser bullets", 950, 160);
        fill(255, 255, 255);
      }
    }

    // Display angel mode status
    if (isAngelMode) {
      let currentTime = millis();
      if (currentTime - angelModeStartTime >= angelModeDuration) {
        isAngelMode = false;
        player.image = player1Image; // Reset to default ship
        console.log("Angel mode expired!");
      } else {
        let remainingTime = Math.ceil(
          (angelModeDuration - (currentTime - angelModeStartTime)) / 1000
        );
        text("ANGEL MODE: " + remainingTime + "s", 950, 180);
        fill(255, 255, 0);
        text("Left click: 13-way laser spread!", 950, 200);
        fill(255, 255, 255);
      }
    }

    if (player) {
      player.updateRotation();
      player.draw();
    }

    // Update and draw aliens
    for (let i = 0; i < groupAlien.length; i++) {
      if (!groupAlien[i]) continue;

      image(
        groupAlien[i].image,
        groupAlien[i].xPos,
        groupAlien[i].yPos,
        50,
        50
      );
      groupAlien[i].move();

      // Random shooting for each alien - increased probability to 2%
      if (random() < 0.02 && player) {
        // 2% chance per frame to shoot
        try {
          let enemyBullet = new EnemyBullet(
            groupAlien[i].xPos + 25, // Center of alien
            groupAlien[i].yPos + 50, // Bottom of alien
            player.xPos + 25, // Target center of player
            player.yPos + 25,
            enemyBulletImage
          );
          groupEnemyBullet.push(enemyBullet);
          console.log(
            "Enemy bullet created! Total bullets:",
            groupEnemyBullet.length
          );
        } catch (error) {
          console.log("Error creating enemy bullet:", error);
        }
      }

      if (groupAlien[i].yPos > height) {
        groupAlien[i].yPos = 0;
        lives -= 1;
        if (lives <= 0) {
          // Check if player has a life pickup to auto-restore
          if (lifePickupHeld > 0) {
            lives = 3; // Restore to full health
            lifePickupHeld = 0; // Use the life pickup
            // Activate angel mode
            isAngelMode = true;
            angelModeStartTime = millis();
            player.image = angelImage;
            // Prevent immediate game over by skipping the rest of this block
            continue;
          } else {
            // Clear all bullets when game ends
            groupBullet = [];
            groupEnemyBullet = [];
            groupIceBullet = [];
            // End all powerup modes
            isFireMode = false;
            fireModeStartTime = 0;
            isIceMode = false;
            iceModeStartTime = 0;
            isLaserMode = false;
            laserModeStartTime = 0;
            isAngelMode = false;
            angelModeStartTime = 0;
            state = 3; // Game over
          }
        }
      }
    }

    if (groupAlien.length === 0) {
      currentRound++;
      spawnAliens();
    }

    if (keyIsDown(65)) {
      player.xPos -= 5;
      if (player.xPos < 0) player.xPos = 0; // Left boundary
    }

    if (keyIsDown(68)) {
      player.xPos += 5;
      if (player.xPos > width - player.size) player.xPos = width - player.size; // Right boundary
    }

    if (keyIsDown(83)) {
      player.yPos += 5;
      if (player.yPos > height - player.size)
        player.yPos = height - player.size; // Bottom boundary
    }

    if (keyIsDown(87)) {
      player.yPos -= 5;
      if (player.yPos < 0) player.yPos = 0; // Top boundary
    }

    // Handle player shooting
    if (mouseIsPressed && mouseButton === LEFT) {
      let currentTime = millis();
      if (currentTime - lastShotTime >= shootCooldown) {
        // Calculate bullet spawn position at ship's nose
        let bulletSpawnX =
          player.xPos + player.size / 2 + 25 * cos(player.rotation);
        let bulletSpawnY =
          player.yPos + player.size / 2 + 25 * sin(player.rotation);

        if (isAngelMode) {
          // Fire 13 laz bullets evenly in 360 degrees
          let numBullets = 13;
          let baseAngle = player.rotation;
          for (let i = 0; i < numBullets; i++) {
            let angle = baseAngle + radians((360 / numBullets) * i);
            let angelBullet = new Bullet(
              bulletSpawnX,
              bulletSpawnY,
              angle,
              lazBulletImage
            );
            groupBullet.push(angelBullet);
          }
        } else if (isLaserMode) {
          // Center bullet
          let baseAngle = player.rotation;
          // Main laser
          let mainBullet = new Bullet(
            bulletSpawnX,
            bulletSpawnY,
            baseAngle,
            lazBulletImage
          );
          groupBullet.push(mainBullet);
          // Left laser (-30 degrees)
          let leftAngle = baseAngle - radians(30);
          let leftBullet = new Bullet(
            bulletSpawnX,
            bulletSpawnY,
            leftAngle,
            lazBulletImage
          );
          groupBullet.push(leftBullet);
          // Right laser (+30 degrees)
          let rightAngle = baseAngle + radians(30);
          let rightBullet = new Bullet(
            bulletSpawnX,
            bulletSpawnY,
            rightAngle,
            lazBulletImage
          );
          groupBullet.push(rightBullet);
        } else {
          let bulletImg = bulletImage;
          bullet = new Bullet(
            bulletSpawnX, // Use calculated spawn position
            bulletSpawnY, // Use calculated spawn position
            player.rotation, // Use player's rotation angle
            bulletImg
          );
          groupBullet.push(bullet);
        }
        lastShotTime = currentTime;
      }
    }

    // Update and draw bullets
    for (let i = groupBullet.length - 1; i >= 0; i--) {
      if (!groupBullet[i]) {
        groupBullet.splice(i, 1);
        continue;
      }

      groupBullet[i].move();
      groupBullet[i].draw();

      // Check for collisions with aliens
      for (let j = groupAlien.length - 1; j >= 0; j--) {
        if (!groupAlien[j]) continue;

        if (groupBullet[i] && groupBullet[i].checkCollision(groupAlien[j])) {
          // Spawn pickup at enemy location before removing it
          spawnPickup(groupAlien[j].xPos, groupAlien[j].yPos);

          // Remove both the bullet and the alien
          groupBullet.splice(i, 1);
          groupAlien.splice(j, 1);
          score += 100; // Add points for hitting an alien
          break; // Exit the alien loop since this bullet is now gone
        }
      }

      // Remove bullets that are off screen
      if (groupBullet[i] && groupBullet[i].isOffScreen()) {
        groupBullet.splice(i, 1);
      }
    }

    // Update and draw pickups
    for (let i = groupPickup.length - 1; i >= 0; i--) {
      if (!groupPickup[i]) continue;

      groupPickup[i].move();
      groupPickup[i].draw();

      // Check collision with player
      if (player && groupPickup[i].checkCollision(player)) {
        // Apply pickup effect
        applyPickupEffect(groupPickup[i].type);
        groupPickup.splice(i, 1);
        continue;
      }

      // Remove pickups that are off screen
      if (groupPickup[i].isOffScreen()) {
        groupPickup.splice(i, 1);
      }
    }

    // Handle flame thrower (optimized with pre-rendered graphics)
    if (isFiring) {
      let currentTime = millis();
      if (currentTime - flameStartTime >= flameDuration) {
        isFiring = false;
        console.log("Flame thrower stopped");
      } else {
        // Create graphics if they don't exist yet
        if (!flameConeGraphic && flameImage && flameImage.width) {
          createFlameConeGraphics();
        }

        // FPS throttling: only draw every 3rd frame for better performance
        if (frameCounter % 3 === 0) {
          // Only advance frame at the specified frame rate
          if (currentTime - lastFrameTime > 1000 / frameRate) {
            currentFrame = (currentFrame + 1) % 5; // Use 5 frames for animation
            lastFrameTime = currentTime;
          }

          // Draw pre-rendered flame cone at the player's nose, oriented to player's rotation
          push();
          translate(
            player.xPos + player.size / 2,
            player.yPos + player.size / 2
          );
          rotate(player.rotation);

          if (flameConeGraphic && flameImage && flameImage.width) {
            image(flameConeGraphic, -player.size - 9, -player.size * 2.5);
          } else if (flameConeFallbackGraphic) {
            image(
              flameConeFallbackGraphic,
              -player.size - 9,
              -player.size * 2.5
            );
          } else {
            // Fallback: draw simple rectangle if no graphics available
            fill(255, 100, 0, 200);
            rect(-player.size - 19, -player.size * 2.5 - 10, 20, 20);
          }

          pop();
        }
        frameCounter++;

        // Check flame cone collision with aliens (always check for gameplay)
        checkFlameConeCollision(
          player.xPos + player.size / 2,
          player.yPos + player.size / 2,
          player.rotation,
          4
        );
      }
    }

    // Update and draw ice bullets
    for (let i = groupIceBullet.length - 1; i >= 0; i--) {
      if (!groupIceBullet[i]) {
        groupIceBullet.splice(i, 1);
        continue;
      }

      groupIceBullet[i].move();
      groupIceBullet[i].draw();

      // Check if ice bullet should explode
      if (groupIceBullet[i].shouldExplode()) {
        groupIceBullet[i].explode();
      }

      // Check for explosion collisions with aliens (only after explosion)
      if (groupIceBullet[i].hasExploded) {
        for (let j = groupAlien.length - 1; j >= 0; j--) {
          if (!groupAlien[j]) continue;

          if (groupIceBullet[i].checkExplosionCollision(groupAlien[j])) {
            // Spawn pickup at enemy location before removing it
            spawnPickup(groupAlien[j].xPos, groupAlien[j].yPos);

            // Remove the alien
            groupAlien.splice(j, 1);
            score += 100; // Add points for hitting an alien
          }
        }
      }

      // Remove ice bullets that are off screen or have finished exploding
      if (
        groupIceBullet[i] &&
        (groupIceBullet[i].isOffScreen() || groupIceBullet[i].shouldRemove())
      ) {
        groupIceBullet.splice(i, 1);
      }
    }
  }

  //stae 3 = game over screen
  if (state == 3) {
    background(0);
    fill(255, 255, 255);
    textSize(32);
    textAlign(CENTER);
    text("YOU LOSE", width / 2, height / 3);
    textSize(24);
    text("Final Score: " + score, width / 2, height / 2);
    text("Rounds Completed: " + (currentRound - 1), width / 2, height / 2 + 40);

    // Try again button
    fill(0, 255, 0);
    rect(width / 2 - 100, height / 2 + 80, 200, 50);
    fill(0);
    text("TRY AGAIN", width / 2, height / 2 + 110);

    textAlign(LEFT); // Reset text alignment
    textSize(16); // Reset text size
  }
  //leaderboards
  if (state == 4) {
  }

  // Update and draw enemy bullets
  for (let i = groupEnemyBullet.length - 1; i >= 0; i--) {
    if (!groupEnemyBullet[i]) {
      console.log("Invalid bullet found at index:", i);
      groupEnemyBullet.splice(i, 1);
      continue;
    }

    try {
      groupEnemyBullet[i].move();
      image(
        groupEnemyBullet[i].image,
        groupEnemyBullet[i].xPos,
        groupEnemyBullet[i].yPos,
        50,
        50
      );

      // Check collision with player
      if (player && groupEnemyBullet[i].checkCollision(player)) {
        lives--;
        groupEnemyBullet.splice(i, 1);
        console.log("Player hit! Lives remaining:", lives);
        if (lives <= 0) {
          // Check if player has a life pickup to auto-restore
          if (lifePickupHeld > 0) {
            lives = 3; // Restore to full health
            lifePickupHeld = 0; // Use the life pickup
            // Activate angel mode
            isAngelMode = true;
            angelModeStartTime = millis();
            player.image = angelImage;
            // Prevent immediate game over by skipping the rest of this block
            continue;
          } else {
            // Clear all bullets when game ends
            groupBullet = [];
            groupEnemyBullet = [];
            groupIceBullet = [];
            // End all powerup modes
            isFireMode = false;
            fireModeStartTime = 0;
            isIceMode = false;
            iceModeStartTime = 0;
            isLaserMode = false;
            laserModeStartTime = 0;
            isAngelMode = false;
            angelModeStartTime = 0;
            state = 3; // Game over
          }
        }
        continue;
      }

      // Remove bullets that are off screen
      if (groupEnemyBullet[i].isOffScreen()) {
        groupEnemyBullet.splice(i, 1);
        console.log(
          "Bullet removed (off screen). Remaining bullets:",
          groupEnemyBullet.length
        );
      }
    } catch (error) {
      console.log("Error updating enemy bullet:", error);
      groupEnemyBullet.splice(i, 1);
    }
  }
}

function mouseClicked() {
  //back to game
  if (
    state == 3 &&
    mouseX > width / 2 - 100 &&
    mouseX < width / 2 + 100 &&
    mouseY > height / 2 + 80 &&
    mouseY < height / 2 + 130
  ) {
    background(0);
    state = 1;
    lives = 3;
    currentRound = 1;
    score = 0;
    lifePickupHeld = 0; // Reset life pickup
    isFiring = false; // Reset flame state
    currentFrame = 0; // Reset flame animation
    frameCounter = 0; // Reset frame counter
    isFireMode = false; // Reset fire mode
    fireModeStartTime = 0; // Reset fire mode timer
    isIceMode = false; // Reset ice mode
    iceModeStartTime = 0; // Reset ice mode timer
    isLaserMode = false; // Reset laser mode
    laserModeStartTime = 0; // Reset laser mode timer
    groupEnemyBullet = []; // Clear enemy bullets
    groupPickup = []; // Clear pickups
    groupIceBullet = []; // Clear ice bullets
    spawnAliens();
  }

  if (
    state == 3 &&
    mouseX > 200 &&
    mouseX < 300 &&
    mouseY > 400 &&
    mouseY < 500
  ) {
    background(0);
    state = 0;
    currentRound = 1;
    score = 0;
    lifePickupHeld = 0; // Reset life pickup
    isFiring = false; // Reset flame state
    currentFrame = 0; // Reset flame animation
    frameCounter = 0; // Reset frame counter
    isFireMode = false; // Reset fire mode
    fireModeStartTime = 0; // Reset fire mode timer
    isIceMode = false; // Reset ice mode
    iceModeStartTime = 0; // Reset ice mode timer
    isLaserMode = false; // Reset laser mode
    laserModeStartTime = 0; // Reset laser mode timer
    groupEnemyBullet = []; // Clear enemy bullets
    groupPickup = []; // Clear pickups
    groupIceBullet = []; // Clear ice bullets
  }

  //click START button to begin game
  if (
    state == 0 &&
    mouseX >= width / 2 - 50 &&
    mouseX <= width / 2 + 50 &&
    mouseY >= 190 &&
    mouseY <= 240
  ) {
    background(0);
    lives = 3;
    currentRound = 1;
    score = 0;
    lifePickupHeld = 0; // Reset life pickup
    isFiring = false; // Reset flame state
    currentFrame = 0; // Reset flame animation
    frameCounter = 0; // Reset frame counter
    isFireMode = false; // Reset fire mode
    fireModeStartTime = 0; // Reset fire mode timer
    isIceMode = false; // Reset ice mode
    iceModeStartTime = 0; // Reset ice mode timer
    isLaserMode = false; // Reset laser mode
    laserModeStartTime = 0; // Reset laser mode timer
    groupEnemyBullet = []; // Clear enemy bullets
    groupPickup = []; // Clear pickups
    groupIceBullet = []; // Clear ice bullets
    state = 1;
    spawnAliens();
  }
}

function resetGame() {
  // Clear all bullets
  groupBullet = [];
  // Clear all enemy bullets
  groupEnemyBullet = [];
  // Clear all ice bullets
  groupIceBullet = [];
  // Reset player position and rotation
  player = new Player(250, 400, player1Image); // Use player1 (1).png as default
  // Clear all aliens
  groupAlien = [];
  // Clear all pickups
  groupPickup = [];
  // Reset flame state
  isFiring = false;
  // Reset flame animation
  currentFrame = 0;
  // Reset frame counter
  frameCounter = 0;
  // Reset life pickup held
  lifePickupHeld = 0;
  // Reset fire mode
  isFireMode = false;
  // Reset fire mode timer
  fireModeStartTime = 0;
  // Reset ice mode
  isIceMode = false;
  // Reset ice mode timer
  iceModeStartTime = 0;
  // Reset score
  score = 0;
  // Reset game state
  state = 0;
  // Reset last shot time
  lastShotTime = 0;
  // Reset laser mode
  isLaserMode = false;
  // Reset laser mode timer
  laserModeStartTime = 0;
  // Reset angel mode
  isAngelMode = false;
  angelModeStartTime = 0;
}

function mousePressed() {
  if (state === 0) {
    state = 1;
    resetGame();
  } else if (state === 3) {
    state = 0;
    resetGame();
  }
}

function keyPressed() {
  if ((state === 1 && key === "F") || key === "f") {
    if (isFireMode && !isFiring) {
      isFiring = true;
      flameStartTime = millis();
      console.log("Flame thrower activated! Key pressed:", key);
    } else if (!isFireMode) {
      console.log("Flame thrower only works in fire mode!");
    } else {
      console.log("Flame thrower already active");
    }
  }

  if ((state === 1 && key === "E") || key === "e") {
    if (isIceMode) {
      // Calculate bullet spawn position at ship's nose
      let bulletSpawnX =
        player.xPos + player.size / 2 + 25 * cos(player.rotation);
      let bulletSpawnY =
        player.yPos + player.size / 2 + 25 * sin(player.rotation);

      let iceBullet = new IceBullet(
        bulletSpawnX,
        bulletSpawnY,
        player.rotation,
        iceExploImage
      );
      groupIceBullet.push(iceBullet);
      console.log("Ice bullet fired! Key pressed:", key);
    } else {
      console.log("Ice bullets only work in ice mode!");
    }
  }
}

function checkFlameConeCollision(x, y, rotation, layers) {
  // Safety check: ensure player exists
  if (!player) return;

  let flameSpacing = 15; // horizontal spacing between flames
  let layerSpacing = 20; // vertical spacing between rows

  for (let i = 0; i < layers; i++) {
    let numFlames = 1 + i; // 1 → 2 → 3 → 4 ...
    for (let j = 0; j < numFlames; j++) {
      // Center flames
      let offsetX = (j - (numFlames - 1) / 2) * flameSpacing;
      let offsetY = -i * layerSpacing;

      // Calculate flame position in world coordinates using regular rotation
      let flameX = x + offsetX * cos(rotation) - offsetY * sin(rotation);
      let flameY = y + offsetX * sin(rotation) + offsetY * cos(rotation);
      let size = 20 + currentFrame * 2; // Size varies from 20 to 28

      // Check collision with aliens
      for (let k = groupAlien.length - 1; k >= 0; k--) {
        if (groupAlien[k]) {
          let alienX = groupAlien[k].xPos + 25; // Center of alien
          let alienY = groupAlien[k].yPos + 25;
          let dx = alienX - flameX;
          let dy = alienY - flameY;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < size / 2 + 25) {
            // 25 is alien radius
            // Spawn pickup at enemy location before removing it
            spawnPickup(groupAlien[k].xPos, groupAlien[k].yPos);

            // Remove the alien
            groupAlien.splice(k, 1);
            score += 100; // Add points for hitting an alien
            break; // Exit alien loop since this flame hit something
          }
        }
      }

      // Check collision with enemy bullets
      for (let k = groupEnemyBullet.length - 1; k >= 0; k--) {
        if (groupEnemyBullet[k]) {
          let bulletX = groupEnemyBullet[k].xPos + 25; // Center of bullet
          let bulletY = groupEnemyBullet[k].yPos + 25;
          let dx = bulletX - flameX;
          let dy = bulletY - flameY;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < size / 2 + 25) {
            // Remove the enemy bullet
            groupEnemyBullet.splice(k, 1);
            // Don't break here - let the flame destroy multiple bullets
          }
        }
      }
    }
  }
}
