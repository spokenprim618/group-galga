// Global instances
let gameState;
let gameManager;
let assetManager;
let roundInputActive = false;
let roundInputValue = "";

function preload() {
  console.log("Preloading assets...");
  assetManager = new AssetManager();
  assetManager.preload();
}

function setup() {
  console.log("Setting up game...");
  createCanvas(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

  // Initialize managers
  gameState = new GameState();
  gameManager = new GameManager();
  gameManager.player = new Player(
    GAME_CONFIG.PLAYER_START_X,
    GAME_CONFIG.PLAYER_START_Y,
    assetManager.getImage("player1")
  );

  // Pre-render flame cones for better performance
  if (assetManager.isFlameImageLoaded()) {
    assetManager.createFlameConeGraphics();
  } else {
    console.log("Flame image not loaded yet, will create graphics later");
  }

  console.log("Game setup complete. State:", gameState.state);
}

function draw() {
  background(0); // Always clear the screen first

  switch (gameState.state) {
    case GAME_CONFIG.STATES.TITLE:
      UI.drawTitleScreen();
      if (gameManager.player) {
        gameManager.player.updateRotation();
        gameManager.player.draw();
      }
      if (roundInputActive) {
        drawRoundInputBox();
      }
      break;

    case GAME_CONFIG.STATES.PLAYING:
      updateGame();
      break;

    case GAME_CONFIG.STATES.GAME_OVER:
      UI.drawGameOver();
      break;
  }
}

function updateGame() {
  // Start between-rounds timer if all aliens are gone and not already in timer
  if (gameManager.groupAlien.length === 0 && !gameState.isBetweenRounds) {
    gameState.startBetweenRounds();
    gameManager.clearAllBullets();
  }

  // Always allow player movement during gameplay
  gameManager.updatePlayerMovement();

  // Handle between-rounds timer
  if (gameState.isBetweenRounds) {
    UI.drawBetweenRounds();
    if (gameState.checkBetweenRoundsComplete()) {
      gameManager.spawnAliens();
    }
    if (gameManager.player) {
      gameManager.player.updateRotation();
      gameManager.player.draw();
    }
    return;
  }

  // Only display these when not in between-rounds timer
  UI.drawGameUI();

  if (gameManager.player) {
    gameManager.player.updateRotation();
    gameManager.player.draw();
  }

  // Update all game systems
  gameManager.updateAliens();
  gameManager.updateBullets();
  gameManager.updatePickups();
  gameManager.updateEnemyBullets();
  gameManager.updateIceBullets();

  // Handle player shooting (mouse-based)
  WeaponSystem.handlePlayerShooting();

  // Update flame thrower (keyboard-based)
  FlameSystem.updateFlameThrower();

  // Check powerup expiration
  gameState.checkPowerupExpiration();
  gameManager.updatePlayerImage();
}

function mouseClicked() {
  console.log("Mouse clicked. State:", gameState.state);
  if (gameState.state === GAME_CONFIG.STATES.GAME_OVER) {
    if (UI.checkTryAgainButtonClick()) {
      console.log("Try again clicked");
      resetGame();
    }
  } else if (gameState.state === GAME_CONFIG.STATES.TITLE) {
    if (UI.checkStartButtonClick()) {
      console.log("Start button clicked");
      startGame();
    }
  }
}

function keyPressed() {
  // Test keys for activating modes (available during gameplay and between rounds)
  if (key === "1") {
    gameState.activatePowerup("fire-up");
    console.log("Test: Fire mode activated");
  }
  if (key === "2") {
    gameState.activatePowerup("ice-up");
    console.log("Test: Ice mode activated");
  }
  if (key === "3") {
    gameState.activatePowerup("laz-up");
    console.log("Test: Laser mode activated");
  }
  if (key === "4") {
    gameState.activatePowerup("scrap");
    console.log("Test: Scrap mode activated");
  }
  if (key === "5") {
    gameState.activatePowerup("speed");
    console.log("Test: Speed mode activated");
  }
  if (key === "6") {
    gameState.activatePowerup("shield");
    console.log("Test: Shield activated");
  }
  if (key === "7") {
    gameState.activatePowerup("life");
    console.log("Test: Life pickup activated");
  }
  if (key === "8") {
    gameState.activatePowerup("repair");
    console.log("Test: Repair activated");
  }
  if (key === "9") {
    gameState.activatePowerup("dark");
    console.log("Test: Dark mode activated");
  }
  if (key === "0") {
    gameState.activateAngelMode();
    console.log("Test: Angel mode activated");
  }
  if (key === "I" || key === "i") {
    gameState.isInvincible = !gameState.isInvincible;
    console.log(
      "Test: Invincibility",
      gameState.isInvincible ? "activated" : "deactivated"
    );
  }

  if (gameState.state === GAME_CONFIG.STATES.PLAYING) {
    if (key === "F" || key === "f") {
      FlameSystem.activateFlameThrower();
    }

    if (key === "E" || key === "e") {
      WeaponSystem.fireIceBullet();
    }

    // Fire black bullet with Q
    if (key === "Q" || key === "q") {
      // Calculate bullet spawn position at ship's nose
      let bulletSpawnPos = gameManager.player.getBulletSpawnPosition();
      gameManager.fireBlackBullet(
        bulletSpawnPos.x,
        bulletSpawnPos.y,
        gameManager.player.rotation
      );
    }
  }

  if (gameState.state === GAME_CONFIG.STATES.TITLE) {
    if (key === "I" || key === "i") {
      roundInputActive = true;
      roundInputValue = "";
    }
  }

  if (roundInputActive) {
    if (keyCode === ENTER) {
      let roundNum = parseInt(roundInputValue);
      if (!isNaN(roundNum) && roundNum > 0) {
        gameState.startGame();
        gameState.currentRound = roundNum;
        gameManager.reset();
        gameManager.spawnAliens();
        roundInputActive = false;
        roundInputValue = "";
      }
    } else if (keyCode === BACKSPACE) {
      roundInputValue = roundInputValue.slice(0, -1);
    } else if (key.length === 1 && /[0-9]/.test(key)) {
      roundInputValue += key;
    }
  }
}

function startGame() {
  console.log("Starting game...");
  gameState.startGame();
  gameManager.reset();
  gameManager.spawnAliens();
  console.log("Game started. State:", gameState.state);
}

function resetGame() {
  console.log("Resetting game...");
  gameState.reset();
  gameManager.reset();
  gameManager.spawnAliens();
  console.log("Game reset. State:", gameState.state);
}

function drawRoundInputBox() {
  push();
  fill(30, 30, 30, 220);
  stroke(255);
  rectMode(CENTER);
  rect(width / 2, height / 2, 300, 80, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(22);
  text("Enter round number:", width / 2, height / 2 - 18);
  textSize(32);
  text(roundInputValue, width / 2, height / 2 + 18);
  pop();
}
