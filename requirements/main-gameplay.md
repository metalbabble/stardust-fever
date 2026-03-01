# Main gameplay

- The background of the main game play area is dark blue with small 1-pixel silver "stars" randomly genrated around to give the illustion of outerspace.
- The player starts off in the middle of the screen
- If the player passes off the edge of the play area, they are transported to the oposite side
- As the game proceeds, the following [game-objects](game-objects.md) randomly enter the playfield: asteroids, buggy. As the game proceeds the frequency that these appear begins to increase, making the game more challenging. At first, a item appears every couple seconds, but this rate increases as the game plays.
- Asteroids are the most common object to appear
- Note that atoms also will appear in random locations throughout the gameplay area as specified in [game-objects](game-objects.md)

# Shields / Health

- The player has "sheilds" which works like health. The game play starts with sheilds at 100. When a player collides with a buggy or asteroid - they lose 10 health points. When the health points go below zero, the game is over. (See below)
- The amount of shield power is displayed as a bar chart (a health bar) on the top-left of the gameplay area. There is small text that says "SHEILD %" in front of the bar. THe bar shows %100 down to zero as the player's health increases or decreases.
- When the shield is being decreased due to a player collision, there should be a brief period of invincibility where the player does not take consecutive damage from objects. This period of invincibility only lasts for a few seconds. While invincible, the player graphic is transparent to show this state.

# Game over

When the player has no more health, the game ends. All moving objects stop. The image of the player disappears. The large words "Game Over" appear on the screen, and the final score is visible at the bottom. There is normal-sized text under "game over" text that says "Press ENTER to continue". When they press enter the game restarts.