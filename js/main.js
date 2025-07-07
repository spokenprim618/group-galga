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

  // Start at different enemy types for testing
  if (gameState.state === GAME_CONFIG.STATES.TITLE) {
    if (key === "I" || key === "i") {
      console.log("Starting game at ice rounds (wave 15)...");
      gameState.startGame();
      gameState.currentRound = 15; // Set to first ice wave
      gameManager.reset();
      gameManager.spawnAliens();
      console.log(
        "Game started at wave 15 (ice rounds). State:",
        gameState.state
      );
    }

    if (key === "F" || key === "f") {
      console.log("Starting game at fire rounds (wave 30)...");
      gameState.startGame();
      gameState.currentRound = 30; // Set to first fire wave
      gameManager.reset();
      gameManager.spawnAliens();
      console.log(
        "Game started at wave 30 (fire rounds). State:",
        gameState.state
      );
    }

    if (key === "T" || key === "t") {
      console.log("Starting game at toxic rounds (wave 50)...");
      gameState.startGame();
      gameState.currentRound = 50; // Set to first toxic wave
      gameManager.reset();
      gameManager.spawnAliens();
      console.log(
        "Game started at wave 50 (toxic rounds). State:",
        gameState.state
      );
    }

    if (key === "D" || key === "d") {
      console.log("Starting game at dark rounds (wave 60)...");
      gameState.startGame();
      gameState.currentRound = 60; // Set to first dark wave
      gameManager.reset();
      gameManager.spawnAliens();
      console.log(
        "Game started at wave 60 (dark rounds). State:",
        gameState.state
      );
    }

    if (key === "B" || key === "b") {
      console.log("Starting game at ice beam rounds (wave 25)...");
      gameState.startGame();
      gameState.currentRound = 25; // Set to ice beam wave
      gameManager.reset();
      gameManager.spawnAliens();
      console.log(
        "Game started at wave 25 (ice beam rounds). State:",
        gameState.state
      );
    }

    if (key === "S" || key === "s") {
      console.log("Starting game at dark shield rounds (wave 60)...");
      gameState.startGame();
      gameState.currentRound = 60; // Set to dark shield wave
      gameManager.reset();
      gameManager.spawnAliens();
      console.log(
        "Game started at wave 60 (dark shield rounds). State:",
        gameState.state
      );
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
