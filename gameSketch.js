let state = 0;
let lives = 3;
let score = 0;
let currentRound = 1; // Track current round
//loading images
let playerImage,
  enemyImage,
  temp,
  player,
  bullet,
  bulletImage,
  enemyBulletImage;
let lastShotTime = 0; // Track when the last bullet was fired
let shootCooldown = 400; // Cooldown in milliseconds (0.4 seconds)

let groupAlien = [];
let groupBullet = [];
let groupEnemyBullet = []; // Array for enemy bullets

function preload() {
  playerImage = loadImage("images/player.png");

  enemyImage = loadImage("images/enemy.png");

  bulletImage = loadImage("images/bullet.png");
  enemyBulletImage = loadImage("images/en-bullet.png");
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
    rotate(atan2(this.directionY, this.directionX) + PI / 2); // Match ship's rotation
    image(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
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

//Title screen and initilizing aliens
function setup() {
  createCanvas(1000, 640);

  background(0);

  player = new Player(250, 400, playerImage);

  spawnAliens(); // Move alien spawning to a separate function
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
          state = 3;
        }
      }
    }

    if (groupAlien.length === 0) {
      currentRound++;
      spawnAliens();
    }

    if (keyIsDown(LEFT_ARROW)) {
      player.xPos -= 5;
    }

    if (keyIsDown(RIGHT_ARROW)) {
      player.xPos += 5;
    }

    if (keyIsDown(DOWN_ARROW)) {
      player.yPos += 5;
    }

    if (keyIsDown(UP_ARROW)) {
      player.yPos -= 5;
    }

    // Handle player shooting
    if (mouseIsPressed && mouseButton === LEFT) {
      let currentTime = millis();
      if (currentTime - lastShotTime >= shootCooldown) {
        bullet = new Bullet(
          player.xPos + player.size / 2 - 55, // 55 pixels left of center
          player.yPos + player.size / 2, // Center of player
          player.rotation, // Use player's rotation angle
          bulletImage
        );
        groupBullet.push(bullet);
        lastShotTime = currentTime;
      }
    }

    // Update and draw bullets
    for (let i = groupBullet.length - 1; i >= 0; i--) {
      groupBullet[i].move();
      groupBullet[i].draw();

      // Check for collisions with aliens
      for (let j = groupAlien.length - 1; j >= 0; j--) {
        if (groupBullet[i].checkCollision(groupAlien[j])) {
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
          state = 3;
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
    groupEnemyBullet = []; // Clear enemy bullets
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
    groupEnemyBullet = []; // Clear enemy bullets
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
    groupEnemyBullet = []; // Clear enemy bullets
    state = 1;
    spawnAliens();
  }
}

function resetGame() {
  // Clear all bullets
  groupBullet = [];
  // Reset player position and rotation
  player = new Player(250, 400, playerImage);
  // Clear all aliens
  groupAlien = [];
  // Reset score
  score = 0;
  // Reset game state
  state = 0;
  // Reset last shot time
  lastShotTime = 0;
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
