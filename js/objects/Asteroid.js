class Asteroid extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Generate a random asteroid texture
        const textureKey = 'asteroid_' + Math.random();
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Random pastel color
        const colors = [0xffb3ba, 0xffdfba, 0xffffba, 0xbaffc9, 0xbae1ff, 0xe0bbff];
        const color = colors[Math.floor(Math.random() * colors.length)];
        graphics.fillStyle(color);
        graphics.lineStyle(2, 0x888888);

        // Create jagged polygon
        const points = [];
        const numPoints = 8;
        const radius = 20;
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const r = radius + Phaser.Math.Between(-5, 5);
            points.push({
                x: Math.cos(angle) * r + 25,
                y: Math.sin(angle) * r + 25
            });
        }
        
        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();
        
        graphics.generateTexture(textureKey, 50, 50);
        graphics.destroy();

        super(scene, x, y, textureKey);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set random velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = GameConfig.ASTEROID_SPEED;
        this.body.velocity.x = Math.cos(angle) * speed;
        this.body.velocity.y = Math.sin(angle) * speed;

        this.setCollideWorldBounds(false);
        
        // Slow rotation
        this.rotationSpeed = Phaser.Math.FloatBetween(-0.02, 0.02);
    }

    update() {
        this.rotation += this.rotationSpeed;
        
        // Wrap around screen edges
        if (this.x < -25) {
            this.x = GameConfig.WIDTH + 25;
        } else if (this.x > GameConfig.WIDTH + 25) {
            this.x = -25;
        }

        if (this.y < -25) {
            this.y = GameConfig.HEIGHT + 25;
        } else if (this.y > GameConfig.HEIGHT + 25) {
            this.y = -25;
        }
    }

    destroy() {
        // Create particle effect
        this.scene.createParticles(this.x, this.y, 0xffaa00);
        
        super.destroy();
    }
}
