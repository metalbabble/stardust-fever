// Game configuration constants
const GameConfig = {
    // My format is major.minor.monthday, with a suffix (a,b,c,d) for quick hotfixes
    VERSION: '1.0.32-e', 
    
    WIDTH: 800,
    HEIGHT: 600,
    PLAYER_ROTATION_SPEED: 0.05,
    PLAYER_MOVE_SPEED: 200,
    BULLET_SPEED: 400,
    BULLET_FIRE_RATE: 750, // milliseconds
    ASTEROID_SPEED: 50,
    BUGGY_SPEED: 100,
    SPAWN_RATE_INITIAL: 2000, // milliseconds
    SPAWN_RATE_MIN: 500, // minimum spawn rate
    SPAWN_RATE_DECREASE: 50, // decrease per spawn
    ASTEROID_SPAWN_WEIGHT: 0.7, // 70% chance for asteroid
    ATOM_SPAWN_INTERVAL_MIN: 20000, // 20 seconds
    ATOM_SPAWN_INTERVAL_MAX: 30000, // 30 seconds
    INVINCIBILITY_DURATION: 3000, // 3 seconds

    // Number of available background music tracks (files named m1.mp3, m2.mp3, ... up to the value in MUSIC_COUNT)
    MUSIC_COUNT: 10
};
