// Main game initialization
const config = {
    type: Phaser.AUTO,
    width: GameConfig.WIDTH,
    height: GameConfig.HEIGHT,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [TitleScene, GameScene]
};

const game = new Phaser.Game(config);
