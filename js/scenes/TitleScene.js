class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        // Create starfield background
        this.createStarfield();

        // Title text
        const title = this.add.text(
            GameConfig.WIDTH / 2,
            150,
            'STARDUST FEVER',
            {
                font: 'bold 64px Courier New',
                fill: '#ffffff',
                stroke: '#4444ff',
                strokeThickness: 4
            }
        );
        title.setOrigin(0.5);

        // Instructions text
        const instructions = this.add.text(
            GameConfig.WIDTH / 2,
            300,
            'Use left/right arrow keys to rotate ship.\nShoot asteroids and aliens - but try and\ncollect "atoms" to receive various power ups!\nHow long can you survive!?',
            {
                font: '18px Courier New',
                fill: '#ffff00',
                align: 'center'
            }
        );
        instructions.setOrigin(0.5);

        // Start prompt
        const startText = this.add.text(
            GameConfig.WIDTH / 2,
            450,
            'Press ENTER to start a new game',
            {
                font: 'bold 20px Courier New',
                fill: '#00ff00'
            }
        );
        startText.setOrigin(0.5);

        // Make start text blink
        this.tweens.add({
            targets: startText,
            alpha: 0,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Listen for Enter key
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });
    }

    createStarfield() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x001144, 1);
        graphics.fillRect(0, 0, GameConfig.WIDTH, GameConfig.HEIGHT);

        // Add stars
        for (let i = 0; i < 200; i++) {
            const x = Phaser.Math.Between(0, GameConfig.WIDTH);
            const y = Phaser.Math.Between(0, GameConfig.HEIGHT);
            const brightness = Phaser.Math.FloatBetween(0.3, 1);
            graphics.fillStyle(Phaser.Display.Color.GetColor(
                Math.floor(192 * brightness),
                Math.floor(192 * brightness),
                Math.floor(192 * brightness)
            ), 1);
            graphics.fillRect(x, y, 1, 1);
        }
    }
}
