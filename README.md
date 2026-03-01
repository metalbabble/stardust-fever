## Stardust Fever

Stardust fever is a retro arcade-inspired space game where you control a ship and shoot asteroids and waves of attacking aliens.

# Contributing

The requirements and specifications of this project are stored in the requirements folder.

# Setup and running the game

## Requirements

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (required for loading game files)

## Running the Game

### Option 1: Using Python (Recommended)

If you have Python installed, navigate to the project directory and run:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 2: Using Node.js

If you have Node.js installed, you can use `npx`:

```bash
npx http-server -p 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 3: Using VS Code Live Server

If you're using Visual Studio Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Game Controls

- **Left/Right Arrow Keys**: Rotate your ship
- **Up Arrow Key**: Move forward
- **ENTER**: Start a new game (from title screen)

## Gameplay

- Shoot asteroids and alien bugs to earn points
- Collect glowing atoms to receive random power-ups
- Survive as long as possible as the difficulty increases!

## Project Structure

```
stardust-fever/
├── index.html          # Main HTML entry point
├── js/
│   ├── main.js         # Game initialization
│   ├── config.js       # Game configuration constants
│   ├── PowerUpManager.js  # Power-up system
│   ├── scenes/
│   │   ├── TitleScene.js  # Title screen
│   │   └── GameScene.js   # Main gameplay
│   └── objects/
│       ├── Player.js      # Player spaceship
│       ├── Bullet.js      # Bullet projectiles
│       ├── Asteroid.js    # Asteroid enemies
│       ├── Buggy.js       # Alien enemies
│       └── Atom.js        # Power-up collectibles
├── assets/             # Game assets (currently procedurally generated)
└── requirements/       # Game design documents
```
