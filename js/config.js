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
  PLAYER_SPEED_BOOST: 1.15, // 15% speed increase

  // Bullet settings
  BULLET_SPEED: 5,
  BULLET_SIZE: 50,
  SHOOT_COOLDOWN: 400, // milliseconds

  // Enemy settings
  ENEMY_SIZE: 50,
  ENEMY_SPEED: 2,
  ENEMY_SHOOT_CHANCE: 0.02, // 2% per frame

  // Ice enemy settings
  ICE_DRONE_SHOOT_CHANCE: 0.02, // Same as regular enemy
  ICE_SLOWER_SHOOT_CHANCE: 0.01, // Slower shooting (1% per frame)
  ICE_SPEED_SHOOT_CHANCE: 0.02, // Same as regular enemy
  ICE_BEAM_DAMAGE: 5, // Ice beam does 5 damage
  ICE_BEAM_RANGE: 350, // Range for beam activation (increased by 150)
  ICE_BEAM_LENGTH: 300, // Length of the beam
  ICE_BEAM_WIDTH: 20, // Width of the beam
  ICE_BULLET_DAMAGE: 20, // Ice bullets do 20 damage
  ICE_WAVE_DAMAGE: 20, // Ice wave does 20 damage
  ICE_WAVE_SPEED: 1.5, // Slower than regular bullets
  ICE_BULLET_SPEED: 2, // Same as regular enemy bullets

  // Fire enemy settings
  FIRE_DRONE_SHOOT_CHANCE: 0.015, // 1.5% per frame (slightly less than regular)
  FIRE_SPEED_SHOOT_CHANCE: 0.015, // Same as fire drone
  FIRE_SPEED_MULTIPLIER: 1.5, // 50% faster movement like ice speed
  FIRE_BULLET_SPEED: 3, // Slightly faster than regular bullets
  FIRE_BULLET_DAMAGE: 15, // Fire bullets do 15 damage

  // Rocket enemy settings
  ROCKET_SHOOT_CHANCE: 0.008, // 0.8% per frame (much less frequent)
  ROCKET_SPEED: 1.5, // Slower movement
  ROCKET_BULLET_SPEED: 1.5, // Very slow rockets
  ROCKET_DAMAGE_PER_SECOND: 5, // 5 damage per second
  ROCKET_TOTAL_DAMAGE: 30, // Total damage over 6 seconds
  ROCKET_DURATION: 6000, // 6 seconds duration

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
  SPEED_MODE_DURATION: 20000, // 20 seconds
  DARK_MODE_DURATION: 30000, // 30 seconds

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

  // Toxic enemy settings
  TOXIC_DRONE_SHOOT_CHANCE: 0.015,
  TOXIC_BULLET_SPEED: 2.5,
  TOXIC_BULLET_DAMAGE: 12,
  TOXIC_GAS_SHOOT_CHANCE: 0.01,
  TOXIC_GAS_EXPLOSION_SIZE: 180,
  TOXIC_GAS_EXPLOSION_DURATION: 1200, // ms
  TOXIC_GAS_DAMAGE: 25,

  // Dark enemy settings
  DARK_DRONE_SHOOT_CHANCE: 0.015,
  DARK_BULLET_SPEED: 2.5,
  DARK_BULLET_DAMAGE: 10,
  DARK_BEAM_DAMAGE: 8, // Dark beam does 8 damage
  DARK_BEAM_RANGE: 400, // Range for beam activation
  DARK_BEAM_LENGTH: 175, // Reduced from 350
  DARK_MULTI_SHOOT_CHANCE: 0.012,
  DARK_LASER_SPACING: 6, // Increased from 3
  DARK_SHIELD_CONNECTOR_RANGE: 400, // Range for shield connectors
  DARK_SHIELD_MAX_CONNECTIONS: 3, // Maximum enemies to shield
  DARK_CONNECTOR_WIDTH: 3, // Width of connector lines
};

// ===========================
// PERMISSION REQUIRED TO MODIFY BELOW
// This section controls mode classification logic.
// Consequences: Changing this may break mode handling or allow mode conflicts.
// All changes must be reviewed before merging.
// ===========================
// Modes with special firing modes (but use regular bullets as base):
//   - fire, ice
// Modes that override the base bullet (replace regular bullet):
//   - scrap (uses saw blade as base bullet), laz, angel
// Modes with no special firing mode (use regular bullets):
//   - (none currently)
//
// Status pickups (can always be picked up, do not affect bullet type):
//   - speed, shield, life, repair
//
// Only one main mode can be active at a time. Status pickups are always allowed.

const MODES_WITH_SPECIAL_FIRING_MODE = ["fire", "ice", "dark"];
const MODES_WITH_BULLET_OVERRIDE = ["scrap", "laz", "angel"];
const MODES_WITH_NO_SPECIAL_FIRING_MODE = [];

// Image paths
const IMAGE_PATHS = {
  PLAYER: "images/player/player.png",
  PLAYER1: "images/player/player1 (1).png",
  ANGEL: "images/player/angel (1).png",
  FIRE2: "images/player/fire2 (1).png",
  ICE2: "images/player/ice2 (1).png",
  SCRAP_SHIP: "images/player/scrap-ship.png",
  DARK_PLAYER: "images/player/dark-player.png",
  DARK_PICKUP: "images/pick-ups/dark-pickup.png",

  ENEMY: "images/enemies/base_enemies/n-enemy.png",
  ENEMY_OLD: "images/enemies/base_enemies/enemy.png", // legacy, not used by default
  ICE_DRONE: "images/enemies/base_enemies/ice/ice1-drone.png",
  ICE_SLOWER: "images/enemies/base_enemies/ice/ice2-slower.png",
  ICE_SPEED: "images/enemies/base_enemies/ice/ice3-speed.png",
  ICE_BEAM: "images/enemies/base_enemies/ice/ice5-beam.png", // Enemy image

  BULLET: "images/bullets/player-bullets/bullet.png",
  ENEMY_BULLET: "images/bullets/enemy-bullets/en-bullet.png",
  ICE_BULLET: "images/bullets/enemy-bullets/ice/ice-bullet.png",
  ICE_WAVE: "images/bullets/enemy-bullets/ice/ice-wave (1).png",
  ICE_BEAM_BULLET: "images/bullets/enemy-bullets/ice/ice-beam.png",
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
  SHIELD: "images/pick-ups/shield.png",
  SPEED: "images/pick-ups/speed.png",

  // Fire enemies
  FIRE_DRONE: "images/enemies/base_enemies/fire/fire2-drone.png",
  FIRE_SPEED: "images/enemies/base_enemies/fire/fire3-speed.png",
  FIRE_BULLET: "images/bullets/enemy-bullets/fire/fire-bullet.png",

  // Rocket enemies
  ROCKET: "images/enemies/base_enemies/fire/fire1-rocket.png",
  SIDEWINDER: "images/bullets/enemy-bullets/fire/sidewinder.png",

  // Toxic enemies
  TOXIC_DRONE: "images/enemies/base_enemies/toxic/toxic1-drone.png",
  TOXIC_GAS: "images/enemies/base_enemies/toxic/toxic2-gas.png",
  TOXIC_BULLET: "images/bullets/enemy-bullets/toxic/tox-bullet.png",
  TOXIC_CAN: "images/bullets/enemy-bullets/toxic/tox-can.png",
  TOXIC_EXPLO: "images/bullets/enemy-bullets/toxic/tox-explo.png",

  // Dark enemies
  DARK_DRONE: "images/enemies/base_enemies/dark/dark5-drone.png",
  DARK_BEAM_ENEMY: "images/enemies/base_enemies/dark/dark-beam-enemy.png",
  DARK_MULTI: "images/enemies/base_enemies/dark/dark4-multi.png",
  DARK_SHIELD: "images/enemies/base_enemies/dark/dark2-shield.png",
  DARK_BULLET: "images/bullets/enemy-bullets/dark/dark-bullet.png",
  DARK_LASER: "images/bullets/enemy-bullets/dark/dark-laz.png",
  DARK_BEAM_START: "images/bullets/enemy-bullets/dark/newbeamStart.PNG",
  DARK_BEAM_MIDDLE: "images/bullets/enemy-bullets/dark/newbeamMiddle.PNG",
  DARK_BEAM_END: "images/bullets/enemy-bullets/dark/newbeamEnd.PNG",

  // New enemy images

  // New fire enemy images
  FIRE1_ROCKET: "images/enemies/base_enemies/fire/fire1-rocket.png",
  FIRE2_DRONE: "images/enemies/base_enemies/fire/fire2-drone.png",
  FIRE3_SPEED: "images/enemies/base_enemies/fire/fire3-speed.png",

  // New ice enemy images
  ICE1_DRONE: "images/enemies/base_enemies/ice/ice1-drone.png",
  ICE2_SLOWER: "images/enemies/base_enemies/ice/ice2-slower.png",
  ICE3_SPEED: "images/enemies/base_enemies/ice/ice3-speed.png",
  ICE5_BEAM: "images/enemies/base_enemies/ice/ice5-beam.png",

  // New toxic enemy images
  TOXIC1_DRONE: "images/enemies/base_enemies/toxic/toxic1-drone.png",
  TOXIC2_GAS: "images/enemies/base_enemies/toxic/toxic2-gas.png",
  TOXIC4_TANK: "images/enemies/base_enemies/toxic/toxic4-tank.png",

  // New player bullet images
  // Remove BLACK_BULLET from IMAGE_PATHS if only used for player black bullet features.
  DARK_BULLET_PRIMER: "images/bullets/player-bullets/dark_ball-primer.png",
  DARK_HOLE: "images/bullets/player-bullets/darkhole.png",

  // New enemy bullet images
  DARK_CONNECTOR: "images/bullets/enemy-bullets/dark/dark-connector.png",
  DARK_LAZ: "images/bullets/enemy-bullets/dark/dark-laz.png",

  // New fire enemy bullet images
  FIRE_BULLET: "images/bullets/enemy-bullets/fire/fire-bullet.png",

  // New ice enemy bullet images
  ICE_BEAM_BULLET: "images/bullets/enemy-bullets/ice/ice-beam.png",
  ICE_WAVE: "images/bullets/enemy-bullets/ice/ice-wave (1).png",
  ICE_BULLET: "images/bullets/enemy-bullets/ice/ice-bullet.png",

  // New toxic enemy bullet images
  TOX_BULLET: "images/bullets/enemy-bullets/toxic/tox-bullet.png",
  TOX_CAN: "images/bullets/enemy-bullets/toxic/tox-can.png",
  TOX_EXPLO: "images/bullets/enemy-bullets/toxic/tox-explo.png",
};
