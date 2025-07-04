// Global instances
let gameState;
let gameManager;
let assetManager;

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

  // Update flame thrower
  FlameSystem.updateFlameThrower();

  // Handle player shooting
  WeaponSystem.handlePlayerShooting();

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
  if (gameState.state === GAME_CONFIG.STATES.PLAYING) {
    if (key === "F" || key === "f") {
      FlameSystem.activateFlameThrower();
    }

    if (key === "E" || key === "e") {
      WeaponSystem.fireIceBullet();
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
