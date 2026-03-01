# General architecture

- Stardust Fever is a browser-based game running on the Phaser game engine
- The various game objects that appear during the [main gameplay](main-gameplay.md) are listed in [game-objects.md](game-objects.md); this describes their appearances and behaviors
- Extending the game can be done by introducing new game objects at a future time. Introduction of new mechanics of gameplay would happen in [main-gameplay.md](main-gameplay.md)
- Assets such as images are stored in the "assets" directory.
- This game uses common game development concepts such as movement and collisions.

# Game flow

- The game starts with a title screen; see [title-screen.md](tile-screen.md)
- After viewing the title screen, the game proceeds as described in [main-gameplay.md](main-gameplay.md)

# Other global concepts about this game

- The game tracks a score which appears as text on the bottom of the screen. When starting a new game (starting main-gameplay) the score starts at zero.
- When a new game starts any power up effects are removed, and the rates items appear return to their defaults.