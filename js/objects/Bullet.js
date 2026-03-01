class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Create bullet texture if it doesn't exist
        if (!scene.textures.exists('bullet')) {
            const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
            graphics.fillStyle(0xffff00);
            graphics.fillCircle(3, 3, 3);
            graphics.generateTexture('bullet', 6, 6);
            graphics.destroy();
        }

        super(scene, x, y, 'bullet');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = GameConfig.BULLET_SPEED;
        this.setCollideWorldBounds(false);
    }

    fire(x, y, angle, speedMultiplier = 1, sizeMultiplier = 1) {
        this.setPosition(x, y);
        this.setRotation(angle);
        this.setScale(sizeMultiplier);
        
        this.scene.physics.velocityFromRotation(
            angle,
            this.speed * speedMultiplier,
            this.body.velocity
        );

        this.setActive(true);
        this.setVisible(true);
    }

    update() {
        // Destroy bullet if it goes off screen
        if (this.x < -10 || this.x > GameConfig.WIDTH + 10 ||
            this.y < -10 || this.y > GameConfig.HEIGHT + 10) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
