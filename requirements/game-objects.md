## Game Objects

This file lists the primary game objects, describing their behaviors and appearance.

# player
- The main player-controlled object in the game. The player appears during [main-gameplay](main-gameplay.md).
- The player is a small spaceship and is represented using the sprite graphic "player.gif" (in the assets folder)
- The left and right keyboard keys rotate the player (so the graphic rotates to the angle the player is facing.) Pressing the up arrow moves the player forward in the direction they are currently facing.
- If a player leaves the boundaries of the play area they appear on the opposite side of the screen

# bullet
- A small projectile that will destory enemies and other destroyable objects
- These are shot from the player's ship; so they are generated from the player's ship, moving in the direction the player is currently facing.
- A bullet fires automatically (no key press needed) every second initially. As players get various "power-ups" this rate of fire will increase.
- Many bullets may appear on the screen at once.
- The size, speed, and other characterisitcs of bullets may get upgrade through power-ups.

# buggy (an alien)
- Uses the the asset "buggy.gif"
- Chases the player
- Is destroyable, when destroyied an 8-bit "chirp" sound plays, and pixel particles are projected from the destroyied object.
- Awards 50 points to the player

# asteroid
-Visually, these are genreated as jagged polygons (so they look like a rock) - they randomly have a solid pastel color.
- Is destroyable, when destroyied an 8-bit "boom" sound plays, and pixel particles are projected from the destroyied object.
- Awards 10 points to player.
- These float slowly in a random direction
- If one exists the gameplay area, it appears on the opposite side

# atom
- This is a good item.
- Bullet don't destory it.
- These appear every 20-30 seconds in a random location.
- If the player collides with the atom, the atom disappears and a pulsing laser sound is played. Then, the player is awared a random "power-up" as described in [power-ups.md](power-ups.md). When a power-up is granted to the player, text showing the name of the power-up is temporarily shown at the top of the screen, centered - so that the user will know what new gameplay will occur. Awards 100 points to player.