// Game Configuration
const GAME_CONFIG = {
  // Canvas settings
  CANVAS_WIDTH: 1100,
  CANVAS_HEIGHT: 600,

  // Player settings
  PLAYER_START_X: 250,
  PLAYER_START_Y: 400,
  PLAYER_SIZE: 50,
  PLAYER_SPEED: 5,

  // Bullet settings
  BULLET_SPEED: 5,
  BULLET_SIZE: 50,
  SHOOT_COOLDOWN: 400, // milliseconds

  // Enemy settings
  ENEMY_SIZE: 50,
  ENEMY_SPEED: 2,
  ENEMY_SHOOT_CHANCE: 0.02, // 2% per frame

  // Pickup settings
  PICKUP_SIZE: 40,
  PICKUP_SPEED: 1,
  PICKUP_SPAWN_CHANCE: 0.25, // 25% chance

  // Powerup durations (milliseconds)
  FIRE_MODE_DURATION: 30000, // 30 seconds
  ICE_MODE_DURATION: 30000, // 30 seconds
  LASER_MODE_DURATION: 30000, // 30 seconds
  ANGEL_MODE_DURATION: 10000, // 10 seconds
  SCRAP_MODE_DURATION: 30000, // 30 seconds

  // Flame thrower settings
  FLAME_DURATION: 2000, // 2 seconds
  FLAME_FRAME_RATE: 8, // FPS for animation

  // Ice bullet settings
  ICE_BULLET_SPEED: 4,
  ICE_BULLET_LIFE_TIME: 1000, // 1 second
  ICE_EXPLOSION_DURATION: 500, // 0.5 seconds
  ICE_EXPLOSION_SIZE: 200,

  // Between rounds settings
  BETWEEN_ROUNDS_DURATION: 3000, // 3 seconds

  // Scoring
  ENEMY_KILL_SCORE: 100,

  // Game states
  STATES: {
    TITLE: 0,
    PLAYING: 1,
    GAME_OVER: 3,
  },
};

// Image paths
const IMAGE_PATHS = {
  PLAYER: "images/player/player.png",
  PLAYER1: "images/player/player1 (1).png",
  ANGEL: "images/player/angel (1).png",
  FIRE2: "images/player/fire2 (1).png",
  ICE2: "images/player/ice2 (1).png",
  SCRAP_SHIP: "images/player/scrap-ship.png",

  ENEMY: "images/enemies/enemy.png",

  BULLET: "images/bullets/player-bullets/bullet.png",
  ENEMY_BULLET: "images/bullets/enemy-bullets/en-bullet.png",
  FLAME: "images/bullets/player-bullets/flame (1).png",
  ICE_EXPLO: "images/bullets/player-bullets/ice-explo (1).png",
  LAZ_BULLET: "images/bullets/player-bullets/laz (1).png",
  SAW_BLADE: "images/bullets/player-bullets/saw-blade.png",

  FIRE_UP: "images/pick-ups/fire-up (1).png",
  ICE_UP: "images/pick-ups/ice-up (1).png",
  LAZ_UP: "images/pick-ups/laz-up (1).png",
  SCRAP: "images/pick-ups/scrap.png",
  LIFE: "images/pick-ups/life (1).png",
  REPAIR: "images/pick-ups/repair (1).png",
};
