class Buggy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, player) {
        // Create buggy texture if it doesn't exist
        if (!scene.textures.exists('buggy')) {
            const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
            
            // Draw a simple alien bug shape
            graphics.fillStyle(0xff0000);
            graphics.fillCircle(15, 15, 12); // Body
            
            // Eyes
            graphics.fillStyle(0xffff00);
            graphics.fillCircle(12, 12, 3);
            graphics.fillCircle(18, 12, 3);
            
            // Antennae
            graphics.lineStyle(2, 0xff0000);
            graphics.beginPath();
            graphics.moveTo(10, 10);
            graphics.lineTo(5, 5);
            graphics.moveTo(20, 10);
            graphics.lineTo(25, 5);
            graphics.strokePath();
            
            graphics.generateTexture('buggy', 30, 30);
            graphics.destroy();
        }

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
