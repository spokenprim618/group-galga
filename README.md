# Galaga Game - Organized Codebase

This is a Galaga-style space shooter game built with p5.js. The codebase has been organized into logical modules for better maintainability and readability.

## Project Structure

```
group-galga-1/
├── gameIndex.html          # Main HTML file
├── js/
│   ├── config.js           # Game configuration and constants
│   ├── main.js             # Main game loop and initialization
│   ├── classes/
│   │   ├── Player.js       # Player class and movement
│   │   ├── Bullet.js       # All bullet types (regular, ice, enemy, saw blade)
│   │   ├── Enemy.js        # Alien enemy class
│   │   └── Pickup.js       # Pickup items class
│   ├── managers/
│   │   ├── GameState.js    # Game state management
│   │   ├── AssetManager.js # Image loading and management
│   │   └── GameManager.js  # Game logic and entity management
│   ├── ui/
│   │   └── UI.js          # User interface and text rendering
│   └── systems/
│       ├── FlameSystem.js  # Flame thrower mechanics
│       └── WeaponSystem.js # Weapon and shooting mechanics
├── images/                 # Game assets
└── script.js              # Legacy file (unused)
```

## Key Features

### Game Mechanics
- **Player Movement**: WASD keys for movement, mouse for rotation
- **Multiple Weapon Types**: Regular bullets, laser spread, ice bullets, saw blades, flame thrower
- **Power-ups**: Fire mode, ice mode, laser mode, angel mode, scrap mode
- **Enemy AI**: Random movement and shooting patterns
- **Pickup System**: Various power-ups and health items

### Code Organization

#### Configuration (`js/config.js`)
- All game constants and settings
- Image paths
- Game states and durations

#### Classes (`js/classes/`)
- **Player.js**: Player ship with rotation and movement
- **Bullet.js**: All bullet types with different behaviors
- **Enemy.js**: Alien enemies with AI
- **Pickup.js**: Collectible items

#### Managers (`js/managers/`)
- **GameState.js**: Centralized state management
- **AssetManager.js**: Image loading and flame graphics
- **GameManager.js**: Game logic, spawning, and collision detection

#### UI (`js/ui/`)
- **UI.js**: All user interface elements and text rendering

#### Systems (`js/systems/`)
- **FlameSystem.js**: Flame thrower mechanics and collision
- **WeaponSystem.js**: All shooting mechanics and bullet creation

## How to Play

1. **Movement**: Use WASD keys to move the ship
2. **Aim**: Move the mouse to rotate the ship
3. **Shoot**: Left click to fire bullets
4. **Special Weapons**:
   - **F key**: Activate flame thrower (when in fire mode)
   - **E key**: Fire ice bullet (when in ice mode)
5. **Power-ups**: Collect pickups to activate special modes

## Game Modes

- **Fire Mode**: Flame thrower weapon
- **Ice Mode**: Exploding ice bullets
- **Laser Mode**: Triple laser spread
- **Angel Mode**: 13-way laser spread (temporary invincibility)
- **Scrap Mode**: Bouncing saw blade bullets

## Technical Improvements

### Code Organization Benefits
1. **Modularity**: Each component has a single responsibility
2. **Maintainability**: Easy to find and modify specific features
3. **Reusability**: Classes can be easily extended or reused
4. **Readability**: Clear separation of concerns
5. **Debugging**: Easier to isolate and fix issues

### Performance Optimizations
- Pre-rendered flame graphics
- Efficient collision detection
- Optimized bullet management
- Frame rate throttling for animations

## File Dependencies

The files must be loaded in the correct order as specified in `gameIndex.html`:
1. Configuration first
2. Classes (dependencies for managers)
3. Managers (dependencies for systems)
4. UI and Systems
5. Main game file last

## Future Enhancements

The organized structure makes it easy to add:
- New weapon types
- Additional enemy types
- More power-up modes
- Sound effects
- Particle systems
- Level progression
- High score system 