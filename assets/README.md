# Assets

This folder contains game assets for Stardust Fever.

## Current Implementation

Currently, all game graphics are generated dynamically using Phaser's graphics API:

- **Player ship**: Generated as a green triangle in `js/objects/Player.js`
- **Buggy alien**: Generated as a red bug sprite in `js/objects/Buggy.js`
- **Asteroid**: Randomly generated jagged polygons in `js/objects/Asteroid.js`
- **Bullet**: Generated as yellow circles in `js/objects/Bullet.js`
- **Atom**: Generated as cyan atom symbol in `js/objects/Atom.js`

## Future Enhancements

To replace the dynamically generated graphics with custom artwork:

1. Add `player.gif` - A sprite for the player's spaceship
2. Add `buggy.gif` - A sprite for the alien enemy
3. Update the respective class files to load these images instead of generating graphics

## Sounds

Sound effects are currently generated using Phaser's Web Audio API. To add custom sounds:

- `boom.wav` - Explosion sound when asteroids are destroyed
- `chirp.wav` - Sound when buggy aliens are destroyed
- `laser.wav` - Pulsing laser sound for collecting atoms
- `woosh.wav` - Wooshing sound for black hole power-up
