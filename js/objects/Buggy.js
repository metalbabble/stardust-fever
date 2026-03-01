class Buggy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, player) {
        // Use the preloaded buggy.gif image
        super(scene, x, y, 'buggy');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.speed = GameConfig.BUGGY_SPEED;
        this.setCollideWorldBounds(false);
    }

    update() {
        if (!this.player || !this.active) return;

        // Chase the player
        const angle = Phaser.Math.Angle.Between(
            this.x, this.y,
            this.player.x, this.player.y
        );

        this.scene.physics.velocityFromRotation(
            angle,
            this.speed,
            this.body.velocity
        );

        this.rotation = angle + Math.PI / 2;

        // Remove if too far off screen
        if (this.x < -100 || this.x > GameConfig.WIDTH + 100 ||
            this.y < -100 || this.y > GameConfig.HEIGHT + 100) {
            this.destroy();
        }
    }

    destroy() {
        // Create particle effect
        if (this.scene && this.scene.createParticles) {
            this.scene.createParticles(this.x, this.y, 0xff0000);
        }
        
        super.destroy();
    }
}
